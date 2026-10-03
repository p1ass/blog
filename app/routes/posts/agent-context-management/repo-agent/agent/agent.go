package agent

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/anthropics/anthropic-sdk-go"
)

type Agent struct {
	Model        anthropic.Model
	Instructions string
	Tools        []Tool
	Memory       *Memory
	ToolSearch   bool
}

func (a *Agent) tool(name string) (Tool, bool) {
	for _, t := range a.Tools {
		if t.Name == name {
			return t, true
		}
	}
	return Tool{}, false
}

type ContextConfig struct {
	Cache          bool
	ClearTrigger   int64
	ClearAtLeast   int64
	CompactTrigger int64
}

type Usage struct {
	Turns            int
	ToolCalls        int
	ToolErrors       int
	InputTokens      int64
	CacheWriteTokens int64
	CacheReadTokens  int64
	OutputTokens     int64
	PeakContext      int64
	Clears           int
	ClearedTokens    int64
	Compactions      int
	CompactionTokens int64
}

func (u Usage) TotalInputTokens() int64 {
	return u.InputTokens + u.CacheWriteTokens + u.CacheReadTokens
}

type Result struct {
	FinalOutput string
	Usage       Usage
}

type Runner struct {
	Client   anthropic.Client
	MaxTurns int
	Context  ContextConfig
}

func (r *Runner) params(a *Agent, input string) anthropic.BetaMessageNewParams {
	var tools []anthropic.BetaToolUnionParam
	if a.ToolSearch {
		tools = append(tools, anthropic.BetaToolUnionParam{OfToolSearchToolRegex20251119: &anthropic.BetaToolSearchToolRegex20251119Param{
			Type: anthropic.BetaToolSearchToolRegex20251119TypeToolSearchToolRegex20251119,
		}})
	}
	for _, t := range a.Tools {
		tools = append(tools, t.param())
	}
	if a.Memory != nil {
		tools = append(tools, anthropic.BetaToolUnionParam{OfMemoryTool20250818: &anthropic.BetaMemoryTool20250818Param{}})
	}

	p := anthropic.BetaMessageNewParams{
		Model:     a.Model,
		MaxTokens: 16000,
		System:    []anthropic.BetaTextBlockParam{{Text: a.Instructions}},
		Messages:  []anthropic.BetaMessageParam{anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock(input))},
		Tools:     tools,
	}

	c := r.Context
	if c.Cache {
		p.CacheControl = anthropic.NewBetaCacheControlEphemeralParam()
	}
	if c.ClearTrigger > 0 {
		p.Betas = append(p.Betas, anthropic.AnthropicBetaContextManagement2025_06_27)
		p.ContextManagement.Edits = append(p.ContextManagement.Edits, anthropic.BetaContextManagementConfigEditUnionParam{
			OfClearToolUses20250919: &anthropic.BetaClearToolUses20250919EditParam{
				Trigger:      anthropic.BetaClearToolUses20250919EditTriggerUnionParam{OfInputTokens: &anthropic.BetaInputTokensTriggerParam{Value: c.ClearTrigger}},
				ClearAtLeast: anthropic.BetaInputTokensClearAtLeastParam{Value: c.ClearAtLeast},
			},
		})
	}
	if c.CompactTrigger > 0 {
		p.Betas = append(p.Betas, anthropic.AnthropicBetaCompact2026_01_12)
		p.ContextManagement.Edits = append(p.ContextManagement.Edits, anthropic.BetaContextManagementConfigEditUnionParam{
			OfCompact20260112: &anthropic.BetaCompact20260112EditParam{
				Trigger: anthropic.BetaInputTokensTriggerParam{Value: c.CompactTrigger},
			},
		})
	}
	return p
}

func (r *Runner) Run(ctx context.Context, a *Agent, input string) (*Result, error) {
	params := r.params(a, input)

	var usage Usage
	for turn := range r.MaxTurns {
		resp, err := r.Client.Beta.Messages.New(ctx, params)
		if err != nil {
			return &Result{Usage: usage}, err
		}
		usage.Turns = turn + 1
		usage.add(turn+1, resp)
		params.Messages = append(params.Messages, resp.ToParam())

		if resp.StopReason == anthropic.BetaStopReasonPauseTurn {
			continue
		}
		results := a.runTools(ctx, turn+1, resp.Content, &usage)
		if len(results) == 0 {
			return &Result{FinalOutput: finalOutput(resp.Content), Usage: usage}, nil
		}
		params.Messages = append(params.Messages, anthropic.NewBetaUserMessage(results...))
	}
	return &Result{Usage: usage}, fmt.Errorf("max turns (%d) exceeded", r.MaxTurns)
}

func (u *Usage) add(turn int, resp *anthropic.BetaMessage) {
	ru := resp.Usage
	u.InputTokens += ru.InputTokens
	u.CacheWriteTokens += ru.CacheCreationInputTokens
	u.CacheReadTokens += ru.CacheReadInputTokens
	u.OutputTokens += ru.OutputTokens
	u.PeakContext = max(u.PeakContext, ru.InputTokens+ru.CacheCreationInputTokens+ru.CacheReadInputTokens)

	for _, it := range ru.Iterations {
		if c, ok := it.AsAny().(anthropic.BetaCompactionIterationUsage); ok {
			u.Compactions++
			u.CompactionTokens += c.InputTokens + c.CacheCreationInputTokens + c.CacheReadInputTokens + c.OutputTokens
			log.Printf("turn %d: compaction", turn)
		}
	}
	for _, e := range resp.ContextManagement.AppliedEdits {
		if c, ok := e.AsAny().(anthropic.BetaClearToolUses20250919EditResponse); ok {
			u.Clears++
			u.ClearedTokens += c.ClearedInputTokens
			log.Printf("turn %d: cleared %d tool uses (%d tokens)", turn, c.ClearedToolUses, c.ClearedInputTokens)
		}
	}
}

func (a *Agent) runTools(ctx context.Context, turn int, content []anthropic.BetaContentBlockUnion, usage *Usage) []anthropic.BetaContentBlockParamUnion {
	var results []anthropic.BetaContentBlockParamUnion
	for _, block := range content {
		call, ok := block.AsAny().(anthropic.BetaToolUseBlock)
		if !ok {
			continue
		}
		usage.ToolCalls++
		out, err := a.call(ctx, call)
		if err != nil {
			usage.ToolErrors++
			out = err.Error()
		}
		log.Printf("turn %d: %s %s -> %s", turn, call.Name, call.JSON.Input.Raw(), truncate(out, 120))
		results = append(results, anthropic.NewBetaToolResultBlock(call.ID, out, err != nil))
	}
	return results
}

func (a *Agent) call(ctx context.Context, call anthropic.BetaToolUseBlock) (string, error) {
	if call.Name == "memory" && a.Memory != nil {
		var cmd anthropic.BetaMemoryTool20250818CommandUnion
		if err := json.Unmarshal([]byte(call.JSON.Input.Raw()), &cmd); err != nil {
			return "", err
		}
		return a.Memory.Run(cmd)
	}
	t, ok := a.tool(call.Name)
	if !ok {
		return "", fmt.Errorf("unknown tool: %s", call.Name)
	}
	return t.Run(ctx, json.RawMessage(call.JSON.Input.Raw()))
}

func finalOutput(content []anthropic.BetaContentBlockUnion) string {
	var texts []string
	for _, block := range content {
		if text, ok := block.AsAny().(anthropic.BetaTextBlock); ok {
			texts = append(texts, text.Text)
		}
	}
	return strings.Join(texts, "\n")
}

func truncate(s string, n int) string {
	s = strings.ReplaceAll(s, "\n", "\\n")
	r := []rune(s)
	if len(r) <= n {
		return s
	}
	return string(r[:n]) + "..."
}
