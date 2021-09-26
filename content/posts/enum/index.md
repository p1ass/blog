---
title: EnumやUnionの列挙子が増えたときに起こりうる意図しないバグを撲滅したい
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
曜日のように全列挙可能なものから、エラーコードのように本来 string 型として無限の集合だったものを有限の列挙としてアプリケーション側で扱うといったことまで様々な用途で使われます。

これらは if や switch などの条件分岐やパターンマッチングを使って処理を分岐させます。
しかし、これらの処理は列挙子を増えたときに意図しないバグを埋め込んでしまう場合も多いです。
この記事では、Enum と switch を組み合わせたときに起こりうるバグを紹介しつつ、できるだけ静的にバグを発見するための方法を考えていきます。

先に話をまとめると、この記事で伝えたいことは、

- `default` はできるだけ使わないようにする
- `switch` 式や `match` 式があるプログラミング言語は羨ましい
- 上記の構文がない言語では静的解析に頼ろう

になります。

サンプルコードは TypeScript で書いています。

<!--more-->

## 列挙子が増えたときに起こりうるバグ

次のような `DayOfWeek` 型を考えます。

```typescript
type DayOfWeek = 'Sunday' | 'Monday' | 'Thuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturdy'
```

このとき、平日と休日で処理を分岐させるコードは次のようになります。

```typescript
const inputDayOfWeek = 'Wednesday' as DayOfWeek // ここの値が変わる

// if文を使う場合
if (inputDayOfWeek === 'Sunday' || inputDayOfWeek === 'Saturday') {
  console.log('Holiday')
} else {
  console.log('Workday')
}

// switch文を使う場合
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
break 忘れは話が逸れるので今回は考えません。
また、曜日は天変地異でも怒らない限り増えないので、`DayOfWeek` 型の列挙子が増えることもないでしょう。

次に、同様のコードを `ErrorCode` 型に対して適用してみます。

```typescript
type ErrorCode = 'Unknown' | 'InvalidArgument' | 'NotFound'

const inputErrorCode = 'InvalidArgument' as ErrorCode // ここの値が変わる

// if文を使う場合
if (inputErrorCode === 'InvalidArgument' || inputErrorCode === 'NotFound') {
  console.log('4xx error')
} else {
  console.log('5xx error')
}

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

そのため、`ErrorCode` に新しい列挙子が追加されたタイミングで、同時にコードも修正する必要があります。

## 何を当たり前なことを言っているんだ TODO

新しい列挙子が増えたのであれば、その列挙子を使う可能性があるコードを修正しないといけないのは当たり前です。

しかし、**ここで本当に問題なのは `ErrorCode` 列挙子が増えたとしてもコンパイルが成功してしまうこと**にあります。
if 文を使った場合でも switch 文を使った場合でもコンパイルが通ってしまいます。
コンパイルが通ってしまうということは、列挙子の追加に伴うコード変更が必要な箇所を人間が網羅チェックする必要があります。
せっかく列挙型を使っているのに勿体ないです。
修正箇所が少なければ良いですが、修正箇所が多いとそのうち修正を漏らしてしまうことは容易に想像がつくでしょう。

また、こういった修正は GitHub の diff ビューとの相性が悪いです。diff だけではすべての変更が行われたか確認するのが困難で、PR Author を信頼するか、ローカルにチェックアウトして grep や LSP を駆使してチェックしなければなりません。

## 見出し TODO

このままだと人間を信用しないといけないので、なんらかの方法で修正すべきか確認すべきポイントを機械的にチェックできないか考えてみます。

### 想定外の値の場合は例外を吐く

１つ目は取りうる値は全列挙し、`default` は想定外の値の場合に例外を吐くために使う方法です。

```typescript
// if文を使う場合
if (inputErrorCode === 'InvalidArgument' || inputErrorCode === 'NotFound') {
  console.log('4xx error')
} else if (inputErrorCode === 'Unknown') {
  console.log('5xx error')
} else {
  throw new Error('unexpected input error code')
}

// switch文を使う場合
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

Union 型の良いところは全列挙可能なところにあるので、`default` を使わず列挙します。
これにより、`default` の場合は `inputErrorCode` が `never` 型に推論されるので、例外が吐かれることはありません。

`ErrorCode` に新しい列挙子が増えた場合は、`default` に入りうるため例外が吐かれる可能性がでてきます。
このようにすれば、たとえ実装の修正を忘れてリリースされても正しくアラートをセットしていれば気づく可能性が高まります。

しかし、これは予防策ではないので、対策としては微妙です。
できればランタイムではなくコンパイルか静的的に検知したいです。

### 静的解析ツールを用いてチェックする

静的に検出する方法として静的解析ツールが挙げられます。TypeScript では ESLint をのプラグインを用いることで検出が可能です。

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

このように switch 文ですべての列挙子を網羅的にチェックしていない場合、エラーになります。
これにより、CI で機械的に潜在的なバグを検出できます。
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

そのため、できるだけ `default` を使わないようにすると良いでしょう。

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
        _ => println!("5xx error"),
    }
}

// 5xx error
```

### それぞれの比較

まず、共通して言えることはどの場合でも、`default` に相当するものを使っていると、バグとなりうる箇所の検出が難しいです。
String の switch のように全列挙するのができなかったり面倒くさかったりするパターンはありますが、できるだけ使わないようにするほうが良さそうです。

その上で、switch 式や match 式がサポートしている言語を使うか、静的解析ツールを導入するかは使用している言語によるでしょう。

静的解析ツールの場合、出来によって false negative が発生してしまう可能性は否定できませんが、なにもないよりは十分役割を果たしてくれると思います。

## 終わりに

他に良い方法があれば教えて下さい。
