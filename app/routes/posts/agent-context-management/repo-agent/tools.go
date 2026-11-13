package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"path"
	"regexp"
	"strings"

	"github.com/p1ass/blog/app/routes/posts/agent-context-management/repo-agent/agent"
)

const maxGrepMatches = 50

func repoTools(root *os.Root) []agent.Tool {
	repo := root.FS()
	return []agent.Tool{
		{
			Name:        "list_files",
			Description: "リポジトリ内のディレクトリ直下にあるファイルとディレクトリを一覧します。ディレクトリには末尾に / が付きます。",
			Properties: map[string]any{
				"path": map[string]any{"type": "string", "description": "リポジトリのルートからの相対パス。ルートは \".\""},
			},
			Required: []string{"path"},
			Run: func(_ context.Context, input json.RawMessage) (string, error) {
				var in struct{ Path string }
				if err := json.Unmarshal(input, &in); err != nil {
					return "", err
				}
				entries, err := fs.ReadDir(repo, path.Clean(in.Path))
				if err != nil {
					return "", err
				}
				var sb strings.Builder
				for _, e := range entries {
					if strings.HasPrefix(e.Name(), ".") {
						continue
					}
					name := e.Name()
					if e.IsDir() {
						name += "/"
					}
					fmt.Fprintln(&sb, name)
				}
				return sb.String(), nil
			},
		},
		{
			Name:        "grep",
			Description: fmt.Sprintf("リポジトリ内のファイルを正規表現 (Go の regexp の構文) で検索し、一致した行を「パス:行番号: 内容」の形式で返します。最大 %d 件まで返します。", maxGrepMatches),
			Properties: map[string]any{
				"pattern": map[string]any{"type": "string", "description": "検索する正規表現"},
				"path":    map[string]any{"type": "string", "description": "検索するディレクトリかファイルの、リポジトリのルートからの相対パス"},
			},
			Required: []string{"pattern", "path"},
			Run: func(_ context.Context, input json.RawMessage) (string, error) {
				var in struct{ Pattern, Path string }
				if err := json.Unmarshal(input, &in); err != nil {
					return "", err
				}
				re, err := regexp.Compile(in.Pattern)
				if err != nil {
					return "", err
				}
				var matches []string
				total := 0
				err = fs.WalkDir(repo, path.Clean(in.Path), func(name string, d fs.DirEntry, err error) error {
					if err != nil {
						return err
					}
					if d.IsDir() {
						if strings.HasPrefix(d.Name(), ".") && name != path.Clean(in.Path) {
							return fs.SkipDir
						}
						return nil
					}
					b, err := fs.ReadFile(repo, name)
					if err != nil {
						return err
					}
					for i, line := range strings.Split(string(b), "\n") {
						if re.MatchString(line) {
							total++
							if len(matches) < maxGrepMatches {
								matches = append(matches, fmt.Sprintf("%s:%d: %s", name, i+1, line))
							}
						}
					}
					return nil
				})
				if err != nil {
					return "", err
				}
				if total > len(matches) {
					matches = append(matches, fmt.Sprintf("... 他 %d 件", total-len(matches)))
				}
				return strings.Join(matches, "\n"), nil
			},
		},
		{
			Name:        "read_file",
			Description: "リポジトリ内のファイルの内容をすべて返します。",
			Properties: map[string]any{
				"path": map[string]any{"type": "string", "description": "リポジトリのルートからの相対パス"},
			},
			Required: []string{"path"},
			Run: func(_ context.Context, input json.RawMessage) (string, error) {
				var in struct{ Path string }
				if err := json.Unmarshal(input, &in); err != nil {
					return "", err
				}
				b, err := fs.ReadFile(repo, path.Clean(in.Path))
				if err != nil {
					return "", err
				}
				return string(b), nil
			},
		},
	}
}
