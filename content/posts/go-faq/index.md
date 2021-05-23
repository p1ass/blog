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
正直、質問された際にすぐ答えられない質問も数多くあり非常にためになりました。

この記事では、質問に対する回答をできるだけ公式に近い文章を引用する形で書き記します。私個人の考えは別の段落になるようにして、事実と意見を区別するように心がけています。

なにか誤りを見つけた際は [GitHub で PR を投げていただける](https://github.com/p1ass/blog/edit/master/content/posts/go-faq/index.md)と助かります。

<!--more-->

## 言語仕様

### Enum を定義したい

Go には Enum 型は無いので `iota` を使って独自に Enum っぽいものを定義することが多いです。

```go
type Language int

const (
    Unknown Language = iota
    Japanese
    English
)
```

#### 私見

Enum っぽいものを定義する際にはゼロ値を Unknown のようなデフォルト値を設定するようにすると便利です。
また、`fmt.Stringer` を実装しておくとデバッグ時に役立ちます。

{{<ex-link url="https://blog.y-yuki.net/entry/2017/05/09/000000">}}
{{<ex-link url="https://qiita.com/cia_rana/items/9d00ce81252ed970f362">}}

### goroutine と thread の違いは？

goroutine は、Go のランタイムに管理される軽量なスレッドです。

他の言語で並行処理に使われる OS スレッドはスレッドの作成にコストがかかったり、スレッドの切り替えにコストがかかったりします。
Go ではそのコストを下げるために、ランタイムで動く独自のスケジューラを用いて、goroutine と OS スレッドを対応づけて並行処理を実装しています。

詳しいデータ構造やアルゴリズムは 3 つ目のリンク先の A Journey With Go で解説されています。

{{<ex-link url="https://go-tour-jp.appspot.com/concurrency/1">}}

{{<ex-link url="https://talks.golang.org/2012/waza.slide#32">}}

{{<ex-link url="https://medium.com/a-journey-with-go/tagged/goroutines">}}

### なぜ Go には try-catch のような例外がないのか？

Go at Google: Language Design in the Service of Software Engineering から引用します。

> First, there is nothing truly exceptional about errors in computer programs. For instance, the inability to open a file is a common issue that does not deserve special linguistic constructs; if and return are fine.

```go
f, err := os.Open(fileName)
if err != nil {
    return err
}
```

> Also, if errors use special control structures, error handling distorts the control flow for a program that handles errors. The Java-like style of try-catch-finally blocks interlaces multiple overlapping flows of control that interact in complex ways. Although in contrast Go makes it more verbose to check errors, the explicit design keeps the flow of control straightforward—literally.
>
> There is no question the resulting code can be longer, but the clarity and simplicity of such code offsets its verbosity. Explicit error checking forces the programmer to think about errors—and deal with them—when they arise. Exceptions make it too easy to ignore them rather than handle them, passing the buck up the call stack until it is too late to fix the problem or diagnose it well.

{{<ex-link url="https://talks.golang.org/2012/splash.article">}}

### `var s []string` と `s := make([]string,0)` と `s := []string{}` の違い

`var s []string` は nil slice を、それ以外は nil ではないがゼロ値を持った値を生成します。

> Note that there are limited circumstances where a non-nil but zero-length slice is preferred, such as when encoding JSON objects (a nil slice encodes to null, while []string{} encodes to the JSON array []).

基本的には nil slice の方が好まれますが、JSON にエンコーディングする場合などはあえて zero-length slice を使っても良いです。

Uber Go Style Guide でも nil slice が推奨されています。

{{<ex-link url="https://play.golang.org/p/lJmXd0c10GC">}}

{{<ex-link url="https://github.com/golang/go/wiki/CodeReviewComments#declaring-empty-slices">}}

{{<ex-link url="https://github.com/knsh14/uber-style-guide-ja/blob/master/guide.md#nil-is-a-valid-slice">}}

### Go の多値返却はタプルなのか？

いいえ、タプルではありません。
Python や JavaScript に存在する分割代入とは異なり、複数の値を返します。

そのため、こういった書き方ができます。

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

{{<ex-link url="https://golang.org/ref/spec#Calls">}}

### 関数の引数は値渡しか参照渡しか？

Go はすべて値渡し (pass by value) です。
ポインタの場合は、ポインタそのものがコピーされポインタの指し示す先の値はコピーされません。

{{<ex-link url="https://golang.org/doc/faq#pass_by_value">}}

### なぜジェネリクスがないのか？

公式の FAQ には、Go の当初の目的であった Scalability や Readability、Concurrency を達成するために必ずしもジェネリクスは必要でなかったと書かれています。

{{<ex-link url="https://golang.org/doc/faq#generics">}}

なお、現在はジェネリクスを実装するプロポーザルが承認されて、Go1.18 にてリリースされる予定です。

{{<ex-link url="https://blog.golang.org/generics-next-step">}}

{{<ex-link url="https://github.com/golang/go/issues/43651">}}

### `make([]int, 10, 100)` の第三引数の意味

make の第三引数はキャパシティと呼ばれ、生成するスライスがどれだけのサイズのメモリを確保するか決める事ができます。

予め長さ以上のメモリを確保することでスライスに `append` する際にメモリの再確保が走る回数を減らすことができます。

{{<ex-link url="https://blog.golang.org/slices-intro">}}

### `map[string]struct{}` の `struct{}` は何？

`struct{}` は empty struct と呼ばれ、フィールドを持たない構造体です。

empty struct の良いところはメモリのサイズが 0 であることです。つまりどれだけ使ってもメモリを消費しません。

例えば、スライスから重複をなくす実装を map の key を使って実装した場合、value に入れる型は何でも良いです。こういった場合に empty struct を使うことで bool を指定するよりもメモリ使用量を抑えられます。

{{<ex-link url="https://dave.cheney.net/2014/03/25/the-empty-struct">}}

## 標準ライブラリ

### なぜビルドインの `print` ではなく `fmt` package を使うのか？

ビルドインの `print` や `println` 関数の表示方法は実装依存で定めがありません。また、出力は必ず標準エラー出力に出力されます。

そのため、基本的には自由度の高い `fmt` パッケージが使われます。

{{<ex-link url="https://pkg.go.dev/builtin@go1.16.4#print">}}

### いい感じにエラーハンドリングしたい

Go 1.13 から追加された標準の errors パッケージを使うことで、エラーによって処理を分岐することができます。

{{<ex-link url="https://pkg.go.dev/errors">}}

#### 私見

以前は pkg/errors が使われていましたが、徐々に標準の errors パッケージが使われることが多くなってきたように感じます。

{{<ex-link url="https://pkg.go.dev/github.com/pkg/errors">}}

標準の errors パッケージはスタックトレースを保持しないので、スタックトレースを表示させたい場合は準標準の xeerors を使うこともあります。

{{<ex-link url="https://pkg.go.dev/golang.org/x/xerrors">}}

### 構造体をいい感じに標準出力に表示したい

通常、構造体を `%v` や `%+v` で出力するとフィールド名やその値が表示されますが、`fmt.Stringer` インターフェイス等を実装することで表示をカスタマイズできます。

{{<ex-link url="https://qiita.com/tenntenn/items/453a09c4c6d7f580d0ab">}}

## 公式のエコシステム周り

### Go のライブラリ管理のエコシステムが知りたい

現在(2021/05)では、公式で提供されている Go Module を使います。

{{<ex-link url="https://blog.golang.org/using-go-modules">}}

### Go の Formatter や Linter を知りたい

Formatter は Go 標準で `gofmt` コマンドがあります。

{{<ex-link url="https://golang.org/cmd/gofmt/">}}

Linter はいくつか種類がありますが、公式の Linter として怪しい構造をレポートする `go vet` コマンドがあります。

{{<ex-link url="https://golang.org/cmd/vet/">}}

その他にも、サードパーティの Linter を集めた golangci-lint という Linter のランナーがあります。

{{<ex-link url="https://github.com/golangci/golangci-lint">}}

## スタイル周り

### メソッド定義時のレシーバーの型はポインタ型と実体型のどちらが良いか？

Go の FAQ では、

1. メソッドがレシーバーを変更するかどうか
2. 効率性
3. 一貫性

の観点から解説されています。

{{<ex-link url="https://golang.org/doc/faq#methods_on_values_or_pointers">}}

#### 私見

私はこれらを考慮した上でポインタ型を選ぶことが多いです。
周りの人達もほとんどポインタ型を使っていることが多いです。

### なぜ `panic` を使わないのか？

panic は回復不可能な状況が発生したときに使うもので、エラーハンドリングで使うものではないからです。

{{<ex-link url="https://github.com/knsh14/uber-style-guide-ja/blob/master/guide.md#dont-panic">}}

#### 私見

System design における[Fail-fast](https://en.wikipedia.org/wiki/Fail-fast)の考えに基づいて、絶対に起こり得ない条件分岐先に `panic` を置いておいて、仮にバグってそこにたどり着いたとしてもすぐにプログラムが終了するような設計をすることはあります。

### なぜ Go の変数名は短いのか？

Go Code Review Comments にて、次のように書かれています。

> Variable names in Go should be short rather than long. This is especially true for local variables with limited scope. Prefer c to lineCount. Prefer i to sliceIndex.
>
> The basic rule: the further from its declaration that a name is used, the more descriptive the name must be. For a method receiver, one or two letters is sufficient. Common variables such as loop indices and readers can be a single letter (i, r). More unusual things and global variables need more descriptive names.

全ての変数を短くすべきというわけではなく、スコープが限定されたローカル変数や自明なものだけで良いです。
スコープが広いものは説明的な長い変数名をつけても OK です。

{{<ex-link url="https://github.com/golang/go/wiki/CodeReviewComments#variable-names">}}

## サードパーティライブラリ

### Table Driven Test を書くのがダルい

gotests という CLI を使うことで簡単にテストの雛形を作成できます。
VS Code や Goland では拡張機能にこの機能が組み込まれているので、関数を右クリックしたメニューから同様の機能を使えます。

![画像](https://raw.githubusercontent.com/cweill/GoTests-Sublime/master/gotests.gif)
_GitHub より引用_

{{<ex-link url="https://github.com/cweill/gotests">}}

### なぜテストの構造体比較に reflect ではなく go-cmp を使うメリットは何か

google/go-cmp は Go の値の同一性を判定するパッケージです。

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

### Go のパッケージ構成のデファクトはあるのか？

現時点でデファクトと言えるものはありません。

[golang-standards/project-layout](https://github.com/golang-standards/project-layout) という Go 非公式のリポジトリがありますが、Go Team の Russ Cox から standard と呼ぶのは正確ではないという趣旨の issue が立てられています。

{{<ex-link url="https://github.com/golang-standards/project-layout/issues/117">}}

パッケージ構成ではないですが、パッケージ名に関する記事は公式の The Go Blog にあります。

{{<ex-link url="https://blog.golang.org/package-names">}}

#### 私見

golang-standards のようなパッケージ構成をしているリポジトリはほとんど見たことがありません。

私が自分でパッケージ構成を考える場合は、

- CLI・ライブラリならできるだけフラットな構成
- Web アプリケーションなら依存関係のレイヤーが分かるような構成

にすることが多いです。

### HTTP ライブラリのおすすめは？

自分の用途に合わせて、丁度よいライブラリを選択するのをオススメします。
（ジャンル分けは筆者オリジナルです）

#### 標準ライブラリ

- [net/http](https://pkg.go.dev/net/http)

#### ルーティングライブラリ

- 標準ライブラリでは難しい HTTP メソッド等を用いたルーティングを簡単に書くためのライブラリ
- ハンドラ関数のインターフェイスは net/http 互換
- [gorrila/mux](https://github.com/gorilla/mux)
- [go-chi/chi](https://github.com/go-chi/chi)
- [julienschmidt/httprouter](https://github.com/julienschmidt/httprouter)

#### Web フレームワーク

- ハンドラ関数のインターフェイスをライブラリ独自のものを使うことで、ルーティングライブラリよりも多くの機能を提供するフレームワーク
- [gin-gonic/gin](https://github.com/gin-gonic/gin)
- [labstack/echo](https://github.com/labstack/echo)

#### フルスタック Web フレームワーク

- HTTP だけでなくデータベースの ORM もセットにしたフレームワーク
- [beego/beego](https://github.com/beego/beego)

#### その他

- [go-swagger/go-swagger](https://github.com/go-swagger/go-swagger)

#### 私見

下に行くにつれ高機能になりますが、標準ライブラリと比べ複雑になり学習コストが高くなる印象があります。日本ではルーティングライブラリか Web フレームワークに分類したライブラリがよく使われているように感じます。

個人的には、

- ある程度多くの API を生やすことが見込まれる場合 → Web フレームワーク
- ちょっとした HTTP サーバを書く場合 → ルーティングライブラリ

を選択することが多いです。

ある程度多くの API を生やすことが見込まれる場合はルーティング以外の部分（リクエスト・レスポンスのマッピングなど）の処理も良い感じにラップした関数が欲しくなってくることが多く、自作するんだったら最初から内包されている Web フレームワークを使ったほうが良いのでは？と考えています。

## その他のよくある質問は

{{<ex-link url="https://golang.org/doc/faq">}}
