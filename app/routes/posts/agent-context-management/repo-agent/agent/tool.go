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
	Deferred    bool
	Run         func(ctx context.Context, input json.RawMessage) (string, error)
}

func (t Tool) param() anthropic.BetaToolUnionParam {
	p := anthropic.BetaToolParam{
		Name:        t.Name,
		Description: anthropic.String(t.Description),
		InputSchema: anthropic.BetaToolInputSchemaParam{Properties: t.Properties, Required: t.Required},
	}
	if t.Deferred {
		p.DeferLoading = anthropic.Bool(true)
	}
	return anthropic.BetaToolUnionParam{OfTool: &p}
}
