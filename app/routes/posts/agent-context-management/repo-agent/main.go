package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/p1ass/blog/app/routes/posts/agent-context-management/repo-agent/agent"
)

const (
	instructions = "あなたはリポジトリの調査アシスタントです。Tool で参照できるのは OpenAI Agents SDK (openai-agents-python) v0.23.1 のリポジトリです。推測で答えず、必ずソースコードを読んで確かめてください。"
	prompt       = `src/agents のソースコードを読んで、次の質問に答えてください。

q1. Runner.run の max_turns の既定値
q2. max_turns を超えたときに送出される例外のクラス名
q3. MCPServerStdio の client_session_timeout_seconds の既定値
q4. function_tool デコレーターの timeout_behavior の既定値
q5. RunConfig の workflow_name の既定値
q6. RunConfig の tool_not_found_behavior の既定値
q7. Tool の実行に失敗したときに、既定で Model に返されるメッセージの文字列
q8. name が "Billing Agent" の Agent へ Handoff するときの、既定の Tool の名前
q9. 入力のガードレールの tripwire が発火したときに送出される例外のクラス名
q10. Agent の tool_use_behavior の既定値

最後に、q1 から q10 をキーとし、答えを値とした JSON オブジェクトを ` + "```json" + ` のコードブロックで出力してください。数値は数値型、それ以外は文字列型にしてください。`
)

func main() {
	repo := flag.String("repo", "openai-agents-python", "path to openai-agents-python v0.23.1")
	n := flag.Int("n", 1, "number of runs")
	cache := flag.Bool("cache", false, "enable prompt caching")
	clear := flag.Int64("clear", 0, "input tokens to trigger clearing old tool results (0 disables)")
	clearAtLeast := flag.Int64("clear-at-least", 0, "minimum input tokens to clear at once")
	compact := flag.Int64("compact", 0, "input tokens to trigger compaction (0 disables)")
	memory := flag.Bool("memory", false, "enable the memory tool")
	extra := flag.Bool("extra-tools", false, "add 40 tools that are not used for the questions")
	toolSearch := flag.Bool("tool-search", false, "defer loading the extra tools and enable tool search")
	flag.Parse()

	root, err := os.OpenRoot(*repo)
	if err != nil {
		log.Fatal(err)
	}
	runner := &agent.Runner{
		Client:   anthropic.NewClient(),
		MaxTurns: 50,
		Context: agent.ContextConfig{
			Cache:          *cache,
			ClearTrigger:   *clear,
			ClearAtLeast:   *clearAtLeast,
			CompactTrigger: *compact,
		},
	}

	for i := range *n {
		a := &agent.Agent{
			Model:        anthropic.ModelClaudeSonnet5_5,
			Instructions: instructions,
			Tools:        repoTools(root),
			ToolSearch:   *toolSearch,
		}
		if *extra || *toolSearch {
			a.Tools = append(a.Tools, extraTools(*toolSearch)...)
		}
		if *memory {
			dir, err := os.MkdirTemp("", "memories")
			if err != nil {
				log.Fatal(err)
			}
			if a.Memory, err = agent.NewMemory(dir); err != nil {
				log.Fatal(err)
			}
		}

		res, err := runner.Run(context.Background(), a, prompt)
		if err != nil {
			log.Printf("error: %v", err)
		} else {
			log.Printf("final: %s", res.FinalOutput)
		}
		u := res.Usage
		fmt.Printf("run %d: turns=%d calls=%d errors=%d input_tokens=%d cache_read=%d cache_write=%d output_tokens=%d peak_context=%d clears=%d compactions=%d compaction_tokens=%d score=%d/%d\n",
			i+1, u.Turns, u.ToolCalls, u.ToolErrors, u.TotalInputTokens(), u.CacheReadTokens, u.CacheWriteTokens, u.OutputTokens, u.PeakContext, u.Clears, u.Compactions, u.CompactionTokens, score(res.FinalOutput), len(answers))
	}
}
