package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/calendar"
)

const (
	localDateLayout = "2006-01-02"
	localTimeLayout = "2006-01-02T15:04"
	clockLayout     = "15:04"
)

var weekdays = []string{"日", "月", "火", "水", "木", "金", "土"}

func formatDate(t time.Time) string {
	return fmt.Sprintf("%s (%s)", t.Format(localDateLayout), weekdays[t.Weekday()])
}

func formatSpan(start, end time.Time) string {
	return start.Format(clockLayout) + "-" + end.Format(clockLayout)
}

func formatEvent(e calendar.Event) string {
	return fmt.Sprintf("%s「%s」", formatSpan(e.Start, e.End), e.Title)
}

func formatEvents(events []calendar.Event) string {
	var lines []string
	for _, e := range events {
		lines = append(lines, formatEvent(e))
	}
	return strings.Join(lines, "、")
}

func conflictError(cs []calendar.Event) error {
	return fmt.Errorf("次の予定と重なるため登録しませんでした: %s。空いている時間帯を指定し直してください", formatEvents(cs))
}

func ids(users []calendar.User) []string {
	var out []string
	for _, u := range users {
		out = append(out, u.ID)
	}
	return out
}

func names(users []calendar.User) []string {
	var out []string
	for _, u := range users {
		out = append(out, u.Name)
	}
	return out
}
