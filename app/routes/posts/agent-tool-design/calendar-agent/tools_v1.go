package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/p1ass/blog/app/routes/posts/agent-tool-design/calendar-agent/agent"
)

func v1Tools(c *calendar) []agent.Tool {
	return []agent.Tool{
		{
			Name:        "list_users",
			Description: "ユーザーの一覧を返す",
			Properties:  map[string]any{},
			Run: func(context.Context, json.RawMessage) (string, error) {
				b, err := json.Marshal(c.users)
				return string(b), err
			},
		},
		{
			Name:        "list_events",
			Description: "ユーザーの予定を返す",
			Properties: map[string]any{
				"user":     map[string]string{"type": "string"},
				"time_min": map[string]string{"type": "string"},
				"time_max": map[string]string{"type": "string"},
			},
			Required: []string{"user", "time_min", "time_max"},
			Run: func(_ context.Context, input json.RawMessage) (string, error) {
				var args struct {
					User    string `json:"user"`
					TimeMin string `json:"time_min"`
					TimeMax string `json:"time_max"`
				}
				if err := json.Unmarshal(input, &args); err != nil {
					return "", err
				}
				if _, ok := c.userByID(args.User); !ok {
					return "", errors.New("404 Not Found")
				}
				from, err1 := time.Parse(time.RFC3339, args.TimeMin)
				to, err2 := time.Parse(time.RFC3339, args.TimeMax)
				if err1 != nil || err2 != nil {
					return "", errors.New("400 Bad Request")
				}
				type item struct {
					ID        string   `json:"id"`
					Summary   string   `json:"summary"`
					Attendees []string `json:"attendees"`
					Start     string   `json:"start"`
					End       string   `json:"end"`
				}
				var items []item
				for _, e := range c.eventsOf(args.User, from, to) {
					items = append(items, item{e.ID, e.Title, e.Attendees, e.Start.UTC().Format(time.RFC3339), e.End.UTC().Format(time.RFC3339)})
				}
				b, err := json.Marshal(items)
				return string(b), err
			},
		},
		{
			Name:        "create_event",
			Description: "予定を作成する",
			Properties: map[string]any{
				"title":     map[string]string{"type": "string"},
				"attendees": map[string]any{"type": "array", "items": map[string]string{"type": "string"}},
				"start":     map[string]string{"type": "string"},
				"end":       map[string]string{"type": "string"},
			},
			Required: []string{"title", "attendees", "start", "end"},
			Run: func(_ context.Context, input json.RawMessage) (string, error) {
				var args struct {
					Title     string   `json:"title"`
					Attendees []string `json:"attendees"`
					Start     string   `json:"start"`
					End       string   `json:"end"`
				}
				if err := json.Unmarshal(input, &args); err != nil {
					return "", err
				}
				for _, id := range args.Attendees {
					if _, ok := c.userByID(id); !ok {
						return "", errors.New("404 Not Found")
					}
				}
				start, err1 := time.Parse(time.RFC3339, args.Start)
				end, err2 := time.Parse(time.RFC3339, args.End)
				if err1 != nil || err2 != nil {
					return "", errors.New("400 Bad Request")
				}
				if len(c.conflicts(args.Attendees, start, end)) > 0 {
					return "", errors.New("409 Conflict")
				}
				e := c.add(args.Title, args.Attendees, start, end)
				return fmt.Sprintf(`{"id":%q,"status":"confirmed"}`, e.ID), nil
			},
		},
	}
}
