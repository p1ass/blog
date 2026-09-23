package main

import (
	"fmt"
	"strings"
	"time"
)

var jst = time.FixedZone("JST", 9*60*60)

type user struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Department string `json:"department"`
	CreatedAt  string `json:"created_at"`
}

type event struct {
	ID        string
	Title     string
	Attendees []string
	Start     time.Time
	End       time.Time
}

type calendar struct {
	users  []user
	events []event
}

func newCalendar() *calendar {
	names := []struct{ name, dept string }{
		{"田中 太郎", "開発部"}, {"田中 花子", "営業部"}, {"佐藤 健", "開発部"},
		{"鈴木 一郎", "人事部"}, {"高橋 美咲", "開発部"}, {"伊藤 大輔", "営業部"},
		{"渡辺 さくら", "経理部"}, {"山本 翔", "開発部"}, {"中村 優子", "デザイン部"},
		{"小林 直樹", "営業部"}, {"加藤 恵", "開発部"}, {"吉田 拓也", "人事部"},
		{"山田 彩", "経理部"}, {"佐々木 亮", "開発部"}, {"山口 真央", "デザイン部"},
		{"松本 蓮", "開発部"}, {"井上 陽菜", "営業部"}, {"木村 悠斗", "開発部"},
		{"林 結衣", "人事部"}, {"清水 颯", "開発部"},
	}
	c := &calendar{}
	for i, n := range names {
		c.users = append(c.users, user{
			ID:         fmt.Sprintf("usr_%08x-4f1c-4b7a-9e3d-%012x", 0x3a91c000+i*7919, 0x5d2e0000+i*104729),
			Name:       n.name,
			Email:      fmt.Sprintf("user%02d@example.com", i+1),
			Department: n.dept,
			CreatedAt:  time.Date(2024, time.Month(i%12+1), i%28+1, 0, 0, 0, 0, time.UTC).Format(time.RFC3339),
		})
	}

	at := func(h, m int) time.Time { return time.Date(2026, 9, 28, h, m, 0, 0, jst) }
	tanaka, sato := c.users[0].ID, c.users[2].ID
	c.events = []event{
		{ID: "evt_01", Title: "設計レビュー", Attendees: []string{tanaka}, Start: at(13, 0), End: at(14, 0)},
		{ID: "evt_02", Title: "1on1", Attendees: []string{tanaka}, Start: at(15, 0), End: at(16, 0)},
		{ID: "evt_03", Title: "ランチ MTG", Attendees: []string{sato}, Start: at(12, 0), End: at(13, 0)},
		{ID: "evt_04", Title: "採用面接", Attendees: []string{sato}, Start: at(14, 0), End: at(15, 0)},
		{ID: "evt_05", Title: "定例", Attendees: []string{sato}, Start: at(16, 30), End: at(18, 0)},
	}
	return c
}

func (c *calendar) userByID(id string) (user, bool) {
	for _, u := range c.users {
		if u.ID == id {
			return u, true
		}
	}
	return user{}, false
}

func (c *calendar) findUser(query string) (user, []user) {
	q := strings.ReplaceAll(query, " ", "")
	var hits []user
	for _, u := range c.users {
		if strings.Contains(strings.ReplaceAll(u.Name, " ", ""), q) {
			hits = append(hits, u)
		}
	}
	if len(hits) == 1 {
		return hits[0], nil
	}
	return user{}, hits
}

func (c *calendar) eventsOf(userID string, from, to time.Time) []event {
	var out []event
	for _, e := range c.events {
		if e.End.After(from) && e.Start.Before(to) && contains(e.Attendees, userID) {
			out = append(out, e)
		}
	}
	return out
}

func (c *calendar) conflicts(userIDs []string, start, end time.Time) []event {
	var out []event
	for _, id := range userIDs {
		out = append(out, c.eventsOf(id, start, end)...)
	}
	return out
}

func (c *calendar) add(title string, userIDs []string, start, end time.Time) event {
	e := event{ID: fmt.Sprintf("evt_%02d", len(c.events)+1), Title: title, Attendees: userIDs, Start: start, End: end}
	c.events = append(c.events, e)
	return e
}

func contains(s []string, v string) bool {
	for _, x := range s {
		if x == v {
			return true
		}
	}
	return false
}
