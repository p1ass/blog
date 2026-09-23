package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/agent"
	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/calendar"
)

func v2Tools(c *calendar.Calendar) []agent.Tool {
	attendeeUserIDsSchema := map[string]any{
		"type":        "array",
		"items":       map[string]string{"type": "string"},
		"description": "参加者の user_id。calendar_list_users で調べた usr_ で始まる ID",
	}
	return []agent.Tool{
		{
			Name:        "calendar_list_users",
			Description: "社内のユーザーの user_id、名前、部署の一覧を返す。他の Tool に渡す user_id を名前から調べるために使う。",
			Properties:  map[string]any{},
			Strict:      true,
			Run: func(context.Context, json.RawMessage) (string, error) {
				var lines []string
				for _, u := range c.Users {
					lines = append(lines, fmt.Sprintf("%s: %s (%s)", u.ID, u.Name, u.Department))
				}
				return strings.Join(lines, "\n"), nil
			},
		},
		{
			Name:        "calendar_list_events",
			Description: "指定したユーザーの、指定した日の予定を返す。時刻はすべて日本時間 (JST)。空き時間を調べるために使う。",
			Properties: map[string]any{
				"user_id": map[string]string{"type": "string", "description": "calendar_list_users で調べた usr_ で始まる ID"},
				"date":    map[string]string{"type": "string", "description": "予定を調べる日付。YYYY-MM-DD 形式"},
			},
			Required: []string{"user_id", "date"},
			Strict:   true,
			Run: func(_ context.Context, input json.RawMessage) (string, error) {
				var args struct {
					UserID string `json:"user_id"`
					Date   string `json:"date"`
				}
				if err := json.Unmarshal(input, &args); err != nil {
					return "", err
				}
				u, ok := c.UserByID(args.UserID)
				if !ok {
					return "", unknownUserError(args.UserID)
				}
				day, err := time.ParseInLocation(localDateLayout, args.Date, calendar.JST)
				if err != nil {
					return "", fmt.Errorf("date は YYYY-MM-DD 形式で指定してください (受け取った値: %q)", args.Date)
				}
				events := c.EventsOf(u.ID, day, day.AddDate(0, 0, 1))
				if len(events) == 0 {
					return fmt.Sprintf("%s の %s の予定はありません", u.Name, formatDate(day)), nil
				}
				return fmt.Sprintf("%s の %s の予定: %s", u.Name, formatDate(day), formatEvents(events)), nil
			},
		},
		{
			Name:        "calendar_create_event",
			Description: "参加者全員のカレンダーに予定を登録する。誰かの予定と重なる場合は登録せず、重なっている予定を返す。",
			Properties: map[string]any{
				"title":             map[string]string{"type": "string", "description": "予定の件名"},
				"attendee_user_ids": attendeeUserIDsSchema,
				"start":             map[string]string{"type": "string", "description": "開始日時 (JST)。YYYY-MM-DDTHH:MM 形式"},
				"duration_minutes":  map[string]any{"type": "integer", "description": "予定の長さ (分)"},
			},
			Required: []string{"title", "attendee_user_ids", "start", "duration_minutes"},
			Strict:   true,
			Run: func(_ context.Context, input json.RawMessage) (string, error) {
				var args struct {
					Title           string   `json:"title"`
					AttendeeUserIDs []string `json:"attendee_user_ids"`
					Start           string   `json:"start"`
					DurationMinutes int      `json:"duration_minutes"`
				}
				if err := json.Unmarshal(input, &args); err != nil {
					return "", err
				}
				var users []calendar.User
				for _, id := range args.AttendeeUserIDs {
					u, ok := c.UserByID(id)
					if !ok {
						return "", unknownUserError(id)
					}
					users = append(users, u)
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

func unknownUserError(id string) error {
	return fmt.Errorf("user_id %q のユーザーはいません。user_id には calendar_list_users で調べた usr_ で始まる ID を指定してください", id)
}
