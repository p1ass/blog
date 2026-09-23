package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"slices"
	"time"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/agent"
	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/calendar"
)

const (
	instructions = "あなたは社内の予定調整アシスタントです。今日は 2026-09-23 (水) で、時刻は日本時間 (JST) で扱います。依頼者本人の予定は考慮しなくてかまいません。登録する前に依頼者へ確認する必要はありません。"
	prompt       = "来週月曜の午後に、伊波太郎さんと一ノ瀬さんとの 30 分の打ち合わせを入れてください"
)

var toolsByVersion = map[string]func(*calendar.Calendar) []agent.Tool{
	"v1": v1Tools,
	"v2": v2Tools,
	"v3": v3Tools,
}

func main() {
	version := flag.String("version", "v1", "v1, v2 or v3")
	n := flag.Int("n", 1, "number of runs")
	flag.Parse()

	newTools, ok := toolsByVersion[*version]
	if !ok {
		log.Fatalf("unknown version: %s", *version)
	}
	runner := &agent.Runner{Client: anthropic.NewClient(), MaxTurns: 20}

	for i := range *n {
		cal := calendar.New()
		seeded := len(cal.Events)
		a := &agent.Agent{
			Model:        anthropic.ModelClaudeSonnet5,
			Instructions: instructions,
			Tools:        newTools(cal),
		}
		res, err := runner.Run(context.Background(), a, prompt)
		if err != nil {
			log.Printf("error: %v", err)
		} else {
			log.Printf("final: %s", res.FinalOutput)
		}
		u := res.Usage
		fmt.Printf("run %d: turns=%d calls=%d errors=%d input_tokens=%d ok=%v\n", i+1, u.Turns, u.ToolCalls, u.ToolErrors, u.InputTokens, scheduledCorrectly(cal, seeded))
	}
}

func scheduledCorrectly(c *calendar.Calendar, seeded int) bool {
	want := time.Date(2026, 9, 28, 16, 0, 0, 0, calendar.JST)
	added := c.Events[seeded:]
	if len(added) != 1 {
		return false
	}
	e := added[0]
	return e.Start.Equal(want) && e.End.Equal(want.Add(30*time.Minute)) &&
		len(e.Attendees) == 2 && hasUser(c, e.Attendees, "伊波 太郎") && hasUser(c, e.Attendees, "一ノ瀬 奈々")
}

func hasUser(c *calendar.Calendar, userIDs []string, name string) bool {
	hits := c.FindUsers(name)
	return len(hits) == 1 && slices.Contains(userIDs, hits[0].ID)
}
