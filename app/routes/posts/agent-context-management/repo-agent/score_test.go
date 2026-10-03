package main

import "testing"

func TestScore(t *testing.T) {
	tests := []struct {
		name   string
		output string
		want   int
	}{
		{
			name:   "全問正解",
			output: "調査結果です。\n```json\n" + `{"q1": 10, "q2": "MaxTurnsExceeded", "q3": 5, "q4": "error_as_result", "q5": "Agent workflow", "q6": "raise_error", "q7": "An error occurred while running the tool. Please try again.", "q8": "transfer_to_billing_agent", "q9": "InputGuardrailTripwireTriggered", "q10": "run_llm_again"}` + "\n```",
			want:   10,
		},
		{
			name:   "数値を文字列で答えた問題は不正解",
			output: "```json\n" + `{"q1": "10", "q3": 5}` + "\n```",
			want:   1,
		},
		{
			name:   "最後の JSON ブロックで採点する",
			output: "```json\n{\"q1\": 10}\n```\n修正します。\n```json\n{\"q1\": 20}\n```",
			want:   0,
		},
		{
			name:   "JSON ブロックがない",
			output: "q1 は 10 です。",
			want:   0,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := score(tt.output); got != tt.want {
				t.Errorf("score() = %d, want %d", got, tt.want)
			}
		})
	}
}
