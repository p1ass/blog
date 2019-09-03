---
title: "CyberAgentのAbemaTVでインターンしてきた話"
date: 2019-09-03T20:00:00+09:00
draft: false
description: 3週間ほどCyberAgentのAbemaTVというサービスでインターンをしてきました。Goを使った開発を行い、メモリリークやDBのセッションの持ち方、goroutine内でpanicが起きた時の対処など、今まで考えたことがなかったことを多く学ぶことができました。
categories:
- インターン
tags:
- CyberAgent
- AbemaTV
- Go
- MongoDB
eyecatch: /posts/abema-intern/ogp.jpg
share: true
---

こんにちは、{{< link href="https://twitter.com/p1ass" text="@p1ass" >}}です。  

前々からTwitterを見てくれていた人はわかるかもしれませんが、3週間ほどCyberAgentのAbemaTVというサービスでインターンをしてきました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">わーい <a href="https://t.co/fXrMXW9e9i">pic.twitter.com/fXrMXW9e9i</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1158995483240439808?ref_src=twsrc%5Etfw">August 7, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<!--more-->

## AbemaTVでインターンした理由

CyberAgentは沢山の子会社を持っていて様々なサービスを提供しているのですが、その中でもAbemaTVに行きたいと思った決め手は、

- 自分が使っているサービスである
- 大規模なサービスである
- 技術スタックが合っている

の3つでした。

いまいちドメイン知識がないサービスでインターンするよりも学びが多いと思いましたし、絶対に落とせない大規模なサービスを作る環境に身を置くことで、品質の高いコードを書けるようになれるのではという思いがありました。

そのため、**「サイバーに行くならAbemaTVしか有り得ない」**というレベルでAbemaTVに行きたいと考えてました（そして実際に行くことができました）。

## AbemaTVでしたこと

自分はプロダクト開発チームというユーザー側・管理側両方のAPIなどを担当するチームに配属されました。

![チーム図](team.png)

{{< block-link href="https://speakerdeck.com/miyukki/the-challenge-and-anguish-of-abematv-celebrating-the-third-anniversary?slide=12" text="3周年に突入するAbemaTVの挑戦と苦悩 / The challenge and anguish of AbemaTV celebrating the third anniversary より" >}}  

自分はその部署で、運用側からの要望を聞いて、仕様や設計を考え、実際に実装をするという一連の流れを丸っと行いました。

詳しいことを書いて良いのか分からないのでふわっとした感じで言うと、「SNSから番組への流入を増やしたい。今のメタデータだけでは不便なので、自由度高く設定できないか？」という感じの内容でした。

これだけ聞くと簡単に思えるかも知れませんが、番組情報はAbemaTVのコアとなる部分で、様々なマイクロサービスやクライアントから使われています。そのため、後方互換性を保ちながら新しいデータ構造に移行していく必要があり、さくっとフィールドを修正して終わりではないタスクでした。

タスクで行った作業のうち、特に印象に残っているのはDBのデータ移行です。
AbemaTVではMongoDBをメインのデータベースとして使っているのですが、今回のタスクに伴い旧フィールドのデータを新フィールドへコピーする必要がありました。最初はmongo shell上で移行のコマンドを叩こうとしたのですが、データ数が多く、全てのデータを移行するのは**数十時間**かかる見込みでした。流石にこれだけの時間をかけてやるのはしんどいということで、bulk updateでデータを移行するスクリプトを書いたところ、**10分程度**で完了することができました。冪等性を担保する書き方など、とても学びが多い作業でした。


他にも、メモリリークやDBのセッションの持ち方、goroutine内でpanicが起きた時の対処など、今まで考えたことがなかったことを多く学ぶことができました。

また、最後の3日間では5つのgRPCのrpcと5つのJSON APIを設計・実装して、それに関連するDB処理や負荷対策のためのキャッシュの実装、APIドキュメントなどを爆速で終わらせました。3日間で出したPRの合計additionsは2000行を超えてた気がするので、我ながらよく頑張ったなと思ってます。送別会に行く5分前までdev環境で検証していたのはいい思い出です。


## インターンの待遇とか

### 宿

会社が持っているシェアハウスに住まわせていただきました。リビングやキッチンなどは共用ですが、1人ごとの個室はちゃんとあるので、プライベートの空間はちゃんとあります。Abema Towersまでも徒歩5分くらいので、ギリギリまで寝てられます。

ただ、9月末でシェアハウスはなくなってしまうので、今後はどうなるか分からないです。

### ご飯

朝と夜は自分でなんとかしていましたが、ランチに関してはほとんど社員の方々に連れて行ってもらいました。

チームランチや人事主催のシャッフルランチなど、色んな方と交流する機会があり、ただ働いているだけでは分からない他の部署の話を聞くことができました。

自分の財布を開けたことが片手で数えても余るくらいの回数しかなかったので、本当に感謝です🙏

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">お寿司美味しかったです🍣 <a href="https://t.co/2H7sZ5IYRo">pic.twitter.com/2H7sZ5IYRo</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1161139585306415104?ref_src=twsrc%5Etfw">August 13, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">焼肉美味しかった <a href="https://t.co/eDwhhFt0rT">pic.twitter.com/eDwhhFt0rT</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1162215621569830913?ref_src=twsrc%5Etfw">August 16, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### 報酬

時給は1500円です。すごい高いわけじゃないですが、一般的(?)な価格帯だと思います。
宿を自分で払う必要がなく、ランチも実質無料だと考えたら十分です。

ちなみに、定時は10時~19時で休憩1時間です。インターンでは珍しいかも知れませんが、残業が出来て、ちゃんと割増賃金が出ます。
自分は8時間以上働いてもパフォーマンスが出ないことが分かりきっていたので、ほとんど定時で帰っていました。


## 少し気になったところ

インターンの途中にあった面談では、「困ったことは特にありません！」と言っていたのですが、改めて考えてみて思いついたことを書いておきます。

### モニターが4Kじゃない

これは自分が貰ったモニターがたまたま4Kじゃなかっただけかもしれませんが、文字の見やすさなどが段違いなので、できたら使いたかったです。

### シェアハウスのwifiが弱い

これは本当に致命的です。シェアハウスでAbemaTVを見るのが難しかったです（）


### 渋谷人が多い問題

もうCyberAgent関係ないんですが、なんであんなに人が多くて臭い土地にIT企業が集まるんですかね？？

東京にはもっと良い場所はないんですか？

## まとめ

長々と書きましたが、AbemaTVのインターンを通して多くのことを学ぶことができて、本当に満足しています。

トレーナーさんを始め、皆さん本当にお世話になりました🙏

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">遅くなりましたが、昨日AbemaTVのインターンを修了しました〜<br><br>3週間という短い間でしたが、大規模なサービスを作っていくにあたっての様々な知識を得ることができました！<br><br>トレーナーさんを始め、皆さん本当にお世話になりました🙏<a href="https://twitter.com/hashtag/CATechJob?src=hash&amp;ref_src=twsrc%5Etfw">#CATechJob</a> <a href="https://t.co/t34foCxdhX">pic.twitter.com/t34foCxdhX</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1167772325992792066?ref_src=twsrc%5Etfw">August 31, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

{{< ex-link url="https://www.cyberagent.co.jp/careers/students/event/detail/id=23258" >}}

## おまけ

深夜のラブホ街のど真ん中に集まるオタク

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Virtual Realityエモかった <a href="https://t.co/eY3T9kh5kL">pic.twitter.com/eY3T9kh5kL</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1168541938317840384?ref_src=twsrc%5Etfw">September 2, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

初夏フェス

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">サマソニ！！ <a href="https://t.co/IeEbxQR55n">pic.twitter.com/IeEbxQR55n</a></p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1162898390188822528?ref_src=twsrc%5Etfw">August 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
