---
title: ISUCON10の予選でFAILして学生枠での本戦出場を逃した
date: 2020-09-14T12:00:00+09:00
draft: false
description: Lorseとkm_connerの 3 人で、チーム「釜中の鯖」として ISUCON10 の予選に参加したが、競技終了後の追試に失敗して、学生枠での本戦出場を逃した。負けたとはいえ、ブログを書くまでが ISUCON なので、取り組んだ改善をメモっておく。
categories:
  - 開発
tags:
  - ISUCON
  - Go
share: true
---

こんにちは [@p1ass](https://twitter.com/p1ass) です。

タイトルの通り。[@Lorse](https://twitter.com/LorseKudos)と[@km_conner](https://twitter/com/km_conner)の 3 人で、チーム「釜中の鯖」として ISUCON10 の予選に参加した。結果は競技終了後の追試に失敗して、学生枠での本戦出場を逃した。めっちゃくやしい...。

負けたとはいえ、ブログを書くまでが ISUCON なので、取り組んだ改善をメモっておく。

リポジトリはこれ。

{{<ex-link url="https://github.com/saba-in-the-kettle/isucon10-qualify">}}

<!--more-->

## 事前準備

チームメンバーが決まった後、オンライン勉強会を 3 回、過去問を解く会を 3 回した。最後の過去問を解く会ではかなり良いスコアを記録できてうきうきだった。

また、`Makefile` やスタート直後にやることをまとめたスクリプトを作って簡単に流し込めるようにした。事前準備したものは以下の通り。

- git の初期化
- alp のインストール
- netdata のインストール
- pt-query-digest のインストール
- スロークエリの設定
- デプロイスクリプト
- pprof の設定方法のまとめ

## 改善 (時系列)

俺の入れた改善をメインに、チームメンバーの改善も覚えている限り拾っていく。ポータルのスコア遷移が見れなくなっているので、スコアは後で追記する。

### 12:41 デプロイスクリプトをカスタマイズ

SSH ができるようになったら、簡単にデプロイできるようするためにデプロイスクリプトを書き換えた。

https://github.com/saba-in-the-kettle/isucon10-qualify/commit/e5365f48415613b4c3d8503e6fa367a7aa4b5146

### 12:42 pprof を導入

pprof でプロファイリングを取れるようにした。予定では、pprof 導入後ベンチを回すはずだったが、ポータルが死んでたので諦めた。仕方ないので、Lorse とマニュアルを読んで大事なことをホワイトボードに書いた。

https://github.com/saba-in-the-kettle/isucon10-qualify/commit/5c23b65d28a980a79fe8fcc3c01803498dc9c868

### 13:03 雑に LIMIT 1 をつける

とりあえずつけた。ベンチが死んでるので効果は知らん。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/6

### (他メンバー) App と DB を分離する

最初から App と DB は分離する予定だったのでやってくれた。なんかうまく繋がらなくて困っていたが、いつの間にか解決していた。(すごい)

### 13:52 椅子と不動産の入稿の INSERT を N+1 をなくす

コードを眺めていたら N+1 を発見したので、サクッと直す。`sqlx.In` の存在を忘れていて、string で頑張ってプレースホルダを作っている。syntax error で何度かデプロイしなおした。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/7

### 14:12 JSON の Marshal を[goccy/go-json](https://github.com/goccy/go-json)で行うようにする

pprof を眺めていると JSON のエンコーディングに時間がかかっていることが分かった。Go の JSON ライブラリは遅いので、最速を謳っている goccy/go-json に乗り換えた。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/9

### 14:54 `searchEstateNazotte` 内のループで `NazotteLimit` 件取得できたら break する

alp や pprof を眺めていると全体的に検索 API が遅そうだった。Nazotte は緯度経度を使って不動産を絞り込んでおり、アプリケーション側でイテレーションしてチェックしていた。典型的な N+1 だったのでどうにかしたかったが、MySQL の geo 系はほとんど知らなかったので後回しにして、条件を満たしたらさっさと break するようにした。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/10

### 15:00 (他メンバー) 必要そうなインデックスを貼る

貼ってくれた。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/12

### 15:06:55 検索 API の WHERE 句をすべてつける

検索 API の SQL を改善したかったので、km_conner と方針を相談する。クエリパラメータによって SQL の WHERE 句の条件が変わるので一筋縄ではいかない。alp を見て、数が多いクエリに対してのみ効くインデックスを貼ろうとしたが、「クエリパラメータが存在しないときは必ず true になる条件をつけて、WHERE 句のフィールドを毎回固定にしたら 1 つのインデックスで済むのでは?」というアイデアを出してくれたので、手分けして実装した。実際は Descending Index があるのであまり意味はなかったっぽい。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/11  
https://github.com/saba-in-the-kettle/isucon10-qualify/pull/13

### 15:40 (他メンバー) Bot に対して 503 を返す

当日マニュアルに書いてあった Bot を弾く設定を追加してもらった。Go の正規表現は遅いので、strings パッケージを使って書かれている。多分多くの人は Nginx 側で対処してそうだし、その方が速そう。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/14

### 手詰まりになってきて悩む

これまでの改善でスコアは微増していたが、DB の CPU 負荷を下がられなくて少し手詰まりになってきた。検索 API をどうにかするのがスコアアップの近道だとは分かっていたが、なかなか良いアイデアが出てこない。

SPATIAL INDEX を使えそう！という話が上がってきたが、MySQL8 しか使えなくて断念。事前にアップグレードの練習をしていたら、ここでアップグレードの判断を出来ていたかもしれない。また、features フィールドがコンマ区切りの VARCHAR で入っていて、LIKE で取り出しているのは重そうという話も出たが、いい感じのテーブル設計のアイデアが出てこず、そのまま放置。

少し悩んでいると、km_conner が price や width、height などの範囲は数パターンしか無いことに気づいた。これをテーブルのカラムに追加すればクエリが簡単になるのでは！？となったので実装に入ってもらった。

ついでに再起動試験は 20:00、コードフリーズは 20:30 くらいかな〜って話をしていた。正直悩みすぎてて、僕は話半分で聞いていた。

### 17:11 (他メンバー) 不等号で挟んでいた条件を BETWEEN に変更

BETWEEN の方が良いらしい。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/18

### 18:30 reccomend_estate と low_price をオンメモリでキャッシュする

見た感じオンメモリでキャッシュできそうだなと思ったので、Map を使ってキャッシュを実装した。後に、何回かベンチを回すとたまに FAIL することが分かったので一部 Revert した。
この記事を書きながら原因を考えていたが、initialize のときにキャッシュをクリアしていなかったのが原因っぽい。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/25

### 19:15(他メンバー) range をカラムに追加

16 時くらいから頑張って実装してくれたのだが、思ったより曲者だったらしく何回か Revert した末、19 時を回ってから正常なコードがマージされた。ありがてぇ。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/21  
https://github.com/saba-in-the-kettle/isucon10-qualify/pull/23  
https://github.com/saba-in-the-kettle/isucon10-qualify/pull/24  
https://github.com/saba-in-the-kettle/isucon10-qualify/pull/26

他の参加者のブログを眺めてた感じ、generated column を使うと、実際の値を代入しなくても良い感じに計算結果を保存してくれるっぽい。初耳だった。

### 19:40 DB を垂直分割する

相変わらず DB の負荷が高い。ここで、またしても km_conner がファインプレーで、DB の垂直分割で負荷を減らせるのでは？とアイデアを出してくれた。km_conner に 3 台目のセットアップを頼んで、僕は App 側でコネクションを使い分けるようにした。

これがめっちゃ効いて、スコアが 1000 を超え始めた。確か 1400 くらいまで上がった気がする。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/27

### 20:00 再起動試験をする

残り 1 時間なので再起動試験をする。App 側で DB の立ち上がりを待つコードを書いて、App→DB の順番に立ち上げてもベンチが通るようにした。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/30

このタイミングでリーダボードが凍結された。見たところ一般枠で行くには 2000 を超えないときつそう、学生枠なら 1500 あたりがボーダーだろうなと頭の中で考えてた。

### 20:08 (他メンバー) features が検索のクエリに含まれている場合 time.Sleep をするようにした

なんでか忘れたが、time.Sleep を入れればよくね？って話をしてくれて実装してくれた。スコアが上がった。謎。1500~1600。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/29

### 20:15 (他メンバー) initialize でそれぞれのインスタンスに必要な分だけ SQL を発行するようにする

次に紹介する Nazotte の改善を入れると、initialize が遅くてタイムアウトする問題にあたった。追加で書いた ALTER TABLE が遅いのは分かっていたので、chairs、estates それぞれ必要な分だけ実行するようにした。

### 20:20 色々なログを消す

App のログやスロークエリを全部消した。netdata 等も落とした。

### 20:45 (他メンバーと俺) geometry を使って Nazotte の N+1 を改善

他メンバーが N+1 を改善しようと頑張っていたが、ベンチが落ちるらしい。コードを眺めて見ると、２つほど sqlx の使い方が間違っている箇所がすぐ分かった。時刻はコードフリーズの 20:30 を超えていたが、このとき俺はコードフリーズのことをすっかり忘れていて、これならすぐ直せる！となり、俺の手元でコードを直しはじめた。無事修正が終わり、ベンチを走らすと 1700 を超えたのでここで競技は終了にした。

https://github.com/saba-in-the-kettle/isucon10-qualify/pull/28

## 結果

先に書いたとおり、本戦出場は叶わなかった。1200 台のチームが学生枠で本戦出場しているので、僕らのチームは FAIL した(と思われる)。競技終了後、Nginx のアクセスログを見てみると、競技終了後に叩かれた/initialize がタイムアウトしていた。これが要因で追試に失敗したらしい。

### 原因

App のログを全部消してしまったせいで、推測でしか分からない。

- App 起動 → ベンチ: 成功
- App 起動 →initialize→initialize: 成功

したので、App 起動 → ベンチ → ベンチのパターンだと失敗する説が濃厚そう。後半になればなるほど、App を落とさずベンチを複数回回すのが少なかったので、どっかでバグの混入に気づかなかった。ベンチガチャをしていれば気付けたかもしれないが、「スコア上がったしこれでいいっしょ」となってしなかった。ベンチガチャはスコアのガチャのためだけでなく、バグの発見にも役立つということをすっかり忘れていた。

結果発表は打ち上げの最後の方だったが、発表後はお通夜だった。

## 反省

反省点は多い。リーダとして、コードフリーズはきちんと守るべきだったし、再起動試験ももっとしっかりやるべきだった。自分らのチームのスコアが予想していたボーダーを大幅に超えられておらず、欲が出てしまった。残り 30 分ずっと再起動試験をやっていたら絶対に気付けた。まだまだ詰めが甘かった。

チームメンバーには助けてもらってばっかりだった。スコアにクリティカルに響くアイデアや実装はほとんどチームメンバーが出してくれたし、俺はほとんどスコアに直結することが出来なかった。良いチームメンバーに恵まれてよかった。

## おわりに

ここ最近の問題とは違って、ボトルネックが App ではなく DB にある問題で、非常に学びが多い良い問題でした。運営の皆さん本当にお疲れさまでした。
