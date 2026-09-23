package calendar

import (
	"fmt"
	"slices"
	"strings"
	"time"
)

var JST = time.FixedZone("JST", 9*60*60)

type User struct {
	ID         string
	Name       string
	Email      string
	Department string
	CreatedAt  time.Time
}

type Event struct {
	ID        string
	Title     string
	Attendees []string
	Start     time.Time
	End       time.Time
}

type Calendar struct {
	Users  []User
	Events []Event
}

func New() *Calendar {
	names := []struct{ name, dept string }{
		{"花芽 太郎", "開発部"}, {"花芽 花子", "営業部"}, {"一ノ瀬 健", "開発部"},
		{"鈴木 一郎", "人事部"}, {"橘 美咲", "開発部"}, {"伊藤 大輔", "営業部"},
		{"紫宮 さくら", "経理部"}, {"山本 翔", "開発部"}, {"如月 優子", "デザイン部"},
		{"小林 直樹", "営業部"}, {"八雲 恵", "開発部"}, {"吉田 拓也", "人事部"},
		{"藍沢 彩", "経理部"}, {"夜乃 亮", "開発部"}, {"中村 真央", "デザイン部"},
		{"小森 蓮", "開発部"}, {"井上 陽菜", "営業部"}, {"胡桃 悠斗", "開発部"},
		{"林 結衣", "人事部"}, {"清水 颯", "開発部"},
	}
	c := &Calendar{}
	for i, n := range names {
		c.Users = append(c.Users, User{
			ID:         fmt.Sprintf("usr_%08x-4f1c-4b7a-9e3d-%012x", 0x3a91c000+i*7919, 0x5d2e0000+i*104729),
			Name:       n.name,
			Email:      fmt.Sprintf("user%02d@example.com", i+1),
			Department: n.dept,
			CreatedAt:  time.Date(2024, time.Month(i%12+1), i%28+1, 0, 0, 0, 0, time.UTC),
		})
	}

	at := func(h, m int) time.Time { return time.Date(2026, 9, 28, h, m, 0, 0, JST) }
	tanaka, sato := c.Users[0].ID, c.Users[2].ID
	c.Events = []Event{
		{ID: "evt_01", Title: "設計レビュー", Attendees: []string{tanaka}, Start: at(13, 0), End: at(14, 0)},
		{ID: "evt_02", Title: "1on1", Attendees: []string{tanaka}, Start: at(15, 0), End: at(16, 0)},
		{ID: "evt_03", Title: "ランチ MTG", Attendees: []string{sato}, Start: at(12, 0), End: at(13, 0)},
		{ID: "evt_04", Title: "採用面接", Attendees: []string{sato}, Start: at(14, 0), End: at(15, 0)},
		{ID: "evt_05", Title: "定例", Attendees: []string{sato}, Start: at(16, 30), End: at(18, 0)},
	}
	return c
}

func (c *Calendar) UserByID(id string) (User, bool) {
	for _, u := range c.Users {
		if u.ID == id {
			return u, true
		}
	}
	return User{}, false
}

func (c *Calendar) FindUsers(query string) []User {
	q := removeSpaces(query)
	var hits []User
	for _, u := range c.Users {
		if strings.Contains(removeSpaces(u.Name), q) {
			hits = append(hits, u)
		}
	}
	return hits
}

func removeSpaces(s string) string {
	return strings.Join(strings.Fields(s), "")
}

func (c *Calendar) EventsOf(userID string, from, to time.Time) []Event {
	var out []Event
	for _, e := range c.Events {
		if e.End.After(from) && e.Start.Before(to) && slices.Contains(e.Attendees, userID) {
			out = append(out, e)
		}
	}
	return out
}

func (c *Calendar) Conflicts(userIDs []string, start, end time.Time) []Event {
	var out []Event
	for _, id := range userIDs {
		for _, e := range c.EventsOf(id, start, end) {
			if !slices.ContainsFunc(out, func(o Event) bool { return o.ID == e.ID }) {
				out = append(out, e)
			}
		}
	}
	return out
}

func (c *Calendar) Add(title string, userIDs []string, start, end time.Time) Event {
	e := Event{ID: fmt.Sprintf("evt_%02d", len(c.Events)+1), Title: title, Attendees: userIDs, Start: start, End: end}
	c.Events = append(c.Events, e)
	return e
}
