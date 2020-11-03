---
title: "mixiの1dayインターン『git challenge #10』に参加してきました #mixi_git"
date: 2018-12-03T22:45:21+09:00
draft: false
description: mixiが開催したgit challengeというイベントに参加し、普段は学ばないgitの奥深い機能などを知ることができました。
categories:
  - インターン
tags:
  - mixi
  - インターン
  - git
share: true
---

こんにちは、ぷらす([@p1ass](https://twitter.com/p1ass))です。

先日、mixi 本社にて開催された**「git challenge #10」**に参加してきました！
今までこういったイベントには参加したことがなかったのですが、自分の知らないことをたくさん学べる素晴らしいイベントでした。

この記事では、そのイベントの様子などを簡単に紹介していきたいと思います。

<!--more-->

## git challenge とは

「git challenge」とは mixi の新卒研修として行われている git 研修をイベント化したものになります。
git に関連したエラーや問題を解決しながら git について詳しくなろう！という主旨のイベントです。

今回は 10 回記念ということで、**遠方の参加者には交通費を全額支給してくださる神なイベント**となっていました。

## 参加エントリー〜イベント前日

### イベントを知ったきっかけ

git challenge を知ったのは Twitter のタイムラインでイベントの概要が流れてきたのがきっかけでした。

こういった就活と絡めたイベントは B3↑ の人限定という場合も多く、B2 の自分は参加できないということも多いです。
しかし、git challenge は**年齢関係なく申し込める**ということで、概要を読んですぐ申し込みました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">git challenge申し込むわ</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1047059015509921792?ref_src=twsrc%5Etfw">October 2, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">git challenge申し込み完了</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1047091695014227968?ref_src=twsrc%5Etfw">October 2, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

エントリーシートは思いの外、たくさんの項目がありました。
git のイベントということで git の使用経験はもちろん、今までの制作物やその他諸々色々なことを聞かれました。
ありもしないことを書いても仕方ないので、今まで自分がやってきたことをなるべくたくさん書いて応募しました。

### 無事当選

選考結果は申し込んでから一ヶ月後くらいに返ってきて、めでたく参加できることになりました。🎉

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">あ、git challenge通った</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1063249974983450626?ref_src=twsrc%5Etfw">November 16, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

参加が決まってからは、「ちょっとは git の勉強としとかないとなぁ」と思いつつも、時間があまりなくあまり大したことは出来ませんでした。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">git challengeの予習でGit Book/Pro Git読みたいけど、時間ないから行きの新幹線で読もう<br>Git/GitHubレベル別オススメ学習サイトまとめ完全保存版【2018.11】 <a href="https://t.co/pNUPC2NZGe">https://t.co/pNUPC2NZGe</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1067605592435347456?ref_src=twsrc%5Etfw">November 28, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## イベント当日

### 京都 → 東京

自分は京都から参加ということで、**朝 5 時に起きて 7 時の新幹線に乗る**というムーブでした。

新幹線で git の勉強しようと言ってたのにも関わらず、普通に寝落ちしてしまいました。
起きたら神奈川で、時すでにおすし。仕方なくもう一度寝ました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">気づいたら神奈川だった</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1068657196123078657?ref_src=twsrc%5Etfw">December 1, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

なにはともあれ無事 mixi 本社に到着しました。
こういったイベントにあまり参加したことがないため、

**「『オフィス関係者以外立入禁止』と書かれた先にあるエレベーターに乗ってよい」**

という常識(?)がわからなくてエントランスであたふたしてました。

<blockquote class="twitter-tweet"><p lang="und" dir="ltr"><a href="https://t.co/HESx8vDXsV">pic.twitter.com/HESx8vDXsV</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1068681666678337537?ref_src=twsrc%5Etfw">December 1, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### 午前中

イベントの午前中は git challenge の説明と LT が 2 つがありました。

イベントの説明では、「2 人 1 組のチーム対抗で競う」、「難しい問題を解いたほうがたくさんの点がもらえる」、「リモートブランチが壊れたら、前のボタンを押すと直してくれる」といった話がありました。

自分のチームは二人とも「git 完全に理解した」という人間では**なかった**ので、簡単な問題から順番に解いていくことにしました。

### お昼

mixi のイベントでは、お昼ご飯にすごく力をいれてるそうです。

今回は[四谷オーベルジーヌ](http://www.aubergine.co.jp)のカレーでした。🍛

ビーフがすごく美味しかったです 😄

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">上げ忘れた<a href="https://twitter.com/hashtag/mixi_git?src=hash&amp;ref_src=twsrc%5Etfw">#mixi_git</a> <a href="https://t.co/AFLYekxk9g">pic.twitter.com/AFLYekxk9g</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1068719007358808064?ref_src=twsrc%5Etfw">December 1, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### 競技スタート

お昼を食べ終わったら、競技スタートです。

ここが一番大事なところですが、**問題に関しては公表できない**のでさらっと流します。

最初の方の問題はするする解けましたが、後半の問題はかなり難しく、最後の問題に至っては、問題文を読む気すら起きなかったです（）

競技時間の途中には、社員の方々がお菓子を配ってくださったり、飲み物を渡してくれたりしました。
後ろの方に置いてあったみたいですが、みんな問題に集中していて全然取りに行かなかったようで半ば強制に配ってました。

### 解説 & 表彰

そうこうしているうちに 3 時間過ぎて、競技が終了しました。

自分らのチームは、あまり問題が解けず、下から数えた方が早いんじゃないかという順位でした。

解説は、アンケートで得票数が多かったもののみ行う形式でした。
自分がわからなかった問題の解説を聞いて、**「あぁ〜そういうことね、完全に理解した。」**とか**「ﾁｮｯﾄﾅﾆｲｯﾃﾙｶﾜｶﾘﾏｾﾝ」**といった気持ちになってました。

自分の知ってる git のコマンドもあれば、名前すら聞いたことないコマンドもあり、git って奥深いんだなと認識させられました。

解説の後は表彰です。

1 位のチームは、今まで 10 回開催されたイベントで**一度も解かれたことのない問題をパス**してて、圧倒的優勝でした。
mixi の社員さんたちも驚いていて、「世の中すごい学生がいるんだなぁ」と尊敬の眼差しを送っていました。

### 懇親会

イベントの最後は懇親会です。

すごい可愛らしい料理やお酒が並んでおり、イベントの疲れを全部ふっ飛ばしてくれるとても良い会でした！

<blockquote class="twitter-tweet"><p lang="und" dir="ltr"><a href="https://twitter.com/hashtag/mixi_git?src=hash&amp;ref_src=twsrc%5Etfw">#mixi_git</a> <a href="https://t.co/PxBhWM8Lwo">pic.twitter.com/PxBhWM8Lwo</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1068793322225844224?ref_src=twsrc%5Etfw">December 1, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

他のチームの学生ともお話させていただき、「普段は〇〇してる。」とか、「〇〇にインターンに行ってた。」といった話をしながらワイワイしてました。

「自分は B2 だし最年少かな」と思っていたのですが、**普通に 10 代もいて驚きました。**普段地方にいると会えない人達とたくさん話せてとても良かったです。

また、mixi の社員の方々とも色々お話させていただきました。
mixi のサービスの裏側や git challenge の意図、選考の色々など普段は聞けないようなことを教えていただきました。
サービスを運営していく上での心構えや UX のこだわりといった話は、自分がサービス開発していく上でものすごく役に立つ良い話でした。

### 東京 → 京都

楽しかった git challenge ですが、これにて終了です。

帰りは、以前から知り合いだった[@pinf0rt](https://twitter.com/pinf0rt)くんと将来のこととかを色々語りながら新幹線で帰りました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">git challengeの帰り、将来についてとか <a href="https://twitter.com/pinf0rt?ref_src=twsrc%5Etfw">@pinf0rt</a> と無限に話した</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1068868964313260032?ref_src=twsrc%5Etfw">December 1, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## おわりに

いかがだったでしょうか？

git challenge は今回で 10 回目を迎えましたが、またそのうち 11 回目が開催されると思います。

「自分はあんまり git やったことないし」とか考えずに、**「git を学ぶ良い機会」**だと考えて、是非参加してみてください。
きっとこれからエンジニアをやっていく上で、ずっと役に立つスキルを得られると思います。

最後までご覧いただきありがとうございました。
