package agent

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/anthropics/anthropic-sdk-go"
)

func runMemory(t *testing.T, m *Memory, input string) (string, error) {
	t.Helper()
	var cmd anthropic.BetaMemoryTool20250818CommandUnion
	if err := json.Unmarshal([]byte(input), &cmd); err != nil {
		t.Fatal(err)
	}
	return m.Run(cmd)
}

func TestMemory(t *testing.T) {
	m, err := NewMemory(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}

	steps := []struct {
		input string
		want  string
	}{
		{`{"command": "create", "path": "/memories/progress.md", "file_text": "q1: 10\n"}`, "File created successfully at: /memories/progress.md"},
		{`{"command": "str_replace", "path": "/memories/progress.md", "old_str": "q1: 10", "new_str": "q1: 10\nq2: MaxTurnsExceeded"}`, "The memory file has been edited."},
		{`{"command": "insert", "path": "/memories/progress.md", "insert_line": 0, "insert_text": "# 進捗"}`, "The file /memories/progress.md has been edited."},
		{`{"command": "view", "path": "/memories/progress.md"}`, "     1\t# 進捗\n     2\tq1: 10\n     3\tq2: MaxTurnsExceeded\n"},
		{`{"command": "view", "path": "/memories"}`, "/memories/progress.md"},
		{`{"command": "rename", "old_path": "/memories/progress.md", "new_path": "/memories/done.md"}`, "Successfully renamed /memories/progress.md to /memories/done.md"},
		{`{"command": "delete", "path": "/memories/done.md"}`, "Successfully deleted /memories/done.md"},
	}
	for _, s := range steps {
		got, err := runMemory(t, m, s.input)
		if err != nil {
			t.Fatalf("%s: %v", s.input, err)
		}
		if !strings.Contains(got, s.want) {
			t.Errorf("%s:\ngot  %q\nwant %q", s.input, got, s.want)
		}
	}
}

func TestMemoryRejectsPathOutsideMemoryDir(t *testing.T) {
	parent := t.TempDir()
	dir := filepath.Join(parent, "memories")
	if err := os.Mkdir(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(parent, "secrets.env"), []byte("API_KEY=xxx"), 0o644); err != nil {
		t.Fatal(err)
	}
	m, err := NewMemory(dir)
	if err != nil {
		t.Fatal(err)
	}

	for _, input := range []string{
		`{"command": "view", "path": "/memories/../secrets.env"}`,
		`{"command": "view", "path": "/etc/passwd"}`,
		`{"command": "create", "path": "/memories/../../evil.txt", "file_text": "x"}`,
		`{"command": "delete", "path": "/memories"}`,
	} {
		if got, err := runMemory(t, m, input); err == nil {
			t.Errorf("%s: expected an error, got %q", input, got)
		}
	}
}
