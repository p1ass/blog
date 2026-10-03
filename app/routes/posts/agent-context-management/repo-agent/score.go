package main

import (
	"encoding/json"
	"regexp"
)

var answers = map[string]any{
	"q1":  10.0,
	"q2":  "MaxTurnsExceeded",
	"q3":  5.0,
	"q4":  "error_as_result",
	"q5":  "Agent workflow",
	"q6":  "raise_error",
	"q7":  "An error occurred while running the tool. Please try again.",
	"q8":  "transfer_to_billing_agent",
	"q9":  "InputGuardrailTripwireTriggered",
	"q10": "run_llm_again",
}

var jsonBlock = regexp.MustCompile("(?s)```json\\s*(.*?)```")

func score(output string) int {
	blocks := jsonBlock.FindAllStringSubmatch(output, -1)
	if len(blocks) == 0 {
		return 0
	}
	var got map[string]any
	if err := json.Unmarshal([]byte(blocks[len(blocks)-1][1]), &got); err != nil {
		return 0
	}
	correct := 0
	for k, want := range answers {
		if got[k] == want {
			correct++
		}
	}
	return correct
}
