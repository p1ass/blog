package main

import (
	"encoding/json"
	"testing"

	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/calendar"
)

func TestFindFreeSlots(t *testing.T) {
	t.Parallel()

	const want = "2026-09-28 (月) に 花芽 太郎、一ノ瀬 健 が全員空いている 30 分の枠: 16:00-16:30"
	tests := []struct {
		name  string
		input string
	}{
		{
			name:  "月曜の午後に 2 人とも空いている 30 分の枠は 16:00-16:30 だけ",
			input: `{"participants":["花芽 太郎","一ノ瀬"],"date":"2026-09-28","duration_minutes":30,"earliest":"12:00","latest":"18:00"}`,
		},
		{
			name:  "earliest が 30 分単位でなくても空き枠を見落とさない",
			input: `{"participants":["花芽 太郎","一ノ瀬"],"date":"2026-09-28","duration_minutes":30,"earliest":"12:15","latest":"18:00"}`,
		},
		{
			name:  "全角スペースを含む名前でも参加者を特定できる",
			input: `{"participants":["花芽　太郎","一ノ瀬"],"date":"2026-09-28","duration_minutes":30,"earliest":"12:00","latest":"18:00"}`,
		},
		{
			name:  "同じ人を重ねて指定しても参加者は 1 人として扱う",
			input: `{"participants":["花芽 太郎","花芽太郎","一ノ瀬"],"date":"2026-09-28","duration_minutes":30,"earliest":"12:00","latest":"18:00"}`,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			findFreeSlots := v3Tools(calendar.New())[0]

			got, err := findFreeSlots.Run(t.Context(), json.RawMessage(tt.input))

			if err != nil {
				t.Fatalf("Run() error = %v", err)
			}
			if got != want {
				t.Errorf("Run() = %q, want %q", got, want)
			}
		})
	}
}
