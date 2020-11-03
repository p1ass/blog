---
title: "[Go] スライスのfor rangeループ内で新しいスライスにappendしたらバグらせた"
date: 2020-06-11T20:00:00+09:00
draft: false
description: Goのfor rangeループのvalueは常に同じアドレス値を取る。ループ内で変数を定義することで新しいアドレスの変数が使われるようになるので、期待した出力になる。なお、これの挙動はスライスだけでなく、マップでも発生する。
categories:
- 開発
tags:
- Go
share: true
---
  
久々にポインタ関連でバグらせてしまったので、自戒のためにメモしておく。

### tl;dr

- for rangeループのvalueは常に同じアドレス値を取る。

<!--more-->

## バグらせた実装

あるスライスから特定の条件を満たす値だけを抽出した新しいスライスを作ろうをして以下のようなコードを書いた。

```go
type User struct {
	id int
}

func filter(users []User) []*User{
	var filtered []*User

	for _, v := range users {
		if v.id % 2 == 0{
			filtered = append(filtered, &v)
		}
    }
    return users
}
```

このコードを実行したとき `filtered` のスライスはどのような値になるだろうか？

結果はこのようになる。

```go
users := []User{{1}, {2}, {3}, {4}}
filtered := filter(users)
for _, f := range filtered {
    fmt.Printf("%v\n",f)
}
    
// 出力
// &{4}
// &{4}
```

`id` が2と4のUserがappendされていることを期待していたが、実際は4が2つappendされている。

## 原因

appendされる `v` のポインタを出力してみると原因が分かる。

```go
for _, v := range users {
    fmt.Printf("%p\n",&v)
    if v.id % 2 == 0{
        filtered = append(filtered, &v)
    }
}

// 出力
// 0xc000100068
// 0xc000100068
// 0xc000100068
// 0xc000100068
// &{4}
// &{4}
```

ご覧の通り、各ループにおける `v` のポインタ値が不変である。`users` の型は `[]User` だが、`filtered` の型は `[]*User` なので、`v`をポインタにしてからappendした結果、このような出力になってしまった。

普段は引数と返り値の型は一致されることが多いが、今回は他のコードとの整合性を保つために型を変更する関数を書いた結果ハマってしまった。

## 対策

for rangeループ内で `v` を再度変数に代入すれば良い。

```go
var filtered []*User

for _, _v := range users{
    v := _v
    fmt.Printf("%p\n",&v)
    if v.id % 2 == 0{
        filtered = append(filtered, &v)
    }
}

for _, f := range filtered {
    fmt.Printf("%v\n",f)
}

// 出力
// 0xc00002c0a8
// 0xc00002c0b0
// 0xc00002c0b8
// 0xc00002c0c0
// &{2}
// &{4}
```

ループ内で変数を定義することで新しいアドレスの変数が使われるようになるので、期待した出力になる。

なお、これの挙動はスライスだけでなく、マップでも発生する。再現用のコードはこちらに用意してある。

{{< ex-link url="https://play.golang.org/p/S7otaqYUaXW" >}}

## 終わりに

goroutineとforループの話は知っていたが、この挙動は初めて踏んだ。よくよく考えれば当たり前なのだが、特に注意してなかったので発見に手間取ってしまった。

ポインタを使うときは注意して実装していきたい。
