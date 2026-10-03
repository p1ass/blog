package agent

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path"
	"strings"

	"github.com/anthropics/anthropic-sdk-go"
)

const memoryDir = "/memories"

type Memory struct {
	root *os.Root
}

func NewMemory(dir string) (*Memory, error) {
	root, err := os.OpenRoot(dir)
	if err != nil {
		return nil, err
	}
	return &Memory{root: root}, nil
}

// Model が渡すパスを os.Root の中の相対パスに変換する。os.Root は ../ やシンボリックリンクでディレクトリの外に出る操作を拒否する。
func (m *Memory) rel(p string) (string, error) {
	if p != memoryDir && !strings.HasPrefix(p, memoryDir+"/") {
		return "", fmt.Errorf("Error: The path %s must start with %s", p, memoryDir)
	}
	rel := strings.TrimPrefix(strings.TrimPrefix(p, memoryDir), "/")
	if rel == "" {
		return ".", nil
	}
	return rel, nil
}

func (m *Memory) Run(cmd anthropic.BetaMemoryTool20250818CommandUnion) (string, error) {
	switch c := cmd.AsAny().(type) {
	case anthropic.BetaMemoryTool20250818ViewCommand:
		return m.view(c.Path)
	case anthropic.BetaMemoryTool20250818CreateCommand:
		return m.create(c.Path, c.FileText)
	case anthropic.BetaMemoryTool20250818StrReplaceCommand:
		return m.strReplace(c.Path, c.OldStr, c.NewStr)
	case anthropic.BetaMemoryTool20250818InsertCommand:
		return m.insert(c.Path, int(c.InsertLine), c.InsertText)
	case anthropic.BetaMemoryTool20250818DeleteCommand:
		return m.delete(c.Path)
	case anthropic.BetaMemoryTool20250818RenameCommand:
		return m.rename(c.OldPath, c.NewPath)
	}
	return "", fmt.Errorf("Error: unknown command %q", cmd.Command)
}

func (m *Memory) view(p string) (string, error) {
	rel, err := m.rel(p)
	if err != nil {
		return "", err
	}
	info, err := m.root.Stat(rel)
	if err != nil {
		return "", fmt.Errorf("The path %s does not exist. Please provide a valid path.", p)
	}
	if !info.IsDir() {
		b, err := m.root.ReadFile(rel)
		if err != nil {
			return "", err
		}
		var sb strings.Builder
		fmt.Fprintf(&sb, "Here's the content of %s with line numbers:\n", p)
		for i, line := range strings.Split(string(b), "\n") {
			fmt.Fprintf(&sb, "%6d\t%s\n", i+1, line)
		}
		return sb.String(), nil
	}

	var sb strings.Builder
	fmt.Fprintf(&sb, "Here're the files and directories up to 2 levels deep in %s, excluding hidden items and node_modules:\n", p)
	err = fs.WalkDir(m.root.FS(), rel, func(name string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if name != rel && (strings.HasPrefix(d.Name(), ".") || d.Name() == "node_modules") {
			if d.IsDir() {
				return fs.SkipDir
			}
			return nil
		}
		if strings.Count(path.Clean(strings.TrimPrefix(name, rel)), "/") > 2 {
			return fs.SkipDir
		}
		info, err := d.Info()
		if err != nil {
			return err
		}
		fmt.Fprintf(&sb, "%d\t%s\n", info.Size(), path.Join(memoryDir, name))
		return nil
	})
	return sb.String(), err
}

func (m *Memory) create(p, text string) (string, error) {
	rel, err := m.rel(p)
	if err != nil {
		return "", err
	}
	if err := m.root.MkdirAll(path.Dir(rel), 0o755); err != nil {
		return "", err
	}
	if err := m.root.WriteFile(rel, []byte(text), 0o644); err != nil {
		return "", err
	}
	return fmt.Sprintf("File created successfully at: %s", p), nil
}

func (m *Memory) strReplace(p, oldStr, newStr string) (string, error) {
	rel, err := m.rel(p)
	if err != nil {
		return "", err
	}
	b, err := m.root.ReadFile(rel)
	if err != nil {
		return "", fmt.Errorf("Error: The path %s does not exist. Please provide a valid path.", p)
	}
	switch strings.Count(string(b), oldStr) {
	case 0:
		return "", fmt.Errorf("No replacement was performed, old_str `%s` did not appear verbatim in %s.", oldStr, p)
	case 1:
	default:
		return "", fmt.Errorf("No replacement was performed. Multiple occurrences of old_str `%s` in %s. Please ensure it is unique", oldStr, p)
	}
	if err := m.root.WriteFile(rel, []byte(strings.Replace(string(b), oldStr, newStr, 1)), 0o644); err != nil {
		return "", err
	}
	return "The memory file has been edited.", nil
}

func (m *Memory) insert(p string, line int, text string) (string, error) {
	rel, err := m.rel(p)
	if err != nil {
		return "", err
	}
	b, err := m.root.ReadFile(rel)
	if err != nil {
		return "", fmt.Errorf("Error: The path %s does not exist", p)
	}
	lines := strings.Split(string(b), "\n")
	if line < 0 || line > len(lines) {
		return "", fmt.Errorf("Error: Invalid `insert_line` parameter: %d. It should be within the range of lines of the file: [0, %d]", line, len(lines))
	}
	lines = append(lines[:line], append(strings.Split(text, "\n"), lines[line:]...)...)
	if err := m.root.WriteFile(rel, []byte(strings.Join(lines, "\n")), 0o644); err != nil {
		return "", err
	}
	return fmt.Sprintf("The file %s has been edited.", p), nil
}

func (m *Memory) delete(p string) (string, error) {
	rel, err := m.rel(p)
	if err != nil {
		return "", err
	}
	if rel == "." {
		return "", errors.New("Error: Cannot delete the /memories directory")
	}
	if _, err := m.root.Stat(rel); err != nil {
		return "", fmt.Errorf("Error: The path %s does not exist", p)
	}
	if err := m.root.RemoveAll(rel); err != nil {
		return "", err
	}
	return fmt.Sprintf("Successfully deleted %s", p), nil
}

func (m *Memory) rename(oldPath, newPath string) (string, error) {
	oldRel, err := m.rel(oldPath)
	if err != nil {
		return "", err
	}
	newRel, err := m.rel(newPath)
	if err != nil {
		return "", err
	}
	if oldRel == "." || newRel == "." {
		return "", errors.New("Error: Cannot rename the /memories directory")
	}
	if _, err := m.root.Stat(oldRel); err != nil {
		return "", fmt.Errorf("Error: The path %s does not exist", oldPath)
	}
	if _, err := m.root.Stat(newRel); err == nil {
		return "", fmt.Errorf("Error: The destination %s already exists", newPath)
	}
	if err := m.root.MkdirAll(path.Dir(newRel), 0o755); err != nil {
		return "", err
	}
	if err := m.root.Rename(oldRel, newRel); err != nil {
		return "", err
	}
	return fmt.Sprintf("Successfully renamed %s to %s", oldPath, newPath), nil
}
