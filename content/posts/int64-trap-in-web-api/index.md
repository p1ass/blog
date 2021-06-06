---
title: "Web APIでint64を返すのをやめよう"
date: 2019-10-10T15:00:00+09:00
draft: false
description: 久々にAPIを書いていて罠にハマったのでメモしておきます。 JavaScriptの数値は64ビット倍精度浮動小数点数です。よって、整数の場合は53ビットまでしか扱えないので、APIで53ビットより大きい数値を返すときはStringにしましょう。

categories:
  - 開発
tags:
  - JavaScript
  - JSON
  - API
share: true
---

こんにちは、{{<link href="https://twitter.com/p1ass" text="@p1ass" >}}です。

久々に API を書いていて罠にハマったのでメモしておきます。

### tl;dr

- JavaScript の数値は 64 ビット倍精度浮動小数点数である
- よって、整数の場合は 53 ビットまでしか扱えない
- API で 53 ビットより大きい数値を返すときは String にする

<!--more-->

## 遭遇したバグ

最近個人で開発したMemoito（めもいと）という Web サービスの API を書いているときの出来事です。


Memoito では ID として Twitter 社が開発した{{<link href="https://developer.twitter.com/en/docs/basics/twitter-ids" text="snowflake" >}}を採用しています。

これは、int64 の ID 生成器で、Timestamp と Sequence Number、Machine ID を元に生成されます。実運用上問題のない程度に一意性が担保されている上に、UUID よりも見た目的にスッキリした ID なため、URL に使っても良さそうということで採用しました。

さて、snowflake を使って API を書いたわけなのですが、Vue.js で書かれたクライアントであるデータを GET し、そのデータを加工して PUT すると、何故か違う ID となって PUT されサーバが 500 返すというバグが発生しました。

## 原因

原因は JavaScript の数値型は 64 ビット倍精度浮動小数点数であり、整数値は 53 ビット分までしか正しい値にならないのが原因でした。

Developer Console を眺めていると、最初の方の桁は合っているのに最後の方が 0 で丸められているので、すぐ気が付きました。

## 対応

そのまま int64 で値を返すわけには行かないので、API 側で string にして返すようにしました。

![nya-n.png](nya-n.png)
_誤差が見える_

## まとめ

53 ビットを超える整数値を返す機会はないので、なかなか気が付きにくいと思います。

int64 を返すときは気をつけましょう。

{{<twitter url="https://twitter.com/p1ass/status/1177964450554400770" >}}
