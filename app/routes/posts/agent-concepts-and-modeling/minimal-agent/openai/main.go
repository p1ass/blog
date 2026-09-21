package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

const (
	instructions = "あなたは天気を答えるアシスタントです。天気は必ず get_weather で調べてください。"
	prompt       = "東京と大阪の天気を教えてください"
	maxTurns     = 10
)

func main() {
	ctx := context.Background()
	client := openai.NewClient()

	tools := []responses.ToolUnionParam{{OfFunction: &responses.FunctionToolParam{
		Name:        "get_weather",
		Description: openai.String("指定した都市の現在の天気を返す"),
		Parameters: map[string]any{
			"type":       "object",
			"properties": map[string]any{"city": map[string]string{"type": "string"}},
			"required":   []string{"city"},
		},
	}}}
	params := responses.ResponseNewParams{
		Model:        openai.ChatModelGPT5_6Luna,
		Instructions: openai.String(instructions),
		Input:        responses.ResponseNewParamsInputUnion{OfString: openai.String(prompt)},
		Tools:        tools,
	}

	for turn := range maxTurns {
		resp, err := client.Responses.New(ctx, params)
		if err != nil {
			log.Fatal(err)
		}
		params.PreviousResponseID = openai.String(resp.ID)

		var results responses.ResponseInputParam
		for _, item := range resp.Output {
			if item.Type != "function_call" {
				continue
			}
			call := item.AsFunctionCall()
			log.Printf("turn %d: %s %s", turn+1, call.Name, call.Arguments)
			out, err := runTool(call.Name, []byte(call.Arguments))
			if err != nil {
				out = err.Error()
			}
			result := responses.ResponseInputItemParamOfFunctionCallOutput(out)
			result.OfFunctionCallOutput.CallID = openai.String(call.CallID)
			results = append(results, result)
		}

		if len(results) == 0 {
			fmt.Println(resp.OutputText())
			return
		}

		params.Input = responses.ResponseNewParamsInputUnion{OfInputItemList: results}
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
