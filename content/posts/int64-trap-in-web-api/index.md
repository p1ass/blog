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

こんにちは、{{< link href="https://twitter.com/p1ass" text="@p1ass" >}}です。  

久々にAPIを書いていて罠にハマったのでメモしておきます。

### tl;dr

- JavaScriptの数値は64ビット倍精度浮動小数点数である
- よって、整数の場合は53ビットまでしか扱えない
- APIで53ビットより大きい数値を返すときはStringにする

<!--more-->

## 遭遇したバグ

最近個人で開発した{{< link href="https://memoito.com" text="Memoito（めもいと）" >}}というWebサービスのAPIを書いているときの出来事です。

{{< ex-link url="https://memoito.com" >}}

MemoitoではIDとしてTwitter社が開発した{{< link href="https://developer.twitter.com/en/docs/basics/twitter-ids" text="snowflake" >}}を採用しています。

これは、int64のID生成器で、TimestampとSequence Number、Machine IDを元に生成されます。実運用上問題のない程度に一意性が担保されている上に、UUIDよりも見た目的にスッキリしたIDなため、URLに使っても良さそうということで採用しました。

さて、snowflakeを使ってAPIを書いたわけなのですが、Vue.jsで書かれたクライアントであるデータをGETし、そのデータを加工してPUTすると、何故か違うIDとなってPUTされサーバが500返すというバグが発生しました。

## 原因

原因はJavaScriptの数値型は64ビット倍精度浮動小数点数であり、整数値は53ビット分までしか正しい値にならないのが原因でした。

Developer Consoleを眺めていると、最初の方の桁は合っているのに最後の方が0で丸められているので、すぐ気が付きました。

## 対応

そのままint64で値を返すわけには行かないので、API側でstringにして返すようにしました。

![nya-n.png](nya-n.png)
_誤差が見える_

## まとめ

53ビットを超える整数値を返す機会はないので、なかなか気が付きにくいと思います。

int64を返すときは気をつけましょう。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">ええええJavaScriptって整数のint64に対応してないのかよ</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1177964450554400770?ref_src=twsrc%5Etfw">September 28, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
