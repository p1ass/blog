package agent

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/anthropics/anthropic-sdk-go"
)

type Agent struct {
	Model        anthropic.Model
	Instructions string
	Tools        []Tool
}

func (a *Agent) tool(name string) (Tool, bool) {
	for _, t := range a.Tools {
		if t.Name == name {
			return t, true
		}
	}
	return Tool{}, false
}

type Usage struct {
	Turns       int
	ToolCalls   int
	ToolErrors  int
	InputTokens int64
}

type Result struct {
	FinalOutput string
	Usage       Usage
}

type Runner struct {
	Client   anthropic.Client
	MaxTurns int
}

func (r *Runner) Run(ctx context.Context, a *Agent, input string) (*Result, error) {
	var tools []anthropic.ToolUnionParam
	for _, t := range a.Tools {
		tools = append(tools, t.param())
	}
	params := anthropic.MessageNewParams{
		Model:     a.Model,
		MaxTokens: 4096,
		System:    []anthropic.TextBlockParam{{Text: a.Instructions}},
		Messages:  []anthropic.MessageParam{anthropic.NewUserMessage(anthropic.NewTextBlock(input))},
		Tools:     tools,
	}

	var usage Usage
	for turn := range r.MaxTurns {
		resp, err := r.Client.Messages.New(ctx, params)
		if err != nil {
			return &Result{Usage: usage}, err
		}
		usage.Turns = turn + 1
		usage.InputTokens += resp.Usage.InputTokens
		params.Messages = append(params.Messages, resp.ToParam())

		results := a.runTools(ctx, turn+1, resp.Content, &usage)
		if len(results) == 0 {
			return &Result{FinalOutput: finalOutput(resp.Content), Usage: usage}, nil
		}
		params.Messages = append(params.Messages, anthropic.NewUserMessage(results...))
	}
	return &Result{Usage: usage}, fmt.Errorf("max turns (%d) exceeded", r.MaxTurns)
}

func (a *Agent) runTools(ctx context.Context, turn int, content []anthropic.ContentBlockUnion, usage *Usage) []anthropic.ContentBlockParamUnion {
	var results []anthropic.ContentBlockParamUnion
	for _, block := range content {
		call, ok := block.AsAny().(anthropic.ToolUseBlock)
		if !ok {
			continue
		}
		usage.ToolCalls++
		out, err := a.call(ctx, call)
		if err != nil {
			usage.ToolErrors++
			out = err.Error()
		}
		log.Printf("turn %d: %s %s -> %s", turn, call.Name, call.Input, truncate(out, 120))
		results = append(results, anthropic.NewToolResultBlock(call.ID, out, err != nil))
	}
	return results
}

func (a *Agent) call(ctx context.Context, call anthropic.ToolUseBlock) (string, error) {
	t, ok := a.tool(call.Name)
	if !ok {
		return "", fmt.Errorf("unknown tool: %s", call.Name)
	}
	return t.Run(ctx, call.Input)
}

func finalOutput(content []anthropic.ContentBlockUnion) string {
	var texts []string
	for _, block := range content {
		if text, ok := block.AsAny().(anthropic.TextBlock); ok {
			texts = append(texts, text.Text)
		}
	}
	return strings.Join(texts, "\n")
}

func truncate(s string, n int) string {
	r := []rune(s)
	if len(r) <= n {
		return s
	}
	return string(r[:n]) + "..."
}
