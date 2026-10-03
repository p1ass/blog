package agent

import (
	"encoding/json"
	"testing"

	"github.com/anthropics/anthropic-sdk-go"
)

func requestBody(t *testing.T, r *Runner, a *Agent) map[string]any {
	t.Helper()
	b, err := json.Marshal(r.params(a, "質問"))
	if err != nil {
		t.Fatal(err)
	}
	var body map[string]any
	if err := json.Unmarshal(b, &body); err != nil {
		t.Fatal(err)
	}
	return body
}

func TestParamsContextManagement(t *testing.T) {
	r := &Runner{Context: ContextConfig{Cache: true, ClearTrigger: 30000, ClearAtLeast: 10000, CompactTrigger: 50000}}
	a := &Agent{Model: anthropic.ModelClaudeSonnet5_5, Instructions: "指示"}
	body := requestBody(t, r, a)

	if got := body["cache_control"].(map[string]any)["type"]; got != "ephemeral" {
		t.Errorf("cache_control.type = %v", got)
	}
	edits := body["context_management"].(map[string]any)["edits"].([]any)
	if len(edits) != 2 {
		t.Fatalf("len(edits) = %d", len(edits))
	}
	clear := edits[0].(map[string]any)
	if clear["type"] != "clear_tool_uses_20250919" ||
		clear["trigger"].(map[string]any)["value"] != 30000.0 ||
		clear["clear_at_least"].(map[string]any)["value"] != 10000.0 {
		t.Errorf("clear edit = %v", clear)
	}
	compact := edits[1].(map[string]any)
	if compact["type"] != "compact_20260112" || compact["trigger"].(map[string]any)["value"] != 50000.0 {
		t.Errorf("compact edit = %v", compact)
	}
}

func TestParamsWithoutContextManagement(t *testing.T) {
	body := requestBody(t, &Runner{}, &Agent{Model: anthropic.ModelClaudeSonnet5_5})
	for _, key := range []string{"cache_control", "context_management"} {
		if _, ok := body[key]; ok {
			t.Errorf("%s should be omitted", key)
		}
	}
}

func TestParamsToolSearchAndMemory(t *testing.T) {
	a := &Agent{
		Model:      anthropic.ModelClaudeSonnet5_5,
		Tools:      []Tool{{Name: "read_file"}, {Name: "github_list_issues", Deferred: true}},
		ToolSearch: true,
		Memory:     &Memory{},
	}
	tools := requestBody(t, &Runner{}, a)["tools"].([]any)

	want := []struct {
		name     string
		deferred bool
	}{
		{"tool_search_tool_regex", false},
		{"read_file", false},
		{"github_list_issues", true},
		{"memory", false},
	}
	if len(tools) != len(want) {
		t.Fatalf("len(tools) = %d", len(tools))
	}
	for i, w := range want {
		tool := tools[i].(map[string]any)
		deferred, _ := tool["defer_loading"].(bool)
		if tool["name"] != w.name || deferred != w.deferred {
			t.Errorf("tools[%d] = %v, want name=%s defer_loading=%v", i, tool, w.name, w.deferred)
		}
	}
	if got := tools[3].(map[string]any)["type"]; got != "memory_20250818" {
		t.Errorf("memory tool type = %v", got)
	}
}
