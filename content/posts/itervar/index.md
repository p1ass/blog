---
title: Goのよくあるミスを発見する静的解析ツールを作った話
date: 2020-09-04T00:00:00+09:00
draft: false
description:
categories:
  - 開発
tags:
  - Go
  - 静的解析
eyecatch: /posts/itervar/ogp.jpg
share: true
---

こんにちは [@p1ass](https://twitter.com/p1ass) です。
Go のよくある間違いとして、ループのイテレーター変数の参照をループの中でとってしまうという間違いがあります。
イテレーター変数は 1 イテレーションごとにアドレスが変わらないので、「この参照をそのまま配列に append すると配列の結果が全て同じ値になってしまう」といったことが発生してしまいます。この問題はよくある間違いとして Go の wiki にも取り上げています。しかし、現状では公式でこの間違いを検出する静的解析ツールは用意されていません。

そこで、僕はメルカリのインターンで イテレーター変数の参照をループ内で使ってしまっているコードを検出する静的解析ツールを作成したのでそれを紹介したいと思います。

## Using reference to loop iterator variable

今回対象とした間違いである「Using reference to loop iterator variable」についてもう少し詳しく紹介します。

[CommonMistakes · golang/go Wiki](https://github.com/golang/go/wiki/CommonMistakes)

サンプルコードとして以下のコードを考えます。

```go
package main

import "fmt"

func main() {
  var out []*int
  for i := 0; i < 3; i++ {
    fmt.Println(i)
    out = append(out, &i)
  }
  for _, o := range out {
    fmt.Println(*o)
  }
}

// Output
// 0
// 1
// 2
// 3
// 3
// 3
```

{{<ex-link url="https://play.golang.org/p/3j5V3yHWx4G">}}

このコードを実行すると、`out` の中身は`{3, 3, 3}` と、同じ値になってしまいます。`i`のポインタ値がどのイテレーションでも同じなことが原因です。詳しくは以前ブログに書きました。

{{<ex-link url="https://blog.p1ass.com/posts/pointer-of-for-range-loop-of-go/">}}

この対策はいたって簡単です。イテレーター変数をブロックの最初で再定義してしまえば OK です。再定義することでイテレーションのたびにポインターのアドレスが変わるので、問題なく動くようになります。

```go
package main

import "fmt"

func main() {
  var out []*int
  for i := 0; i < 3; i++ {
        i := i // アドレスが毎回変わるようになる
    fmt.Println(i)
    out = append(out, &i)
    }
    for _, o := range out {
    fmt.Println(*o)
  }
}
```

この間違いは頻出なのにもかかわらず、go vet 等の標準の静的解析ツールでは検出してくれません。
非常に有名な問題なので以前から「公式で静的解析ツールを用意すべきなのでは」と言う意見が上がっているのですが、今のところ導入される予定はなく、Russ Cox は 「Go2 でこの挙動の無効化を考えてる」と言っていました。

{{<ex-link url="https://github.com/golang/go/issues/16520">}}

{{<ex-link url="https://github.com/golang/go/issues/20725">}}

## 作ったもの

この間違いを検出する静的解析ツールを作りました。名前は itervar です。

{{<ex-link url="https://github.com/p1ass/itervar">}}

使い方としては go get でバイナリをダウンロードした後に、go vet の `-vettool`で itervar を選択して使います。先程の例であれば、9 行目の部分でエラーが表示されます。

```shell script
$ go vet -vettool=`which itervar` ./...
# path/to/project
./main.go:9:21: using reference to loop iterator variable
```

## 実装

このツールは gostaticanalysis オーガナイゼーションにある skeleton と言う CLI ツールを使って雛形を作成しています。

{{<ex-link url="https://github.com/gostaticanalysis/skeleton">}}

このツールを使うと analysis package を使った雛形のソースコードが生成されるだけでなく、テストデータの雛形とテストコードも一緒に作ってくれます。これにより、ロジックに集中して、静的解析ツールを作成することができます。

イテレータ変数の参照を検出する実装方針ですが、

1. まず、AST を探索して for 文と range 文を探索して見つけます。
2. その後、そこで定義されているイテレーター変数の識別子を取得します。
3. 最後に、ブロック内でその変数が使われている箇所を探し、そこで参照を取っていたらエラーを出します。

ロジックはかなりシンプルにまとめることができました。

このツールを作る上でいくつか注意した点があるのですが、そのひとつに **「変数名が同じだからといって必ずしもそれらが同じ変数であるとは限らない」** とう点があります。

Go では、同じ名前の変数を子スコープの中で定義することができます。例えば、次のようなコードでは`i`と言う変数を 2 回定義していますが問題なく動きます。

```go
func main() {
    var out []*int
    for i := 0; i < 3; i++ {
        {
            i := i
            out = append(out, &i) // こっちはイテレータ変数とは違う変数なので検出しなくてよい
        }
        out = append(out, &i) // want "using reference to loop iterator variable"
    }
    for _, o := range out {
        fmt.Printf("Value:%d, Address: %p\n", *o, o)
    }
}
```

したがって、子スコープ内で再度定義されている`i`の参照をとっている部分でエラーを出してはいけません。ただ単に変数名だけをみて検出するとこのパターンで引っかかるので、`*ast.Object`を比較して、イテレータ変数のものと一致すればエラーを出す実装にしました。

## 今後の展開

false positive な検出が多いのでもう少し精度良く検出できたら嬉しいと考えています。現在の実装では、参照を取っているだけでエラーにしていて、その参照がもう一度他の箇所で使われるかどうか確認していません。例えば、`fmt.Println(&i)` をするだけであればバグが発生することはありませんが、エラーが出てしまいます。とはいえこのような false positive なパターンを網羅するのは難しいので、これから良い方法を模索していきたいです。

### おわりに

初めて Go の静的解析ツールを 1 から作りましたが、「思ったより簡単に作れたな」というのが正直な感想です。三日間で今これだけのものが作れたのは、 Go の静的解析のしやすさのおかげなのかなと思っています。

皆さんもぜひ何か静的解析ネタ思いついたら作ってみてください。
