package main

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/p1ass/blog/app/routes/posts/agent-context-management/repo-agent/agent"
)

type extraTool struct {
	name, description string
	params            map[string]string
}

// 複数の MCP サーバーをつないだ状態を再現するための Tool。この記事の質問には使わないので、呼ばれたらエラーを返す。
var extraToolSpecs = []extraTool{
	{"github_list_issues", "GitHub リポジトリの Issue を一覧します。状態やラベルで絞り込めます。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "state": "open、closed、all のいずれか", "labels": "カンマ区切りのラベル名"}},
	{"github_get_issue", "GitHub の Issue の本文とコメントを取得します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "issue_number": "Issue の番号"}},
	{"github_create_issue", "GitHub に Issue を作成します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "title": "タイトル", "body": "本文 (Markdown)", "labels": "カンマ区切りのラベル名"}},
	{"github_update_issue", "GitHub の Issue のタイトル、本文、状態、ラベル、担当者を更新します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "issue_number": "Issue の番号", "title": "新しいタイトル", "body": "新しい本文", "state": "open か closed"}},
	{"github_add_issue_comment", "GitHub の Issue か Pull Request にコメントを追加します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "issue_number": "Issue か Pull Request の番号", "body": "コメントの本文 (Markdown)"}},
	{"github_list_pull_requests", "GitHub リポジトリの Pull Request を一覧します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "state": "open、closed、all のいずれか", "base": "マージ先のブランチ名"}},
	{"github_get_pull_request", "GitHub の Pull Request の詳細を取得します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "pull_number": "Pull Request の番号"}},
	{"github_get_pull_request_diff", "GitHub の Pull Request の差分を unified diff 形式で取得します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "pull_number": "Pull Request の番号"}},
	{"github_create_pull_request", "GitHub に Pull Request を作成します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "title": "タイトル", "body": "本文 (Markdown)", "head": "マージ元のブランチ名", "base": "マージ先のブランチ名"}},
	{"github_merge_pull_request", "GitHub の Pull Request をマージします。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "pull_number": "Pull Request の番号", "merge_method": "merge、squash、rebase のいずれか"}},
	{"github_create_review", "GitHub の Pull Request にレビューを投稿します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "pull_number": "Pull Request の番号", "event": "APPROVE、REQUEST_CHANGES、COMMENT のいずれか", "body": "レビューの本文"}},
	{"github_list_commits", "GitHub リポジトリのコミット履歴を一覧します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "sha": "起点のブランチ名かコミットの SHA", "path": "このパスを変更したコミットだけに絞り込む"}},
	{"github_list_releases", "GitHub リポジトリのリリースを一覧します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名"}},
	{"github_list_workflow_runs", "GitHub Actions のワークフローの実行履歴を一覧します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "branch": "ブランチ名", "status": "completed、in_progress、queued のいずれか"}},
	{"github_get_workflow_run_logs", "GitHub Actions のワークフローの実行ログを取得します。", map[string]string{"owner": "リポジトリのオーナー", "repo": "リポジトリ名", "run_id": "実行の ID"}},
	{"slack_list_channels", "Slack のワークスペースのチャンネルを一覧します。", map[string]string{"cursor": "ページネーションのカーソル", "limit": "取得する件数"}},
	{"slack_get_channel_history", "Slack のチャンネルのメッセージ履歴を取得します。", map[string]string{"channel_id": "チャンネルの ID", "limit": "取得する件数", "oldest": "この時刻より後のメッセージだけを取得する (Unix 時刻)"}},
	{"slack_get_thread_replies", "Slack のスレッドの返信を取得します。", map[string]string{"channel_id": "チャンネルの ID", "thread_ts": "スレッドの親メッセージのタイムスタンプ"}},
	{"slack_post_message", "Slack のチャンネルにメッセージを投稿します。", map[string]string{"channel_id": "チャンネルの ID", "text": "メッセージの本文 (mrkdwn)"}},
	{"slack_reply_to_thread", "Slack のスレッドに返信します。", map[string]string{"channel_id": "チャンネルの ID", "thread_ts": "スレッドの親メッセージのタイムスタンプ", "text": "返信の本文 (mrkdwn)"}},
	{"slack_add_reaction", "Slack のメッセージにリアクションを付けます。", map[string]string{"channel_id": "チャンネルの ID", "timestamp": "メッセージのタイムスタンプ", "reaction": "絵文字の名前"}},
	{"slack_search_messages", "Slack のメッセージを検索します。", map[string]string{"query": "検索クエリ。in:#channel や from:@user の修飾子を使えます", "count": "取得する件数"}},
	{"slack_get_user_profile", "Slack のユーザーのプロフィールを取得します。", map[string]string{"user_id": "ユーザーの ID"}},
	{"sentry_list_issues", "Sentry のプロジェクトで発生しているエラーの Issue を一覧します。", map[string]string{"organization": "組織のスラッグ", "project": "プロジェクトのスラッグ", "query": "検索クエリ (例: is:unresolved)", "stats_period": "集計期間 (例: 24h、14d)"}},
	{"sentry_get_issue", "Sentry の Issue の詳細と最新のイベントを取得します。", map[string]string{"organization": "組織のスラッグ", "issue_id": "Issue の ID"}},
	{"sentry_get_event_stacktrace", "Sentry のイベントのスタックトレースを取得します。", map[string]string{"organization": "組織のスラッグ", "project": "プロジェクトのスラッグ", "event_id": "イベントの ID"}},
	{"sentry_resolve_issue", "Sentry の Issue を解決済みにします。", map[string]string{"organization": "組織のスラッグ", "issue_id": "Issue の ID"}},
	{"sentry_list_releases", "Sentry に登録されたリリースを一覧します。", map[string]string{"organization": "組織のスラッグ", "project": "プロジェクトのスラッグ"}},
	{"linear_list_issues", "Linear の Issue を一覧します。チームや状態で絞り込めます。", map[string]string{"team": "チームのキー", "state": "状態の名前", "assignee": "担当者のメールアドレス"}},
	{"linear_get_issue", "Linear の Issue の詳細を取得します。", map[string]string{"issue_id": "Issue の ID (例: ENG-123)"}},
	{"linear_create_issue", "Linear に Issue を作成します。", map[string]string{"team": "チームのキー", "title": "タイトル", "description": "説明 (Markdown)", "priority": "0 (なし) から 4 (低) までの優先度"}},
	{"linear_update_issue", "Linear の Issue の状態、担当者、優先度を更新します。", map[string]string{"issue_id": "Issue の ID", "state": "状態の名前", "assignee": "担当者のメールアドレス", "priority": "優先度"}},
	{"linear_add_comment", "Linear の Issue にコメントを追加します。", map[string]string{"issue_id": "Issue の ID", "body": "コメントの本文 (Markdown)"}},
	{"linear_list_cycles", "Linear のチームのサイクルを一覧します。", map[string]string{"team": "チームのキー"}},
	{"grafana_query_prometheus", "Grafana のデータソースを通して PromQL のクエリを実行します。", map[string]string{"datasource_uid": "データソースの UID", "expr": "PromQL の式", "start": "開始時刻 (RFC 3339)", "end": "終了時刻 (RFC 3339)", "step": "解像度 (例: 30s)"}},
	{"grafana_query_loki", "Grafana のデータソースを通して LogQL のクエリを実行します。", map[string]string{"datasource_uid": "データソースの UID", "expr": "LogQL の式", "start": "開始時刻 (RFC 3339)", "end": "終了時刻 (RFC 3339)", "limit": "取得するログの行数"}},
	{"grafana_list_dashboards", "Grafana のダッシュボードを検索します。", map[string]string{"query": "ダッシュボードのタイトルの検索語", "tag": "タグ"}},
	{"grafana_list_alert_rules", "Grafana のアラートルールと現在の状態を一覧します。", map[string]string{"folder_uid": "フォルダーの UID"}},
	{"notion_search", "Notion のページとデータベースを検索します。", map[string]string{"query": "検索クエリ", "filter": "page か database"}},
	{"notion_get_page", "Notion のページの内容を Markdown で取得します。", map[string]string{"page_id": "ページの ID"}},
}

func extraTools(deferred bool) []agent.Tool {
	var tools []agent.Tool
	for _, s := range extraToolSpecs {
		props := map[string]any{}
		for name, desc := range s.params {
			props[name] = map[string]any{"type": "string", "description": desc}
		}
		tools = append(tools, agent.Tool{
			Name:        s.name,
			Description: s.description,
			Properties:  props,
			Deferred:    deferred,
			Run: func(context.Context, json.RawMessage) (string, error) {
				return "", errors.New("this tool is not available in this environment")
			},
		})
	}
	return tools
}
