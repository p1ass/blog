package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/anthropics/anthropic-sdk-go"
)

const (
	instructions = "あなたは天気を答えるアシスタントです。天気は必ず get_weather で調べてください。"
	prompt       = "東京と大阪の天気を教えてください"
	maxTurns     = 10
)

func main() {
	ctx := context.Background()
	client := anthropic.NewClient()

	tools := []anthropic.ToolUnionParam{{OfTool: &anthropic.ToolParam{
		Name:        "get_weather",
		Description: anthropic.String("指定した都市の現在の天気を返す"),
		InputSchema: anthropic.ToolInputSchemaParam{
			Properties: map[string]any{"city": map[string]string{"type": "string"}},
			Required:   []string{"city"},
		},
	}}}
	params := anthropic.MessageNewParams{
		Model:     anthropic.ModelClaudeSonnet5,
		MaxTokens: 1024,
		System:    []anthropic.TextBlockParam{{Text: instructions}},
		Messages:  []anthropic.MessageParam{anthropic.NewUserMessage(anthropic.NewTextBlock(prompt))},
		Tools:     tools,
	}

	for turn := range maxTurns {
		resp, err := client.Messages.New(ctx, params)
		if err != nil {
			log.Fatal(err)
		}
		params.Messages = append(params.Messages, resp.ToParam())

		var results []anthropic.ContentBlockParamUnion
		for _, block := range resp.Content {
			call, ok := block.AsAny().(anthropic.ToolUseBlock)
			if !ok {
				continue
			}
			log.Printf("turn %d: %s %s", turn+1, call.Name, call.Input)
			out, err := runTool(call.Name, call.Input)
			isError := err != nil
			if isError {
				out = err.Error()
			}
			results = append(results, anthropic.NewToolResultBlock(call.ID, out, isError))
		}

		if len(results) == 0 {
			for _, block := range resp.Content {
				if text, ok := block.AsAny().(anthropic.TextBlock); ok {
					fmt.Println(text.Text)
				}
			}
			return
		}

		params.Messages = append(params.Messages, anthropic.NewUserMessage(results...))
	}
	log.Fatalf("max turns (%d) exceeded", maxTurns)
}

func runTool(name string, input []byte) (string, error) {
	switch name {
	case "get_weather":
		var args struct {
			City string `json:"city"`
		}
		if err := json.Unmarshal(input, &args); err != nil {
			return "", err
		}
		return fmt.Sprintf("%s は晴れ、気温は 24 度", args.City), nil
	default:
		return "", fmt.Errorf("unknown tool: %s", name)
	}
}
