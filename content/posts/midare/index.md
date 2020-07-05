---
title: "Twitterトレンド１位になった個人開発Webアプリの負荷対応記録"
date: 2020-07-05T18:00:00+09:00
draft: false
description:
categories:
  - Webサービス
tags:
  - Go
eyecatch: /posts/pointer-of-for-range-loop-of-go/ogp.jpg
share: true
---

こんにちは、{{< link href="https://twitter.com/p1ass" text="@p1ass" >}}です。

この記事は、LT 会のために作った Web アプリがバズって **Twitter トレンド 1 位** になってしまい、ひぃひぃ言いながら行った負荷対応をまとめたものになります。
スケーラビリティは全く考慮していない LT 会用の雑な Web アプリをどのように改善していたのかについてまとめることで、個人開発者の参考になれば良いなと思っています。

なお、ここで書かれている内容はプロダクションレディなサービスを作る上では当たり前なことが多数です。本当の高負荷トラフィックを裁くための知見はないので、予めご了承ください。

<!--more-->

## 作った Web アプリ: 「生活習慣の乱れを可視化するやつ」

最初に作った Web アプリを紹介しておきます。「生活習慣の乱れを可視化するやつ」という Web アプリを作りました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">ツイートを分析して生活習慣の乱れを可視化するツイ廃向けのWebアプリを作りました！<br>Twitter連携で簡単に起床・就寝時間が分かり、どんどん生活習慣が乱れていく様子を見ることができます。<br><br>左の画像は規則正しい人、右の画像は生活習慣が乱れている人のグラフです ⏰<a href="https://t.co/5f7xlh7X6J">https://t.co/5f7xlh7X6J</a> <a href="https://t.co/6YNo02VATv">pic.twitter.com/6YNo02VATv</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1267413338016804864?ref_src=twsrc%5Etfw">June 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

このアプリは Twitter OAuth を使ってツイートを解析し、カレンダー UI で直感的に起きている時間を把握することが出来るアプリです。本来は生活習慣の乱れを可視化するために作ったのですが、実態としては **「ツイ廃可視化アプリ」** なので、多くの人が Twitter ばっか開いている現実を突きつけられたようです。

また、いくつかのネットメディアにも掲載していただきました。

{{< block-link href="https://nlab.itmedia.co.jp/nl/articles/2006/03/news042.html" text="ツイート時刻から「生活習慣の乱れ」を可視化してくれるアプリが登場　「ツイ廃判定アプリ」「なんて恐ろしいものを」 - ねとらぼ" >}}

{{< block-link href="https://internet.watch.impress.co.jp/docs/yajiuma/1257035.html" text="ツイ廃ぶりが一目瞭然！ 過去のツイートを分析して「生活の乱れを可視化」するアプリ【やじうま Watch】 - INTERNET Watch" >}}

ソースコードは GitHub で全て公開してあるので、興味のある方は是非ご覧ください。Go x React で書いてます。

{{< ex-link url="https://github.com/p1ass/midare" >}}

## 負荷対応記録

さて、ここからが本題になります。ここでは。サービス公開から Twitter トレンド 1 位になるまでに行った対応を時系列で紹介していきます。

### 20:00 LT 会に登壇する

冒頭で書いたとおり、このアプリは LT 会のために作ったものです。友人の誕生日会 LT でこのアプリに関する登壇をしました。

<script async class="speakerdeck-embed" data-id="5cd86d0c3c6642c0aa5d45330c80d324" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

### 20:30 LT 会を聞きつつアナリティクスを見たら、アクティブユーザが結構いてビビる

無事登壇も終了し、のんきに酒を飲みながら LT 会を聞いていたのですが、ふと気になり Google Analytics を開いたら、アクティブユーザが 100 人を超えていてビビります。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">ワロタ <a href="https://t.co/YRj4pXIqqN">pic.twitter.com/YRj4pXIqqN</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1267418549745664003?ref_src=twsrc%5Etfw">June 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

また、このあたりで RT 数が 100 を超え始め、ちょっと焦り始めます。

この 30 分後にはアクティブユーザが 400 人を超えました。

![Google Analytics](google-analytics.png)

### 21:00 VPS の Grafana のアラートがなる

そうこうしているうちに API サーバを立てている VPS のアラートがなり始めました。

![Grafana Alert](grafana-alert.png)
_プロセスがリスポーンを繰り返している様子 (上)CPU 使用率 (下)メモリ使用率_

ここで、この時点におけるインフラアーキテクチャについて軽く説明しておきます。フロントエンドは Netlify でホスティング、API サーバは ConoHa の VPS(CPU1 コア、メモリ 512MB)を利用してしました。また、API サーバは Docker で立ち上げていました。フロントエンドが落ちる心配はないが、API はすぐ落ちてしまう可能性があるという状況でした。

また、LT 会用に作った雑実装で**ログインセッションをオンメモリで持っていたため、スケールアウトすることは出来ません。**

このタイミングで、今より性能の良いインスタンスをすぐ使えるクラウドに移行し、その後にスケールアウトに対応できるようにアプリケーションコードを書き換えることを決意しました。

### 21:10 Cloud Run に移行を始める

クラウドに移行すると決めたので、どのサービスを使うか検討を始めます。

まず、クラウドベンダは日常的に使い慣れている GCP にすることにしました。次にどのサービスを利用するか考えるのですが、VPS で動かしていることを考えると GCE が 1 番簡単です。しかし、スケーラブルなアーキテクチャを作るには時間がかかると判断し、GCE は断念しました。その他のいくつかのマネージドサービスを検討したのですが、

- 簡単にスケールアウトができる
- Docker イメージをそのまま使える
- 業務で使っている

という理由から、**Cloud Run** を使うことにしました。

GCP には、フルマネージド型のコンピューティング プラットフォームとして GAE もありますが、GAE 用のコンフィグを準備やローカル開発サーバの準備に時間がかかります。1 分でも早く移行したいと考え、今回は選択しませんでした。

なお、先程書いた通りスケールアウトはできないので、現時点では最大インスタンス数を 1 に設定してバグらないようにします。一旦スペックの高いインスタンスを使ってリクエスト捌き、その間にスケールアウトできる構成にアプリケーションを書き換える戦略です。

### 補足: Cloud Run の最小インスタンス数について

知っている方は知っているかと思いますが、**Cloud Run の最小インスタンス数は 0 です。つまり、コンテナが全て止まる可能性があります。** 全てのコンテナが止まるとオンメモリで持っているログインセッション情報が全て飛ぶので、ログインセッションを維持できなくなる可能性があります。

しかし、現状のリクエスト数を見る限り、インスタンス数が 0 になることはないだろうと考え、リクエストが落ち着く前に、ログインセッションの保持を API サーバから切り離すことにしました。

### 22:00 Cloud Run への移行が完了する

一時間弱で Cloud Run への移行が完了しました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">爆速でVPSからCloud Runに移行した <a href="https://t.co/KeMb9OWTIH">https://t.co/KeMb9OWTIH</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1267441450754568192?ref_src=twsrc%5Etfw">June 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

![Cloud Runのメトリクス](cloud-run-metrics.png)
_移行直後のメトリクス_

### 22:20 ツイート情報のキャッシュの Expire を短くする

移行直後のメトリクスを見ればわかるように、メモリ使用率がどんどん上昇しています。これはツイート情報をオンメモリでキャッシュしているのが要因です。

起きている時間を返す API は、レスポンスが遅い(1 リクエストで数百 ms かかる)Twitter API を直列で複数回叩く必要があるため、**API 全体では 1~2 秒ほどかかります。** そんな API をブラウザをリロードするたびにコールするのは辛いです。そこで、ツイート情報をオンメモリでキャッシュし、 30 分間は何回 API をコールしても同じレスポンスを返すようにしていました。[^1]

[^1]: 30 分はカレンダーの時間分解能

しかし、このままだとサービスのユーザ数が多くなればなるほどメモリを圧迫し、メモリを食い尽くす可能性がありました。

Google Analytics を見ると平均セッション維持時間は数分であり、30 分もキャッシュしておく必要がなさそうだったので、キャッシュの Expire を 10 分まで短くし、なるべくメモリを開放するようにしました。

![キャッシュのExpire時間変更後のメトリクス](after-change-cache-expired-duration.png)
_メモリ使用率 (後に Expire を 5 分ごとに行うようにした)_

## 22:20 アクティブユーザが 2000 人を超える

キャッシュの実装が終わったころには、アクティブユーザが 2000 人を超えていました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">いやそれは無いやろwwww <a href="https://t.co/sitWe3r5vE">pic.twitter.com/sitWe3r5vE</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1267446250904772609?ref_src=twsrc%5Etfw">June 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

色々メトリクスを調べてみると、API レスポンスが非常に遅くなっていて、レスポンス待ちのユーザが多く発生したため、アクティブユーザが多くなっていたようです。

### 22:30 Twitter API の Rate Limit にあたる

サーバが死にました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">あ、サーバ死んだ</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1267449807678795776?ref_src=twsrc%5Etfw">June 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

原因は Twitter API の Rate Limit でした。Twitter API の User Timeline を取得する API はアプリ 1 つにつき 100,000 リクエスト/日という制限があり、これに引っかかってしまいました。

> Important notice: On June 19, 2019, we began enforcing a limit of 100,000 requests per day to the /statuses/user_timeline endpoint, in addition to existing user-level and app-level rate limits. This limit is applied on a per-application basis, meaning that a single developer app can make up to 100,000 calls during any single 24-hour period.

{{<block-link href="https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline">}}

応急処置として新たに Twitter アプリを作成し、トークンを差し替えることにしました。

**注意及び免責**

**当時は知りませんでしたが、同一のソフトウェアで複数の Twitter アプリを作成することは禁止されています。この制限に気づいてから複数の Twitter アプリを利用するのはやめ、現在は 1 つの Twitter アプリのみを利用しています。この記事を読んだ読者が複数の Twitter アプリを使用したとしても、一切の責任を負いません。**

> You may not register multiple applications for a single use case or substantially similar or overlapping use cases. In this context, a “use case” is a consistent set of analyses, displays, or actions performed via an application. Please note that providing the same service or application to different people (including “white label” versions of a tool or service) counts as a single use case.

{{<block-link href="https://developer.twitter.com/en/developer-terms/policy">}}

### 23:05 ログインセッションを Redis に移す

API サーバのスケールアウトを可能にするために、ログインセッションを保存するための Redis 用のインスタンスを一台立ち上げました。これにより、API サーバのスケールアウトが可能になりました。

### 23:20 ログイン処理がバグってることに気づく

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">夜ご飯食べてないので買いに行く<br><br>TLのみんな一回試してみてだめだったらリプちょーだい</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1267460825255563266?ref_src=twsrc%5Etfw">June 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

コンビニから返ってきたら、ログイン処理がおかしいという報告が来ていました。調査してみると、Redis に移すべきオンメモリの情報を移し忘れていました。そのため、ログインが 1/n の確率で成功する状態になっていました 😇

このバグ修正のデプロイが終わったところには日付が回っていました。

### 24:30 Cloud Monitoring のアラート設定を沢山する

寝ても大丈夫なように色々なアラートをガンガン設定しました。

### 25:00 Twitter トレンド１位になる

プリコネ[^2]や #cheeruphanabi を抑えて Twitter トレンド 1 位になりました 🎉

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">トレンド1位らしいです！<br>ありがとうございます🙏 <a href="https://t.co/PtZjehBABA">pic.twitter.com/PtZjehBABA</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1267488254334398470?ref_src=twsrc%5Etfw">June 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

[^2]: コッコロたん〜〜〜

### 深夜 色々微調整を行う

キャッシュの間隔や細かいバグつぶしなどを沢山しました。

### 29:00 (朝の 5 時) 寝る

これにて当日の対応は終了です。寝ました。

## 最終的なリクエスト数

リリース日の PV は 11 万、次の日は 30 万でした。その後は指数関数的に減っていき、今では最大リクエスト数の 1%もありません。

![最終的なリクエスト数](request.png)

## 急な負荷対応をしてみて思ったこと

当たり前ですが、**「最初からスケーラブルな設計にしておく」** ことはとても大事です。少なくともログインセッションを最初から Redis や MySQL に持っていたら、もっと対応は楽だったでしょう。個人開発だからと手を抜くと痛い目に会います。

また、**「テストを書いていなかったこと」** を非常に後悔しています。普段はテストを書くことが当たり前なのですが、今回は書いていませんでした。負荷対応で焦ってコードを直しているとバグを埋め込みがちでデバッグにとても苦労しました。デバッグしながら、「あぁ、なんで俺はテストを書かなかったんだ...」とぼやいていました。

## まとめ

今回の対応で **「当たり前のことを当たり前にやる」ことの重要性** を痛感しました。当たり前のことをやった上での障害は仕方ないですが、当たり前のことをしていないマイナスの状態からの対応は結構苦痛でした。今回は趣味開発だったので良かったですが、これが仕事だと思うとゾッとします。これからは趣味でも当たり前のことを当たり前にやっていきたいです。

以上になります。最後までお読みいただきありがとうございました。この記事が皆さんに役に立てば幸いです。

## P.S.

この対応で僕の生活習慣が乱れました。どうしてくれるんですか？？

## おまけ

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">はい <a href="https://t.co/Zwkzcch7fs">https://t.co/Zwkzcch7fs</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1267430794739412998?ref_src=twsrc%5Etfw">June 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">落としたサーバの数だけ強くなれる</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1267498932776517634?ref_src=twsrc%5Etfw">June 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
