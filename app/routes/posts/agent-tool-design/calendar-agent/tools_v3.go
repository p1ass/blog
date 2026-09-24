package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"strings"
	"time"

	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/agent"
	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/calendar"
)

const slotStep = 30 * time.Minute

func v3Tools(c *calendar.Calendar) []agent.Tool {
	participantsSchema := map[string]any{
		"type":        "array",
		"items":       map[string]string{"type": "string"},
		"description": "参加者の名前。「伊波 太郎」のようなフルネームか、社内で 1 人に絞れる姓や名。依頼者本人は含めない",
	}
	return []agent.Tool{
		{
			Name: "calendar_find_free_slots",
			Description: "指定した参加者全員の予定が空いている時間帯を、指定した日付の範囲で探す。" +
				"会議を登録する前に、候補の時間帯を決めるために使う。時刻はすべて日本時間 (JST)。" +
				"名前が複数の人に該当する場合は候補の一覧をエラーとして返すので、フルネームで指定し直す。",
			Properties: map[string]any{
				"participants":     participantsSchema,
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
				from, err1 := time.ParseInLocation(localTimeLayout, args.Date+"T"+args.Earliest, calendar.JST)
				to, err2 := time.ParseInLocation(localTimeLayout, args.Date+"T"+args.Latest, calendar.JST)
				if err1 != nil || err2 != nil {
					return "", fmt.Errorf("date は YYYY-MM-DD、earliest と latest は HH:MM 形式で指定してください (受け取った値: %q, %q, %q)", args.Date, args.Earliest, args.Latest)
				}
				d := time.Duration(args.DurationMinutes) * time.Minute
				var slots []string
				for s := ceilToSlot(from); !s.Add(d).After(to); s = s.Add(slotStep) {
					if len(c.Conflicts(ids(users), s, s.Add(d))) == 0 {
						slots = append(slots, formatSpan(s, s.Add(d)))
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
				"participants":     participantsSchema,
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
				start, err := time.ParseInLocation(localTimeLayout, args.Start, calendar.JST)
				if err != nil {
					return "", fmt.Errorf("start は YYYY-MM-DDTHH:MM 形式で指定してください (受け取った値: %q)", args.Start)
				}
				end := start.Add(time.Duration(args.DurationMinutes) * time.Minute)
				if cs := c.Conflicts(ids(users), start, end); len(cs) > 0 {
					return "", conflictError(cs)
				}
				c.Add(args.Title, ids(users), start, end)
				return fmt.Sprintf("「%s」を %s %s に登録しました。参加者: %s", args.Title, formatDate(start), formatSpan(start, end), strings.Join(names(users), "、")), nil
			},
		},
	}
}

func ceilToSlot(t time.Time) time.Time {
	s := t.Truncate(slotStep)
	if s.Before(t) {
		s = s.Add(slotStep)
	}
	return s
}

func resolveUsers(c *calendar.Calendar, queries []string) ([]calendar.User, error) {
	if len(queries) == 0 {
		return nil, errors.New("participants には参加者の名前を 1 人以上指定してください")
	}
	var users []calendar.User
	for _, q := range queries {
		hits := c.FindUsers(q)
		switch len(hits) {
		case 0:
			return nil, fmt.Errorf("「%s」に該当する人が見つかりません。名前の表記を確かめてください", q)
		case 1:
			if !slices.ContainsFunc(users, func(u calendar.User) bool { return u.ID == hits[0].ID }) {
				users = append(users, hits[0])
			}
		default:
			var labels []string
			for _, h := range hits {
				labels = append(labels, fmt.Sprintf("%s (%s)", h.Name, h.Department))
			}
			return nil, fmt.Errorf("「%s」に該当する人が %d 人います: %s。フルネームで指定してください", q, len(hits), strings.Join(labels, "、"))
		}
	}
	return users, nil
}
