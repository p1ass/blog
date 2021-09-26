---
title: EnumやUnionの列挙子が増えたときに起こりうる人為的なバグを撲滅したい
date: 2021-09-25T18:00:00+09:00
draft: false
description:
categories:
  - 設計
tags:
  - enum
  - switch
  - パターンマッチング
share: true
---

こんにちは、[@p1ass](https://twitter.com/p1ass) です。

Enum や Union 型は、取りうる値を列挙する上で非常に便利な構文です。
曜日のようなものを全列挙したり、エラーコードのように本来 string 型として無限の集合だったものを有限の列挙としてアプリケーション側で扱ったりと、様々な用途で使われます。

これらの型は if や switch などの条件分岐やパターンマッチングと共に使われることが多いです。
しかし、これらの処理は列挙子を増えたときに意図しないバグを埋め込んでしまうことも多いです。
そこでこの記事では、Enum と switch を組み合わせたときに人為的に起こしうるバグを紹介しつつ、できるだけ静的にバグを発見するための方法を考えていきます。

先に話をまとめると、この記事に書いてあることは、

- `default` はできるだけ使わないようにする
- `switch` 式や `match` 式があるプログラミング言語は羨ましい
- 上記の構文がない言語では静的解析に頼ろう

になります。

サンプルコードは TypeScript と Rust で書いていますが、どの言語でも通用する話だと思っています。

<!--more-->

## 列挙子が増えたときに起こりうるバグ

例として、次のような `Day` 型を考えます。

```typescript
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
```

このとき、平日と休日で処理を分岐させるコードは次のようになります。

```typescript
const inputDayOfWeek = 'Wednesday' as Day // ここの値が変わる

switch (inputDayOfWeek) {
  case 'Sunday':
    console.log('Holiday')
    break
  case 'Saturday':
    console.log('Holiday')
    break
  default:
    console.log('Workday')
    break
}
```

特に変哲もないコードで、違和感ありません。
break 忘れによるバグの可能性もありますが、今回の趣旨とは外れるので今回は考えません。

曜日の数は天変地異でも怒らない限り増えないので、`Day` 型の列挙子が増えることもないでしょう。

次に、同様のコードを `ErrorCode` 型に対して書いてみます。

```typescript
type ErrorCode = 'Unknown' | 'InvalidArgument' | 'NotFound'

const inputErrorCode = 'InvalidArgument' as ErrorCode // ここの値が変わる

// switch文を使う場合
switch (inputErrorCode) {
  case 'InvalidArgument':
    console.log('4xx error')
    break
  case 'NotFound':
    console.log('4xx error')
    break
  default:
    console.log('5xx error')
    break
}
```

このコードも現時点では正しく動作します。

さて、ここで `Unauthenticated` を `ErrorCode` に追加するとどうなるでしょうか。

```typescript
type ErrorCode = 'Unknown' | 'InvalidArgument' | 'NotFound' | 'Unauthenticated'
```

`inputErrorCode` が `Unauthenticated` だった場合、コンソールには `5xx error` が出力されます。
本来、`Unauthenticated` は 4xx 系エラーなので、意図しない挙動になってしまいます。

また、`default` を使っていない場合は、処理を突き抜けてしまいます。

```typescript
switch (inputErrorCode) {
  case 'InvalidArgument':
    console.log('4xx error')
    break
  case 'NotFound':
    console.log('4xx error')
    break
  case 'Unknown':
    console.log('5xx error')
    break
}

// Unauthenticated だった場合は何も出力されない
```

そのため、このような分岐処理を書いている場合は、`ErrorCode` に新しい列挙子が追加されたタイミングで、同時にコードも修正する必要があります。

## 人間が修正箇所を確かめるのは辛い

新しい列挙子が増えたのであれば、その列挙子を使う可能性があるコードを修正しないといけないのは当たり前です。

しかし、**ここで本当に問題なのは、`ErrorCode` 列挙子が増えたとしてもコンパイルが成功してしまうこと**にあります。
この書き方では、列挙子を増やしたとしてもコンパイルが通ってしまいます。
コンパイルが通ってしまうということは、**人間がコード変更が必要な箇所を網羅的にチェックすることになります。**
せっかく列挙型を使っているのに勿体ないです。
修正箇所が少なければ良いですが、修正箇所が多いとミスの可能性が高まるは容易に想像がつくでしょう。

また、こういった修正は GitHub の diff ビューとの相性が悪いです。diff だけではすべての変更が行われたか確認するのが困難で、PR Author を信頼するか、ローカルにチェックアウトして grep やエディターのサポートを駆使してチェックしなければなりません。

## 機械的に仕様へ追従できる方法を考える

このままだと人間を信用しないといけないので、機械的に修正確認ポイントを網羅的にチェックできないか考えてみます。

### `default` を使って想定外の値の場合は例外を吐く

１つ目は取りうる値は全列挙し、`default` を想定外の値の場合に例外を吐くために使う方法です。

```typescript
switch (inputErrorCode) {
  case 'InvalidArgument':
    console.log('4xx error')
    break
  case 'NotFound':
    console.log('4xx error')
    break
  case 'Unknown':
    console.log('5xx error')
    break
  default:
    throw new Error('unexpected input error code')
}
```

取りうる列挙子を `default` を使わず列挙します。
これにより、`default` の場合は `inputErrorCode` が `never` 型に推論されるので、例外に到達することはありません。

`ErrorCode` に新しい列挙子が増えたときは、`default` のコードブロックに入りうるため、例外の可能性がでてきます。
このようにすれば、たとえ実装の修正を忘れてリリースされても、正しくアラートをセットしていれば気づきやすくなります。

しかし、これは予防策ではないので、未然にバグを取り除くことはできません。
対策としては微妙です。
できればランタイムではなく静的に検知したいです。

### 静的解析ツールを用いてチェックする

2 つ目の方法は静的解析ツールを使って静的に検出する方法です。
TypeScript では ESLint のプラグインを用いることで switch のパターンチェック漏れの検出が可能です。

{{<ex-link url="https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/switch-exhaustiveness-check.md">}}

**検出される例 (リンク先より引用)**

```typescript
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

const day = 'Monday' as Day
let result = 0

switch (day) {
  case 'Monday': {
    result = 1
    break
  }
}
```

このように switch 文ですべての列挙子を網羅的にチェックしていない場合、Lint がエラーになります。
これにより、CI で機械的に潜在的なバグになりうる箇所を検出できます。
一方で、`default`を使っていると Lint がパスしてしまうので、今回のような列挙子が増えた場合の検出には使えません。

**パスする例 (リンク先より引用)**

```typescript
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

const day = 'Monday' as Day
let result = 0

switch (day) {
  case 'Monday': {
    result = 1
    break
  }
  default: {
    result = 42
  }
}
```

そのため、この方法を取る場合はできるだけ `default` を使わないようにすると良いでしょう。

なお、同様のツールは Go や Java にもあります。
他の言語でも探せば見つかるかも知れません。

**Go**

{{<ex-link url="https://qiita.com/hogedigo/items/de9a1c53519aedfdc8ae">}}

**Java**

{{<ex-link url="https://errorprone.info/bugpattern/MissingCasesInEnumSwitch">}}

## switch 式や match 式がサポートされているプログラミング言語を使う

元の子もないですが、switch 式や match 式がサポートされているプログラミング言語であれば、列挙子が増えたときにコンパイルエラーにすることが可能です。

例えば、Rust では次のようなコードはコンパイルエラーになります。

```rust
enum ErrorCode {
    Unknown,
    InvalidArgument,
    NotFound,
    Unauthenticated,
}

fn main() {
    let inputErrorCode = ErrorCode::Unknown;

    match inputErrorCode {
        ErrorCode::InvalidArgument => println!("4xx error"),
        ErrorCode::NotFound => println!("4xx error"),
        ErrorCode::Unknown => println!("5xx error"),
        // Unauthenticated に対応するコードがない
    }
}

/*
   Compiling playground v0.0.1 (/playground)
error[E0004]: non-exhaustive patterns: `Unauthenticated` not covered
  --> src/main.rs:11:11
   |
1  | / enum ErrorCode {
2  | |     Unknown,
3  | |     InvalidArgument,
4  | |     NotFound,
5  | |     Unauthenticated,
   | |     --------------- not covered
6  | | }
   | |_- `ErrorCode` defined here
...
11 |       match inputErrorCode {
   |             ^^^^^^^^^^^^^^ pattern `Unauthenticated` not covered
   |
   = help: ensure that all possible cases are being handled, possibly by adding wildcards or more match arms
   = note: the matched value is of type `ErrorCode`
*/
```

文ではなく式である恩恵ですね。
一方で、`_` を使ってしまうとコンパイルが通ってしまうのは他と同様です。

```rust
fn main() {
    let inputErrorCode = ErrorCode::Unknown;

    match inputErrorCode {
        ErrorCode::InvalidArgument => println!("4xx error"),
        ErrorCode::NotFound => println!("4xx error"),
        _ => println!("5xx error"),
    }
}

// 5xx error
```

### それぞれの比較

まず共通して言えることは、どの場合でも `default` に相当するものを使っていると、バグとなりうる箇所の検出が難しいです。
string 型の switch のように、全列挙するのができなかったり面倒くさかったりするパターンもありますが、できるだけ使わないようにする方が良さそうです。

その上で、switch 式や match 式がサポートしている言語を使うか、静的解析ツールを導入するかは使用している言語によるでしょう。
静的解析ツールの場合、出来によって false negative が発生してしまう可能性は否定できませんが、何もないよりは十分役割を果たしてくれると思います。

## 終わりに

皆さんのプロジェクトでは、こういったバグを引き起こさないようにするための工夫をなにかしていますか？
他に良さげな方法があれば教えて下さい。
