---
title: 「データ指向アプリケーションデザイン」を読んだ
date: 2021-08-12T15:00:00+09:00
draft: false
description: TODO
categories:
  - 読書
tags:
  - 設計
  - データベース
  - インフラ
share: true
---

こんにちは、[@p1ass](https://twitter.com/p1ass) です。

先日、ずっと積んであった「[データ指向アプリケーションデザイン](https://amzn.to/3CJtg5C)」を読み終わりました。
書籍自体は一年半以上前に頂いていたのですが、当時の自分には難しい内容でずっと放り投げていました。
しかし、最近になって本書のサブタイトルにもある **「信頼性、拡張性、保守性の高い分散システム設計」** に対する興味が増したので改めて読んでみることにしました。
今回は興味も相まって最後まで読み切れたので、忘れないうちに軽く本書を読んだ感想を書いておこうと思います。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=p1ass02-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4873118700&linkId=133ac6c450fafcea92e459c6cb4262d1"></iframe>

<!--more-->

## 「点」と「点」が繋がる感覚を覚える本

詳しい内容や目次は[公式ページ](https://www.oreilly.co.jp/books/9784873118703/)に譲りますが、本書では「データ指向」なシステムにおける原理やトレードオフについて解説されています。
そして、それらの解説はシステムがどのように動作しているか (HOW) だけでなく、**なぜそのような動作になっているか (WHY) まで説明**されています。
この特徴はまさに私がちょうど知りたかった内容であり、新たな知識を与えてくれるものでした。

バックエンドエンジニアとしてシステムの開発に携わっていると、自ずと本書で解説されているようなデータベースやミドルウェアに触れたり調べたり機会がやってきます。
しかし、このような機会で知れる内容は往々にして、何ができるか/何ができないか、という機能の面に限られていました。
この要因はただ単に私の怠惰で、「機能を実装するのに必要なことだけしれたら良い」と考えていたからです。

かい摘んで得られた知識だけでも、小規模でデータ量が少ないシンプルなアプリケーションであればそこまで苦労せず構築できてしまいます。
一方で、大規模でデータ量が多いアプリケーションでは、そのコンポーネントの思想や詳しい性質まで知り得ないと、技術選定やシステムの構築が困難になってきます。

このような大規模で複雑な「データ指向」なアプリケーションを作る上で知っておきたい思想や詳しい性質が本書には書かれています。
例えば、第 5 章「レプリケーション」では、「なぜレプリケーションが難しいのか？」、「なぜ書き込み性能が高いマルチリーダーではなくシングルリーダーが広く使われているのか？」といった「なぜ」を知ることができます。
これらを知ることでより技術選定がよりうまくいくような気がしてきませんか？

ここまで述べてきたのは個々の技術、いわば「点」のようなものですが、本書では「点」を独立したものとして扱わず、その「点」と「点」を繋ぐ「線」の部分にまで裾野を広げています。
(この表現は監訳者である[斉藤さんの投稿](https://medium.com/@taroleo/ddia-63a454e44dc9)で別の文脈で使われていましたが、本書にふさわしい表現だと思ったので頂戴しました。)


ここで「線」と表現したのは、技術の移り変わり、すわなち時系列的なものだったり、複数の種類が存在する概念の比較だったりします。
特に技術選定という文脈では、一つの技術だけを深ぼるのではなく、複数の技術を横に並べて比較することが多いです。
こういった場合では、両者の性質を知った上で、それぞれのメリット・デメリットや性質の違いを知る必要があります。
この「線」の部分は意外と詳細に語られている文献は少ないと個人的に感じており、その穴埋めという意味で本書は非常に有用です。

先程も挙げたレプリケーションの例では、
- シングルリーダーレプリケーション
- マルチリーダーレプリケーション
- リーダーレスレプリケーション

のメリット・デメリットが比較して解説されています。
他にも、パーティショニングにおけるパーティション分割の方法の比較やトランザクションにおける分離レベルの比較など、「線」に関する解説にそれなりのページが割かれています。
個別の技術については既に知っているものもありましたが、それらの比較をしっかりと考えたことがなかったので、本書を読んでいると、「点」と「点」が繋がる感覚を覚え、「なるほどそういう違いがあったのか！」と思わず唸ってしまうことが多々ありました。

## おわりに

「データ指向アプリケーションデザイン」は分散システムにおける教科書と呼ぶにふさわしい技術書で、技術選定をする際には隣に置いておきたいと思える本でした。

「点」の部分についてより詳しく知りたい人、「線」の部分について知りたい人、両方におすすめできる技術書なので、興味がある方はぜひ読んでみてください。



<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=p1ass02-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4873118700&linkId=133ac6c450fafcea92e459c6cb4262d1"></iframe>

## P.S.

まったくバックエンドシステムの開発をしたことない人には少々重たいかと思うので注意してください。