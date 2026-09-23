package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"time"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/agent"
)

const (
	instructions = "あなたは社内の予定調整アシスタントです。今日は 2026-09-23 (水) で、時刻は日本時間 (JST) で扱います。依頼者本人の予定は考慮しなくてかまいません。登録する前に依頼者へ確認する必要はありません。"
	prompt       = "来週月曜の午後に、田中太郎さんと佐藤さんとの 30 分の打ち合わせを入れてください"
)

var toolsByVersion = map[string]func(*calendar) []agent.Tool{
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
		cal := newCalendar()
		a := &agent.Agent{
			Model:        anthropic.ModelClaudeSonnet5,
			Instructions: instructions,
			Tools:        newTools(cal),
		}
		res, err := runner.Run(context.Background(), a, prompt)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("final: %s", res.FinalOutput)
		u := res.Usage
		fmt.Printf("run %d: turns=%d calls=%d errors=%d input_tokens=%d ok=%v\n", i+1, u.Turns, u.ToolCalls, u.ToolErrors, u.InputTokens, scheduledCorrectly(cal))
	}
}

func scheduledCorrectly(c *calendar) bool {
	want := time.Date(2026, 9, 28, 16, 0, 0, 0, jst)
	added := c.events[5:]
	if len(added) != 1 {
		return false
	}
	e := added[0]
	return e.Start.Equal(want) && e.End.Equal(want.Add(30*time.Minute)) &&
		len(e.Attendees) == 2 && contains(e.Attendees, c.users[0].ID) && contains(e.Attendees, c.users[2].ID)
}
