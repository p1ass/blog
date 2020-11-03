---
title: 複数のRSSや任意の情報をまとめて1つのRSSやJSONを生成するライブラリを作成した
date: 2020-10-31T20:40:00+09:00
draft: false
description: 皆さん RSS 使ってますか？RSS を使えば簡単にブログの更新を受け取れたりして便利ですよね。でも、流れてくる情報多くて辛かったり、RSS に対応していないサイトの情報を受け取りたかったりすることがたまにありませんか？そんな悩みを解決するための Go のライブラリを 1 年前に作ったのですが、ブログに書く機会を逃していたので、今更ですが紹介記事を書きます。
categories:
  - 開発
tags:
  - Go
  - RSS
  - OSS
share: true
---

こんにちは [@p1ass](https://twitter.com/p1ass) です。

皆さん RSS 使ってますか？RSS を使えば簡単にブログの更新を受け取れたりして便利ですよね。

でも、流れてくる情報多くて辛かったり、RSS に対応していないサイトの情報を受け取りたかったりすることがたまにありませんか？

そんな悩みを解決するための Go のライブラリを 1 年前に作ったのですが、ブログに書く機会を逃していたので、今更ですが紹介記事を書きます。

発表スライドはこちらです。

<script async class="speakerdeck-embed" data-id="a8fdbaceeffc42a3b2b46592c824034e" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

<!--more-->

## 背景

[RSS](https://ja.wikipedia.org/wiki/RSS) はニュースやブログなど各種ウェブサイトの更新情報を配信するための文書フォーマットです。ブログのタイトルや URL、公開日などが xml 形式で記述されています。

RSS は広く使われているフォーマットで、はてなブログや Qiita、Zenn はデフォルトで対応しています。(似た形式の [Atom](<https://ja.wikipedia.org/wiki/Atom_(%E3%82%A6%E3%82%A7%E3%83%96%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E9%85%8D%E4%BF%A1)>) の場合もある)

- はてなブログ: `https://[ユーザ名].hatenablog.com/rss`
- Qiita: `https://qiita.com/[ユーザ名]/feed`
- Zenn: `https://zenn.dev/[ユーザ名]/feed`

他にも、[GCP のリリースノート](https://cloud.google.com/feeds/gcp-release-notes.xml)や [YouTube チャンネルの更新情報](https://www.youtube.com/feeds/videos.xml?channel_id=UCt30jJgChL8qeT9VPadidSw)なども RSS で配信されています。

これらを RSS リーダーである[Feedly](https://feedly.com/)や Slack の RSS アプリに登録すれば、記事の更新を素早くキャッチできます。

しかし、個人的に RSS にはいくつか辛い点がありました。

- **RSS で配信される情報が多い。** GCP のリリースノートのようにサービスごとに個別で RSS があれば良いですが、全ての情報が 1 つの RSS で配信されている場合があります。その場合は自分で情報をフィルタリングする必要があります。
- **そもそも RSS に対応していないサイトが多くある。** 音楽アーティストの HP や映画の HP の更新情報などは RSS が配信されていないことが多いです。

こういった辛みをいい感じに解決したいと考えてライブラリを作成しました。

## [p1ass/feeder](https://github.com/p1ass/feeder)

作成したライブラリは[p1ass/feeder](https://github.com/p1ass/feeder)です。

![ロゴ](https://github.com/p1ass/feeder/raw/master/image/feeder_logo.png)
_それっぽいロゴを作った_

基本的な使い方はこちらの例を見ればなんとなく掴めると思います。

```go
func crawl(){
	rss1 := feeder.NewRSSCrawler("https://example.com/rss1")
	rss2 := feeder.NewRSSCrawler("https://example.com/rss2")

	items, err := feeder.Crawl(rss1, rss2)

	feed := &feeder.Feed{
		Items:       items,
		// 細かいパラメータは省略
	}

	rss, err := feed.ToRSS() // rss is string
	rssReader, err := feed.ToRSSReader() // jsonReader is a io.Reader
}
```

_エラーハンドリングをきちんとしていない点に注意してください_

`feeder.NewRSSCrawler()` でクローラーを作成し、`feeder.Crawl()` に渡すことで記事の一覧を取得しています。
その後、 `*feeder.Feed` 構造体を作成すると、RSS や JSON、Atom を生成できます。
後はそれをファイルに保存したり、HTTP で配信したりと好きなように使えます。

また、feeder では次のようなこともできます。

- **独自にインタフェースを満たした構造体を作ることで、任意のサイトの情報からフィードを作成**
- 出力は RSS だけでなく、Atom や JSON にも対応
- RSS の記事をフィルタして新たな RSS を作成

### 独自にインタフェースを満たした構造体を作ることで、任意のサイトの情報からフィードを作成

feeder では `Crawler` というインターフェースを提供しています。

```go
type Crawler interface {
	Crawl() ([]*Item, error)
}
```

この Crawler は `feeder.Crawl(crawlers ...Crawler)` のように `Crawl()` 関数に渡すことができます。

つまり、この `Crawler` インターフェースを満たす構造体を作成すれば、任意の情報から RSS フィードを作成てきるようになります。

例としてサマソニのチケットサイトをクロールする SamasoniCrawler のコードを載せておきます。

<details>
<summary>コード</summary>

```go
func (crawler *SamasoniCrawler) Crawl() ([]*feeder.Item, error) {
	query := url.Values{}
	query.Add("perform_id", "85895")
	query.Add("sort_key", "sale_start_at")
	query.Add("sort_order", "asc")
	res, err := http.Get(crawler.url + "?" + query.Encode())
	if err != nil {
		return nil, errors.New("failed to get html document")
	}
	defer res.Body.Close()
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, errors.New("failed to read from response body")
	}

	sec := doc.Find("div#tickets").Find("div.list-ticket")
	items := make([]*feeder.Items)
	sec.Each(func(index int, s *goquery.Selection) {
		if s.HasClass("list-ticket") {
			title := s.Find("h2").Find("a").Text()
			path, _ := s.Find("h2").Find("a").Attr("href")
			t := time.Now()
			item := &feeder.Item{Title: title, Link: &feeder.Link{Href: "https://tiketore.com" + path,
				Rel: "", Type: "", Length: ""},
				Id:      path,
				Created: &t,
			}
			items = append(items, item)
		}
	})
	return items, nil
}

```

</details>

これと Slack の RSS の通知に登録すれば、チケットが販売されたタイミングで通知を受け取ることができるようになります。便利ですね。[^1]

[^1]: Slack の RSS 更新間隔では到底チケット戦争に勝てることはなかった。

### 出力は RSS だけでなく、Atom や JSON にも対応

出力は RSS だけでなく Atom や JSON にも対応しています。

```go
json, err := feed.ToJSON() // json is string
atom, err := feed.ToAtom() // atom is string

jsonReader, err := feed.ToJSONReader() // jsonReader is a io.Reader
atomReader, err := feed.ToAtomReader() // jsonReader is a io.Reader
```

私はこれを使ってブログの記事一覧を返す JSON API を建てており、[ポートフォリオサイト](https://p1ass.com)に API 経由で取得した情報を載せています。

### RSS の記事をフィルタして新たな RSS を作成

記事情報は `[]*feeder.Item` というスライスになっているので、スライスの中から必要な情報のみをフィルターする関数を作れば OK です。

```go
func filterIfTitleContainsGo(items []*feeder.Item) []*feeder.Items {
	filtered = make([]*filter.Item, 0, len(items))
	for _, item := range items {
		if strings.Contains(item.Title, "Go") {
			filtered = append(filtered, item)
		}
	}
	return filtered
}
```

## 終わりに

[p1ass/feeder](https://github.com/p1ass/feeder) を使えば RSS を自由自在に扱えます。  
色んな用途に使えるライブラリだと思うので、良かったら使ってみてください。
スターも待ってます。
