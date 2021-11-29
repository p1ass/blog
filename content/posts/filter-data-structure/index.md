---
title: 二項演算子のASTを参考にした動的なフィルターのデータ構造
date: 2021-11-30T00:00:00+09:00
draft: false
description: 二項演算子の AST から着想を得たデータ構造を用いて、任意のフィルター条件を自由自在に組み合わせるデータ構造を紹介します。
categories:
  - 開発
tags:
  - 設計
  - データ構造
  - Go

share: true
---

_この記事は[DeNA 21 新卒 ×22 新卒内定者 Advent Calendar 2021](https://qiita.com/advent-calendar/2021/dena-21x22)の 1 日目の記事です。_

こんにちは、[@p1ass](https://twitter.com/p1ass)です。

いよいよ[DeNA 21 新卒 ×22 新卒内定者 Advent Calendar 2021](https://qiita.com/advent-calendar/2021/dena-21x22)が始まります 🙌  
今年は新卒と内定者によるこの Advent Calendar と DeNA のエンジニアが担当する[DeNA Advent Calendar 2021](https://qiita.com/advent-calendar/2021/dena)の 2 種類があるので、どちらもぜひチェックしてください！

この記事は 1 日目ではありますが軽いネタを紹介できればと思います。

さて、世の中には何らかのコレクションから条件に一致するものをフィルターする処理がよくあります。
例えば、「ユーザ一覧の中から年齢が一定以上の人のみを表示する」などです。(こういった条件をこれ以降「フィルター条件」と呼びます。)

このようなフィルター条件は一つであれば簡単ですが、複数の条件が組み合わさると少しずつ複雑になっていき自由度が減ってしまいます。
今回はいくつかのフィルター条件を複由自在に組み合わせて新たな合成フィルター条件を作り出すためのデータ構造を紹介します。
簡単な構造ですが自由度を保ちつつ複雑なフィルター条件を実装できるので、参考になれば幸いです。

<!-- TODO: イントロが結構微妙な気がするのであとで直す -->

<!--more-->

## 想定する要件

文章を読みやすくするために、具体例を見せつつ今回やりたいことを説明します。

今回は Twitter API から取得したユーザ一覧データからフィルター条件に一致するユーザーの一覧を返す関数を実装したいです。
ただし、フィルター条件はプログラムの中で静的に記述されるのではなく、**エンドユーザーからのリクエストによって動的に変化**します。
また、エンドユーザーは複数のフィルター条件を AND・OR で組み合わせることができます。
Web 上でエンドユーザが適用したいフィルター条件にチェックボックスをつけるイメージですね。

フィルター条件が動的なため、プログラムでもフィルター条件を動的に生成して扱う必要があります。

```go
// extractFilteredUsers は引数で渡されたユーザの中から条件に一致するユーザのsliceを返す
// TODO: 引数でフィルター条件を渡せるようにする
func extractFilteredUsers(users []twitter.User) []twitter.User {
  // TODO: フィルター条件の扱いを考える
  return users
}
```

## AND や OR も１つのフィルター条件として考えるデータ構造

先述の要件に対して私が書いたのは次のようなコードです。

```go
type FilterCondition interface {
	filter(user twitter.User) bool
}

// NameContainFilter はFilterConditionを実装する構造体
// エンドユーザーが指定できるフィルター条件
type NameContainFilter struct {
	containWord string
}

func (f *NameContainFilter) filter(user twitter.User) bool {
	return strings.Contains(user.Name, f.containWord)
}

type ANDFilter struct {
	left  FilterCondition
	right FilterCondition
}

func (f *ANDFilter) filter(user twitter.User) bool {
	return f.left.filter(user) && f.right.filter(user)
}

type ORFilter struct {
	left  FilterCondition
	right FilterCondition
}

func (f *ORFilter) filter(user twitter.User) bool {
	return f.left.filter(user) || f.right.filter(user)
}

// extractFilteredUsers は引数で渡されたユーザの中から条件に一致するユーザのsliceを返す
func extractFilteredUsers(users []twitter.User, filterCondition FilterCondition) []twitter.User {
	var filtered []twitter.User
	for _, user := range users {
		if filterCondition.filter(user) {
			filtered = append(filtered, user)
		}
	}
	return filtered
}
```

まず、`FilterCondition` としてフィルター条件を表す interface を定義します。
そして、それを実装する形で`NameContainFilter`というフィルター条件を一例として実装しています。

鍵になるのが、`ANDFilter` や `ORFilter` で、これらを同様に `FilterCondition` として実装しています。
このように実装することで、任意の `FilterCondition` を複数合成して、複雑な `FilterCondition` を生成できます。

```go
func TestFilterCondition(t *testing.T) {
	users := []twitter.User{
		{Name: "山田 太郎"},
		{Name: "山田 次郎"},
		{Name: "佐藤 一郎"},
	}

	var filterCondition FilterCondition

	// 名前に「太郎」か「斎藤」が含まれるユーザを抜き出すフィルター条件
	filterCondition = &ORFilter{
		left:  &NameContainFilter{containingWord: "太郎"},
		right: &NameContainFilter{containingWord: "佐藤"},
	}

	expect := []twitter.User{
		{Name: "山田 太郎"},
		{Name: "佐藤 一郎"},
	}

	got := extractFilteredUsers(users, filterCondition)

	if !reflect.DeepEqual(got, expect) {
		t.Errorf("extractFilteredUsers does not matched")
	}
}
```

さらに `ORFilter` や `ANDFilter` も `FilterCondition` を満たしていることから、これらをネストしてさらに複雑なフィルター条件を作ることもできます。

```go
nestedFilter := &ANDFilter{
  left: &ORFilter{
    left:  &NameContainFilter{containingWord: "山田"},
    right: &NameContainFilter{containingWord: "佐藤"},
  },
  right: &ORFilter{
    left:  &NameContainFilter{containingWord: "太郎"},
    right: &NameContainFilter{containingWord: "次郎"},
  },
}
```

このように、AND や OR も含めて統一した interface で扱うことで、柔軟にフィルター条件を動的に生成することができます。

## 二項演算子の AST から着想を得たアイデア

今回の実装は、二項演算子の構文解析における抽象構文木(AST)から着想を得ています。

例えば、Go で AND 式を AST で表すと次のような形になります。

```go
package main

import (
	"fmt"
)

func main() {
	hoge && fuga
}

/*
    56  .  .  .  .  .  .  X: *ast.BinaryExpr {
    57  .  .  .  .  .  .  .  X: *ast.Ident {
    58  .  .  .  .  .  .  .  .  NamePos: foo:8:2
    59  .  .  .  .  .  .  .  .  Name: "hoge"
    60  .  .  .  .  .  .  .  .  Obj: nil
    61  .  .  .  .  .  .  .  }
    62  .  .  .  .  .  .  .  OpPos: foo:8:7
    63  .  .  .  .  .  .  .  Op: &&
    64  .  .  .  .  .  .  .  Y: *ast.Ident {
    65  .  .  .  .  .  .  .  .  NamePos: foo:8:10
    66  .  .  .  .  .  .  .  .  Name: "fuga"
    67  .  .  .  .  .  .  .  .  Obj: nil
    68  .  .  .  .  .  .  .  }
    69  .  .  .  .  .  .  }
   */
```

_https://yuroyoro.github.io/goast-viewer/ を利用しています。_

この例では、`*ast.BinaryExpr` が演算子を表し、`X` と `Y` にそれぞれ `*ast.Ident` が含まれています。
`*ast.BinaryExpr` と `*ast.Ident` は両方とも `ast.Node` インターフェースを満たしています。
この関係性は `FilterCondition` と同じ関係になります。

## おわりに

今回は二項演算子の AST から着想を得たデータ構造を用いて、任意のフィルター条件を自由自在に組み合わせるデータ構造を紹介しました。

このデータ構造をそのまま活かせる状況に出会うことは少ないかと思いますが、「別の用途でよく使われているデータ構造が他の用途でも使えるかもしれない」と思えるきっかけになれば幸いです。

最後になりますが、[DeNA 21 新卒 ×22 新卒内定者 Advent Calendar 2021](https://qiita.com/advent-calendar/2021/dena-21x22)と[DeNA Advent Calendar 2021](https://qiita.com/advent-calendar/2021/dena)はそれぞれ新しい記事がどんどん投稿されていきます。
新着記事の情報は[DeNA 公式 Twitter アカウント @DeNAxTech](https://twitter.com/DeNAxTech)でキャッチできるので、ぜひフォローをお願いします！

それでは、明日以降の記事もお楽しみに！
