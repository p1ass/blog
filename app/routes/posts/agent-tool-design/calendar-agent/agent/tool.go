package agent

import (
	"context"
	"encoding/json"

	"github.com/anthropics/anthropic-sdk-go"
)

type Tool struct {
	Name        string
	Description string
	Properties  map[string]any
	Required    []string
	Strict      bool
	Run         func(ctx context.Context, input json.RawMessage) (string, error)
}

func (t Tool) param() anthropic.ToolUnionParam {
	p := anthropic.ToolParam{
		Name:        t.Name,
		Description: anthropic.String(t.Description),
		InputSchema: anthropic.ToolInputSchemaParam{Properties: t.Properties, Required: t.Required},
	}
	if t.Strict {
		p.Strict = anthropic.Bool(true)
		p.InputSchema.ExtraFields = map[string]any{"additionalProperties": false}
	}
	return anthropic.ToolUnionParam{OfTool: &p}
}
