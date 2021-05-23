---
title: Goでよく聞かれた質問とその参考リンク
date: 2021-05-23T10:00:00+09:00
draft: false
description: ""
categories:
  - 開発
tags:
  - Go
share: true
---

こんにちは、[@p1ass](https://twitter.com/p1ass)です。

最近研修で Go を書いているのですが、その際によく聞かれる質問があったので、これを機にブログにまとめようと思います。
正直、質問された際にすぐ答えられない質問も数多くあり、調べたり教えてもらったりすることで様々なことを再発見できました。

この記事では、質問に対する回答をできるだけ公式に近い文章を引用する形で書き記します。私個人の考えは別の段落になるようにして、事実と意見を区別するように心がけています。

なにか誤りを見つけた際は [GitHub で PR を投げていただける](https://github.com/p1ass/blog/edit/master/content/posts/go-faq/index.md)と助かります。

<!--more-->

## 言語仕様

### 関数の引数は値渡しか参照渡しか？

Go はすべて値渡し (pass by value) です。
ポインタの場合は、ポインタそのものがコピーされポインタの指し示す先の値はコピーされません。

{{<ex-title-link title="When are function parameters passed by value? - Frequently Asked Questions (FAQ) - The Go Programming Language" url="https://golang.org/doc/faq#pass_by_value">}}

### Go の多値返却はタプルか？

いいえ、タプルではありません。Python や JavaScript に実装されている分割代入とは異なり、複数の値を返します。そのため次のような書き方ができます。

```go
func Split(s string, pos int) (string, string) {
	return s[0:pos], s[pos:]
}

func Join(s, t string) string {
	return s + t
}

if Join(Split(value, len(value)/2)) != value {
	log.Panic("test fails")
}
```

{{<ex-title-link title="Calls - The Go Programming Language Specification" url="https://golang.org/ref/spec#Calls">}}

### `make([]int, 10, 100)` の第三引数の意味は？

make の第三引数はキャパシティと呼ばれ、どれだけのメモリを確保するかを指定できます。予めスライスの長さ以上のメモリを確保することで、`append` 時のメモリ再確保の回数を減らすことができます。

{{<ex-title-link url="https://blog.golang.org/slices-intro">}}

### `map[string]struct{}` の `struct{}` は何？

`struct{}` は empty struct と呼ばれ、フィールドを持たない構造体です。empty struct のメリットはメモリのサイズが 0 であることです。つまり、どれだけ使ってもメモリを消費しません。

{{<ex-title-link url="https://dave.cheney.net/2014/03/25/the-empty-struct">}}

#### 私見

例えば、値の重複を取り除く実装を map の key を使って実装した場合、value に入れる型は何でも良いです。こういった場合に empty struct を使うことで bool を指定するよりもメモリ使用量を抑えられます。

### goroutine とスレッドの違いは？

goroutine は、Go のランタイムに管理される軽量なスレッドです。

他の言語で並行処理に使われるスレッドはスレッドの作成にコストがかかったり、スレッドの切り替えにコストがかかったりします。
Go ではそのコストを下げるために、ランタイムで動く独自のスケジューラを用いて、goroutine と OS スレッドを対応づけて並行処理を実装しています。

詳しいデータ構造やアルゴリズムは 3 つ目のリンクの A Journey With Go が詳しいです。

{{<ex-title-link title="Goroutines - A Tour of Go" url="https://go-tour-jp.appspot.com/concurrency/1">}}

{{<ex-title-link url="https://talks.golang.org/2012/waza.slide#32">}}

{{<ex-title-link url="https://medium.com/a-journey-with-go/tagged/goroutines">}}

### なぜ Go には try-catch のような例外がないのか？

[Go at Google: Language Design in the Service of Software Engineering](https://talks.golang.org/2012/splash.article) から翻訳して引用します。

> まず、コンピュータ・プログラムのエラーには本当に例外的なものはありません。例えば、ファイルが開けないというのは一般的な問題であり、特別な言語表現には値しません。if や return で十分です。

```go
f, err := os.Open(fileName)
if err != nil {
    return err
}
```

> また、エラーが特殊な制御構造を使用している場合、エラー処理を行うプログラムの制御フローが歪んでしまいます。Java のような try-catch-finally ブロックのスタイルは、複雑に相互作用する複数の制御フローを組み合わせます。一方、Go では、エラーをチェックするために冗長になりますが、明示的な設計により、文字通り制御のフローをストレートに保つことができます。
>
> 結果としてコードが長くなることは間違いありませんが、このようなコードの明快さと単純さは、その冗長さを相殺します。明示的なエラーチェックは、エラーが発生したときにプログラマーにエラーについて考えさせ対処させます。例外があると、問題を処理するのではなく、無視することが容易になり、問題を修正したり、うまく診断できなくなるまで、コールスタックに責任を転嫁することになります。

#### 私見

既に Go に染まってしまったからかもしれませんが、個人的にはこのエラーハンドリングは好きです。
逆に try-catch を使った例外処理が書けなくなりました。

{{<ex-link url="https://talks.golang.org/2012/splash.article">}}

### `var s []string` と `s := make([]string,0)` と `s := []string{}` の違いは？

`var s []string` は nil slice を、残りの２つ nil ではないゼロ値であるスライスを生成します。基本的には nil slice の方が好まれますが、JSON にエンコーディングする場合などはあえてゼロ値をの方を使っても良いです。

{{<ex-title-link title="Declaring Empty Slices - CodeReviewComments · golang/go Wiki" url="https://github.com/golang/go/wiki/CodeReviewComments#declaring-empty-slices">}}

```go
package main

import (
	"fmt"
)

func main() {
	var s1 []string
	s2 := []string{}
	s3 := make([]string, 0)
	fmt.Printf("s1: %#v\n", s1)
	fmt.Printf("s2: %#v\n", s2)
	fmt.Printf("s3: %#v\n", s3)

	fmt.Printf("s1 len: %d\n", len(s1))
	fmt.Printf("s2 len: %d\n", len(s1))
	fmt.Printf("s3 len: %d\n", len(s1))
}

/*
s1: []string(nil)
s2: []string{}
s3: []string{}
s1 len: 0
s2 len: 0
s3 len: 0
*/
```

{{<ex-title-link url="https://play.golang.org/p/lJmXd0c10GC">}}

Uber Go Style Guide では nil slice が推奨されています。
{{<ex-title-link title="nil is a valid slice - Uber Go Style Guide" url="https://github.com/knsh14/uber-style-guide-ja/blob/master/guide.md#nil-is-a-valid-slice">}}

### なぜジェネリクスがないのか？

公式の FAQ には「Go の当初の目的であった Scalability や Readability、Concurrency を達成するために必ずしもジェネリクスは必要でなかった」と書かれています。

{{<ex-title-link title="Why does Go not have generic types? - Frequently Asked Questions (FAQ) - The Go Programming Language" url="https://golang.org/doc/faq#generics">}}

なお、現在はジェネリクスを実装するプロポーザルが承認されており、Go1.18 にてリリースされる予定です。

{{<ex-link url="https://blog.golang.org/generics-next-step">}}

{{<ex-link url="https://github.com/golang/go/issues/43651">}}

### Enum を定義したい

#### 私見

Go には Enum 型は無いので `iota` を使って独自に Enum っぽいものを定義することが多いです。

```go
type Language int

const (
    Unknown Language = iota
    Japanese
    English
)
```

Enum っぽいものを定義する際にはゼロ値を Unknown のようなデフォルト値を設定するようにすると便利です。
また、`fmt.Stringer` を実装しておくとデバッグ時に役立ちます。

{{<ex-title-link url="https://blog.y-yuki.net/entry/2017/05/09/000000">}}
{{<ex-title-link url="https://qiita.com/cia_rana/items/9d00ce81252ed970f362">}}

## 標準ライブラリ

### なぜビルドインの `print` ではなく `fmt` package を使うのか？

ビルドインの `print` や `println` 関数の表示方法は実装依存で定めがありません。また、出力は必ず標準エラー出力に出力されます。そのため、基本的には自由度の高い `fmt` パッケージが使われます。

{{<ex-title-link url="https://pkg.go.dev/builtin@go1.16.4#print">}}

### いい感じにエラーハンドリングしたい

Go 1.13 から追加された標準の errors パッケージを使うことで、エラーによって処理を分岐できます。

{{<ex-title-link url="https://pkg.go.dev/errors">}}

#### 私見

以前は pkg/errors が使われていましたが、徐々に標準の errors パッケージが使われることが多くなってきたように感じます。
標準の errors パッケージはスタックトレースを保持しないので、スタックトレースを表示させたい場合は準標準の xeerors を使うこともあります。

{{<ex-title-link title="pkg/errors・pkg.go.dev" url="https://pkg.go.dev/github.com/pkg/errors">}}
{{<ex-title-link url="https://pkg.go.dev/golang.org/x/xerrors">}}

### 構造体をいい感じに標準出力に出したい

通常、構造体を `%v` や `%+v` で出力するとフィールド名やその値が表示されますが、`fmt.Stringer` インターフェイスを実装することで表示をカスタマイズできます。

{{<ex-link url="https://qiita.com/tenntenn/items/453a09c4c6d7f580d0ab">}}

## 公式のエコシステム周り

### Go のライブラリ管理のエコシステムが知りたい

現在(2021/05)では、公式で提供されている Go Module を使います。

{{<ex-link url="https://blog.golang.org/using-go-modules">}}

### Go の Formatter や Linter を知りたい

Formatter は Go 標準で `gofmt` コマンドがあります。

{{<ex-title-link url="https://golang.org/cmd/gofmt/">}}

Linter はいくつか種類がありますが、公式のでは怪しい構造をレポートする `go vet` コマンドがあります。

{{<ex-title-link url="https://golang.org/cmd/vet/">}}

その他にも、サードパーティの Linter を集めた golangci-lint という Linter のランナーがあります。

{{<ex-link url="https://github.com/golangci/golangci-lint">}}

## スタイル周り

### なぜ Go の変数名は短いのか？

Go Code Review Comments から翻訳して引用します。

> Go の変数名は、長いものよりも短いものを選ぶべきです。これは特に範囲が限定されたローカル変数に当てはまります。lineCount より c を優先します。sliceIndex よりも i の方がいいです。  
> 基本的なルールとして、宣言から離れたところで名前が使われるほど、その名前はより説明的でなければなりません。メソッドレシーバーの場合、1 文字か 2 文字で十分です。ループの index や readers などの一般的な変数は、1 文字(i, r)で構いません。もっと変わったものやグローバル変数には、より記述的な名前が必要です。

全ての変数を短くすべきというわけではなく、スコープが限定されたローカル変数や自明なものだけで良いです。
スコープが広いものは説明的な長い変数名をつけても OK です。

{{<ex-title-link title="Variable Names - CodeReviewComments · golang/go Wiki" url="https://github.com/golang/go/wiki/CodeReviewComments#variable-names">}}

### メソッド定義時のレシーバーの型はポインタ型と実体型のどちらが良いか？

Go の FAQ では、

1. メソッドがレシーバーを変更するかどうか
2. 効率性
3. 一貫性

の観点から解説されています。

{{<ex-title-link title="Should I define methods on values or pointers? - Frequently Asked Questions (FAQ) - The Go Programming Language" url="https://golang.org/doc/faq#methods_on_values_or_pointers">}}

#### 私見

私はこれらを考慮した上でポインタ型を選ぶことが多いです。
周りの人達もほとんどポインタ型を使っていることが多いです。

### Go のパッケージ構成のデファクトはあるのか？

[golang-standards/project-layout](https://github.com/golang-standards/project-layout) という Go 非公式のリポジトリがありますが、Go Team の Russ Cox から standard と呼ぶのは正確ではないという趣旨の issue が立てられています。

{{<ex-link url="https://github.com/golang-standards/project-layout/issues/117">}}

パッケージ構成ではないですが、パッケージ名に関する記事は公式の The Go Blog にあります。

{{<ex-link url="https://blog.golang.org/package-names">}}

#### 私見

現時点でデファクトと言えるものはないと思っています。golang-standards のようなパッケージ構成をしているリポジトリはほとんど見たことがありません。

私が自分でパッケージ構成を考える場合は、

- CLI・ライブラリならできるだけフラットな構成
- Web アプリケーションなら依存関係のレイヤーが分かるような構成

にすることが多いです。

## サードパーティライブラリ

### HTTP ライブラリのおすすめは？

#### 私見

自分の用途に合わせて、丁度よいライブラリを選択するのをオススメします。
（ジャンル分けは筆者オリジナルです）

- **標準ライブラリ**
  - [net/http](https://pkg.go.dev/net/http)
- **ルーティングライブラリ**
  - 標準ライブラリでは難しい HTTP メソッド等を用いたルーティングを簡単に書くためのライブラリ
  - ハンドラ関数のインターフェイスは net/http 互換
  - [gorrila/mux](https://github.com/gorilla/mux)
  - [go-chi/chi](https://github.com/go-chi/chi)
  - [julienschmidt/httprouter](https://github.com/julienschmidt/httprouter)
- **Web フレームワーク**
  - ハンドラ関数のインターフェイスをライブラリ独自のものを使うことで、ルーティングライブラリよりも多くの機能を提供するフレームワーク
  - [gin-gonic/gin](https://github.com/gin-gonic/gin)
  - [labstack/echo](https://github.com/labstack/echo)
- **フルスタック Web フレームワーク**
  - HTTP だけでなくデータベースの ORM もセットにしたフレームワーク
  - [beego/beego](https://github.com/beego/beego)
- **その他**
  - [go-swagger/go-swagger](https://github.com/go-swagger/go-swagger)

下に行くにつれ高機能になりますが、標準ライブラリと比べ複雑になり学習コストが高くなる印象があります。日本ではルーティングライブラリか Web フレームワークに分類したライブラリがよく使われているように感じます。

個人的には、

- ある程度多くの API を生やすことが見込まれる場合 → Web フレームワーク
- ちょっとした HTTP サーバを書く場合 → ルーティングライブラリ

を選択することが多いです。

ある程度多くの API を生やすことが見込まれる場合はルーティング以外の部分（リクエスト・レスポンスのマッピングなど）の処理も良い感じにラップした関数が欲しくなってくることが多く、自作するんだったら最初から内包されている Web フレームワークを使ったほうが良いのでは？と考えています。

### Table Driven Test を書くのがダルい

gotests という CLI を使うことで簡単にテストの雛形を作成できます。
VS Code や Goland では拡張機能にこの機能が組み込まれているので、関数を右クリックしたメニューから同様の機能を使えます。

![画像](https://raw.githubusercontent.com/cweill/GoTests-Sublime/master/gotests.gif)
_GitHub より引用_

{{<ex-link url="https://github.com/cweill/gotests">}}

### テストの構造体比較に reflect ではなく go-cmp を使うメリットは何か?

[google/go-cmp](https://github.com/google/go-cmp) は Go の値の同一性を判定するパッケージです。

`reflect.DeepEqual` では、

- プライベートなフィールドまで比較してしまうので、`time.Time` の比較が難しい (同じ時間であってもプライベートフィールドの値が異なる)
- 独自の Equal 関数を使用できない

といった課題がありましたが、go-cmp を使うことで解決できます。

他にも、柔軟な同一性判定のための独自のオプション機能や見やすい diff 表示機能もあります。

```go

MakeGatewayInfo() mismatch (-want +got):
  cmp_test.Gateway{
  	SSID:      "CoffeeShopWiFi",
- 	IPAddress: s"192.168.0.2",
+ 	IPAddress: s"192.168.0.1",
  	NetMask:   {0xff, 0xff, 0x00, 0x00},
  	Clients: []cmp_test.Client{
  		... // 2 identical elements
  		{Hostname: "macchiato", IPAddress: s"192.168.0.153", LastSeen: s"2009-11-10 23:39:43 +0000 UTC"},
  		{Hostname: "espresso", IPAddress: s"192.168.0.121"},
  		{
  			Hostname:  "latte",
- 			IPAddress: s"192.168.0.221",
+ 			IPAddress: s"192.168.0.219",
  			LastSeen:  s"2009-11-10 23:00:23 +0000 UTC",
  		},
+ 		{
+ 			Hostname:  "americano",
+ 			IPAddress: s"192.168.0.188",
+ 			LastSeen:  s"2009-11-10 23:03:05 +0000 UTC",
+ 		},
  	},
  }
```

{{<ex-link url="https://github.com/google/go-cmp">}}

## その他のよくある質問は?

すでに何度かリンクを貼りましたが、公式の FAQ があるので一読をオススメします。

{{<ex-title-link url="https://golang.org/doc/faq">}}
