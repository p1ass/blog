package main

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/p1ass/blog/app/routes/posts/agent-context-management/repo-agent/agent"
)

func newRepoTools(t *testing.T) map[string]agent.Tool {
	t.Helper()
	dir := t.TempDir()
	if err := os.MkdirAll(filepath.Join(dir, "src", "agents"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "src", "agents", "run_config.py"), []byte("DEFAULT_MAX_TURNS = 10\nworkflow_name: str = \"Agent workflow\"\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	root, err := os.OpenRoot(dir)
	if err != nil {
		t.Fatal(err)
	}
	tools := map[string]agent.Tool{}
	for _, tool := range repoTools(root) {
		tools[tool.Name] = tool
	}
	return tools
}

func run(t *testing.T, tool agent.Tool, input map[string]string) (string, error) {
	t.Helper()
	b, err := json.Marshal(input)
	if err != nil {
		t.Fatal(err)
	}
	return tool.Run(context.Background(), b)
}

func TestRepoTools(t *testing.T) {
	tools := newRepoTools(t)

	got, err := run(t, tools["list_files"], map[string]string{"path": "src"})
	if err != nil || got != "agents/\n" {
		t.Errorf("list_files = %q, %v", got, err)
	}

	got, err = run(t, tools["grep"], map[string]string{"pattern": "MAX_TURNS", "path": "."})
	if err != nil || got != "src/agents/run_config.py:1: DEFAULT_MAX_TURNS = 10" {
		t.Errorf("grep = %q, %v", got, err)
	}

	got, err = run(t, tools["read_file"], map[string]string{"path": "src/agents/run_config.py"})
	if err != nil || !strings.Contains(got, "Agent workflow") {
		t.Errorf("read_file = %q, %v", got, err)
	}
}

func TestRepoToolsRejectPathOutsideRepo(t *testing.T) {
	tools := newRepoTools(t)
	for _, name := range []string{"list_files", "grep", "read_file"} {
		if _, err := run(t, tools[name], map[string]string{"path": "../", "pattern": "."}); err == nil {
			t.Errorf("%s: expected an error for a path outside the repository", name)
		}
	}
}
