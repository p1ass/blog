---
title: "Cyber Agentのインターン「Architecture Challenge」に参加してきた"
date: 2019-02-18T22:42:07+09:00
draft: true
tags:
- Cyber Agent
- インターン
---

[f:id:plus_kyoto:20190322222914j:plain]

こんにちは、ぷらす([@plus_kyoto](https://twitter.com/plus_kyoto))です。

この度、Cyber Agentさんが開催された**「Architecture Challenge」**というイベントに参加させていただきました！

{{< ex-link url="https://www.cyberagent.co.jp/careers/students/event/detail/id=22634" >}}


個人開発をしていると、しっかりと考えることのないアーキテクチャについて考えることができる2日間となりました。

<!--more-->

## 概要
今回のインターンのテーマは**「架空のサービスのチャット機能部分のアーキテクチャを考える」**というものでした。

<figure class="figure-image figure-image-fotolife" title="お題">[f:id:plus_kyoto:20190215173807p:plain]<figcaption>お題</figcaption></figure>

<figure class="figure-image figure-image-fotolife" title="評価基準">[f:id:plus_kyoto:20190215174244p:plain]<figcaption>評価基準</figcaption></figure>

**他にもめっちゃ細かい仕様書が渡された**のですが、ここで全部紹介するのはしんどいので省略します。

簡単なチャットサーバーは組んだことがあったのですが、スケールできる構成を考えたことがなかったので、どう構成するかかなり悩みました。

また、今回はコードを一切書かないイベントでした。スケールできる構成を考えないといけないにも関わらず、**その計測ができない**ので、ネットに転がっている情報を元に考える必要がありました。

## 作ったもの
今回は成果物として、ER図とアーキテクチャ図を作りました。

<figure class="figure-image figure-image-fotolife" title="ER図">[f:id:plus_kyoto:20190217124908p:plain]<figcaption>ER図</figcaption></figure>

<figure class="figure-image figure-image-fotolife" title="アーキテクチャ図">[f:id:plus_kyoto:20190217124826j:plain]<figcaption>アーキテクチャ図</figcaption></figure>

自分は主にアーキテクチャの方を担当したのですが、今思うと怪しいところが多かったなと反省しています。

- gRPCのロードバランスの難しさ
- L7LBとL4LBの違い

このあたりは、フワッとした知識しか持っていなかったので、かなり適当になってしまいました。

しかし、同時に多くのことを学ぶことができました。
特に、**Redis**は使ったことがなく、ほとんど知識がなかったのですが、しっかり調査することができました。**RedisにPubSub機能がある**と知れたのは良かったです。

## GraphQL SubscriptionsとRedis PubSubを使ったリアルタイムチャットサーバー

インターン中は実際にコードを書くことが出来なかったので、後日**GraphQL Subscriptions**と**Redis PubSub**を使ったリアルタイムチャットサーバーを作ってみました。


{{< ex-link url="https://github.com/naoki-kishi/graphql-redis-realtime-chat" >}}

解説記事をQiitaに書いてのでよかったら読んでみてください。

{{< ex-link url="https://qiita.com/plus_kyoto/items/462209fe73ece1238d85" >}}

## おわりに

インターンが始まる前はどうなるかなと思っていたのですが、終わってみると**参加してよかった**という気持ちになりました。
これからも強いエンジニア目指して頑張っていきます！

最後までご覧いただき、ありがとうございました。

<figure class="figure-image figure-image-fotolife" title="お弁当">[f:id:plus_kyoto:20190322225333j:plain]<figcaption>お弁当</figcaption></figure>

<figure class="figure-image figure-image-fotolife" title="お弁当 その2">[f:id:plus_kyoto:20190322225303j:plain]<figcaption>お弁当 その2</figcaption></figure>


<figure class="figure-image figure-image-fotolife" title="お肉">[f:id:plus_kyoto:20190322225236j:plain]<figcaption>お肉</figcaption></figure>
