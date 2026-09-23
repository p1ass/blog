package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/agent"
)

const localTimeLayout = "2006-01-02T15:04"

var weekdays = []string{"日", "月", "火", "水", "木", "金", "土"}

func formatDate(t time.Time) string {
	return fmt.Sprintf("%s (%s)", t.Format("2006-01-02"), weekdays[t.Weekday()])
}

func v3Tools(c *calendar) []agent.Tool {
	participants := map[string]any{
		"type":        "array",
		"items":       map[string]string{"type": "string"},
		"description": "参加者の名前。「田中 太郎」のようなフルネームか、社内で 1 人に絞れる姓や名。依頼者本人は含めない",
	}
	return []agent.Tool{
		{
			Name: "calendar_find_free_slots",
			Description: "指定した参加者全員の予定が空いている時間帯を、指定した日付の範囲で探す。" +
				"会議を登録する前に、候補の時間帯を決めるために使う。時刻はすべて日本時間 (JST)。" +
				"名前が複数の人に該当する場合は候補の一覧をエラーとして返すので、フルネームで指定し直す。",
			Properties: map[string]any{
				"participants":     participants,
				"date":             map[string]string{"type": "string", "description": "探す日付。YYYY-MM-DD 形式"},
				"duration_minutes": map[string]any{"type": "integer", "description": "会議の長さ (分)"},
				"earliest":         map[string]string{"type": "string", "description": "探し始める時刻。HH:MM 形式。午後なら 12:00"},
				"latest":           map[string]string{"type": "string", "description": "会議が終わっていなければならない時刻。HH:MM 形式。午後なら 18:00"},
			},
			Required: []string{"participants", "date", "duration_minutes", "earliest", "latest"},
			Strict:   true,
			Run: func(_ context.Context, input json.RawMessage) (string, error) {
				var args struct {
					Participants    []string `json:"participants"`
					Date            string   `json:"date"`
					DurationMinutes int      `json:"duration_minutes"`
					Earliest        string   `json:"earliest"`
					Latest          string   `json:"latest"`
				}
				if err := json.Unmarshal(input, &args); err != nil {
					return "", err
				}
				users, err := resolveUsers(c, args.Participants)
				if err != nil {
					return "", err
				}
				from, err1 := time.ParseInLocation(localTimeLayout, args.Date+"T"+args.Earliest, jst)
				to, err2 := time.ParseInLocation(localTimeLayout, args.Date+"T"+args.Latest, jst)
				if err1 != nil || err2 != nil {
					return "", fmt.Errorf("date は YYYY-MM-DD、earliest と latest は HH:MM 形式で指定してください (受け取った値: %q, %q, %q)", args.Date, args.Earliest, args.Latest)
				}
				d := time.Duration(args.DurationMinutes) * time.Minute
				var slots []string
				for s := from; !s.Add(d).After(to); s = s.Add(30 * time.Minute) {
					if len(c.conflicts(ids(users), s, s.Add(d))) == 0 {
						slots = append(slots, s.Format("15:04")+"-"+s.Add(d).Format("15:04"))
					}
				}
				who := strings.Join(names(users), "、")
				if len(slots) == 0 {
					return fmt.Sprintf("%s の %s-%s に %s が全員空いている %d 分の枠はありません。日付か時間帯を変えて探してください。", formatDate(from), args.Earliest, args.Latest, who, args.DurationMinutes), nil
				}
				return fmt.Sprintf("%s に %s が全員空いている %d 分の枠: %s", formatDate(from), who, args.DurationMinutes, strings.Join(slots, "、")), nil
			},
		},
		{
			Name: "calendar_schedule_event",
			Description: "参加者全員のカレンダーに会議を登録する。" +
				"登録する時間帯は calendar_find_free_slots で空いていることを確かめてから指定する。" +
				"誰かの予定と重なる場合は登録せず、重なっている予定を返す。",
			Properties: map[string]any{
				"title":            map[string]string{"type": "string", "description": "会議の件名"},
				"participants":     participants,
				"start":            map[string]string{"type": "string", "description": "開始日時 (JST)。YYYY-MM-DDTHH:MM 形式"},
				"duration_minutes": map[string]any{"type": "integer", "description": "会議の長さ (分)"},
			},
			Required: []string{"title", "participants", "start", "duration_minutes"},
			Strict:   true,
			Run: func(_ context.Context, input json.RawMessage) (string, error) {
				var args struct {
					Title           string   `json:"title"`
					Participants    []string `json:"participants"`
					Start           string   `json:"start"`
					DurationMinutes int      `json:"duration_minutes"`
				}
				if err := json.Unmarshal(input, &args); err != nil {
					return "", err
				}
				users, err := resolveUsers(c, args.Participants)
				if err != nil {
					return "", err
				}
				start, err := time.ParseInLocation(localTimeLayout, args.Start, jst)
				if err != nil {
					return "", fmt.Errorf("start は YYYY-MM-DDTHH:MM 形式で指定してください (受け取った値: %q)", args.Start)
				}
				end := start.Add(time.Duration(args.DurationMinutes) * time.Minute)
				if cs := c.conflicts(ids(users), start, end); len(cs) > 0 {
					return "", conflictError(cs)
				}
				c.add(args.Title, ids(users), start, end)
				return fmt.Sprintf("「%s」を %s %s-%s に登録しました。参加者: %s", args.Title, formatDate(start), start.Format("15:04"), end.Format("15:04"), strings.Join(names(users), "、")), nil
			},
		},
	}
}

func conflictError(cs []event) error {
	var lines []string
	for _, e := range cs {
		lines = append(lines, fmt.Sprintf("%s-%s「%s」", e.Start.Format("15:04"), e.End.Format("15:04"), e.Title))
	}
	return fmt.Errorf("次の予定と重なるため登録しませんでした: %s。空いている時間帯を指定し直してください", strings.Join(lines, "、"))
}

func resolveUsers(c *calendar, queries []string) ([]user, error) {
	var users []user
	for _, q := range queries {
		u, candidates := c.findUser(q)
		switch {
		case u.ID != "":
			users = append(users, u)
		case len(candidates) == 0:
			return nil, fmt.Errorf("「%s」に該当する人が見つかりません。名前の表記を確かめてください", q)
		default:
			var labels []string
			for _, cand := range candidates {
				labels = append(labels, fmt.Sprintf("%s (%s)", cand.Name, cand.Department))
			}
			return nil, fmt.Errorf("「%s」に該当する人が %d 人います: %s。フルネームで指定してください", q, len(candidates), strings.Join(labels, "、"))
		}
	}
	return users, nil
}

func ids(users []user) []string {
	var out []string
	for _, u := range users {
		out = append(out, u.ID)
	}
	return out
}

func names(users []user) []string {
	var out []string
	for _, u := range users {
		out = append(out, u.Name)
	}
	return out
}
