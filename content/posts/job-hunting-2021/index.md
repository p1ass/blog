---
title: 21卒Web系ソフトウェアエンジニア職で新卒就活したので結果をまとめる
date: 2020-03-02T18:00:00+09:00
draft: false
description: 本記事では私が21卒Web系のソフトウェアエンジニア職で新卒就活をした結果やその過程で得た知見などを公開したいと思います。勿論NDAがある内容は公開できないですが、私の経験が後世の役に立てば幸いです。
categories:
- 就活
tags:
eyecatch: /posts/job-hunting-2021/ogp.jpg
share: true
---


こんにちは、{{< link href="https://twitter.com/p1ass" text="@p1ass" >}}です。  

世間は就活解禁日ということで少し騒がしい感じがしますね。私は既に就活を終えているためあまり関係ないのですが、思い立ったので自分の就活事情をブログにまとめておこうと思います。

就活はかなりセンシティブな話題であり、ネット上を探しても見つかる情報が少ないです。また、個人の情報は埋もれやすいという問題もあります。そのような状況では参考になる情報に出会えず、就活をどのように進めていくか悩むのではないでしょうか？自分も例に漏れず、かなり苦労しました。そのため、「後輩にはより多くの情報を手に入れてほしい！」と思っています。

そこで、本記事では私がWeb系のソフトウェアエンジニア職で就活をした結果やその過程で得た知見などを公開したいと思います。勿論NDAがある内容は公開できないですが、私の経験が後世の役に立てば幸いです。（スコープはWeb系のソフトウェアエンジニア職に絞っているので、それ以外の界隈の方にはあまり役に立たないとは思いますが何卒）

また、本記事の最後には私が就活を進める上で参考になった個人ブログやWebサイトのリンクをまとめて貼ってあります。私の主観がふんだんに混じったこの記事を読むだけでなく、他の方の記事も読むことでより合理的な判断を下す参考になることを願っています。

 <!--more-->


## プロフィール

さて、まず初めに「お前誰やねん」と思われると思うので自己紹介をしておこうと思います。

京都大学の工学部に通う学部3年生です。情報学科ではないですが、専門科目のうち1/4くらいの講義が情報系と被っている学科に所属しています。研究室配属はまだされていません。

プログラミングを始めたのは中学生の頃です。{{< link href="https://9cguide.appspot.com/" text="苦しんでC言語" >}}を覚え、{{< link href="https://dixq.net/g/" text="DXライブラリ" >}}を使ってテトリスを真似て作ったりしていました。

その後、ポインタで挫折したことに加えMinecraftにハマったことからプログラミングとは離れた生活を送ってきたものの、大学に入ったことをきっかけにプログラミングを再開しました。

大学に入ってからは趣味でWebサービスやBotの開発をしつつ、B2の夏からは長期休暇のたびにインターンに参加してバックエンドの開発を行ってきました。いくつかのインターンでは優勝することもできました。インターン先などの詳しい情報は{{< link href="https://p1ass.com" text="ポートフォリオ" >}}をご覧ください。

現在は、{{< link href="https://camph.net" text="CAMPHOR-" >}}という京都のエンジニアやデザイナーを目指す学生のためのコミュニティの代表をしており、{{< link href="https://camphor.connpass.com/" text="勉強会の企画や運営" >}}、内部向けサービスのメンテなどをしています。

技術スタックはバックエンド寄りでGoを今一番書いています。他にもPython、JavaScript、Javaなどは書いたことがあり、Vue.jsを使って軽いフロントも書けます。GitHubは{{< link href="https://github.com/p1ass" text="こちら" >}}です。

プロダクトを作る上での必要な技術を学んできたことから、アーキテクチャやテスト、コードの品質を保つための考え方などは他の学生に比べても理解しているつもりですが、コンピューターサイエンスに関する知識はあまりないです。AtCoderは緑です。

## 会社選び

さっとく中身に入っていこうと思うのですが、就活で一番大事なのは会社選びです。私の考える就活悩みポイントは

- どこにエントリーするか
- 内定が貰えない
- 複数の内定からどれを承諾するか

の3つなのですが、2つ目は置いといて、1つ目と3つ目はほぼ似たような判断軸を持って判断できると思うので、ここでまとめて書いておこうと思います。

### 会社を選ぶのは情報をきちんと集めてからの方が良い

会社の選び方の理想は **「社会人になってからのキャリアをイメージすること」** です。社会人になってからのその先を考えることで、今どういった会社に入るべきなのかが少しずつ見えてくると思います。

とは言うものの、このように書くと「キャリアセミナーかよ」と嫌悪感を示す方もいますと思います。それはおっしゃる通りで、私も就活してるときにこんなことを言われても響かなかったでしょうし、今でもキャリアをイメージできるかと言われると微妙です。ソフトウェアエンジニアになることは小学生からの夢でしたが、先は何も考えていませんでした。これはあくまで理想論で、僕にはできませんでした。

そのため実際には、

1. 会社の評価軸を考える
2. 自分の評価が高い会社のみに絞り込む
3. 時間が許す限り出来るだけ多くの情報を集める
4. 会社が1つになるまで2と3を繰り返す

という手順で絞り込んでいきました。

内定が出たとしてもすぐに承諾せず、じっくりと情報を集めて出来るだけ合理的な判断ができるように意識しています。同学科の先輩が{{< link href="https://note.com/denden320/n/n396b58ce2b20" text="ブログに書いていました" >}}が、まだ悩むことを迫られていない状況で悩むのはあまりにも勿体ないです。集めれられるだけの情報を集めてから判断した方が良い判断が出来る可能性は高くなります。

しかしながら、中には短い期限を決めて内定承諾を迫ってくる会社もあるそうです（私の受けた会社にはありませんでしたが）。個人的にはそういう会社には **「まだ選考結果が出揃っていないので判断できません。待てないなら辞退します。」** くらいの気持ちを伝えても良いのでは？と考えています。

私は選考を受けてる途中から「内定を頂いてもすぐには承諾しない」ということを伝えていました。言わなきゃ伝わらないことも多いですし、心の中で溜め込むよりはきちんと伝えた方がお互いに理解しやすいです。理解のある会社の人事の方はきちんと考慮して対応してくれます。

(ただ、内定1の状態で辞退して0になる、といった状況ではなかなか言いづらいのも事実ですが、、、)

### 私の判断基準

ここで実際の私の判断基準を箇条書きでまとめておきます。定量的なものはほとんどないので実際は感覚で判断しています。

- **事業領域** : toCの事業が少なくとも１つ存在することが必須。異なる複数の事業領域を持つことが望ましい。
- **会社の規模** : スタートアップよりも大企業。メガベンチャーと呼ばれたりするような会社。
- **出社** : 最低でも10時。9時台の会社はなし。おそらく会社に行くタイプなので、リモート関連の自由度は必ずしも求めていない。
- **技術** : 新しいものを積極的に取り入れていく姿勢がある。
- **技術のアウトプット** : コミュニティの運営をやっていることもあり、寛容で推奨している方が良い。
- **会社の文化・雰囲気** : 自分とノリの似ている人が多い方が良い。性格が合わない人が多いとストレスが貯まりそうなので無理。例えば、{{< link href="https://note.com/moaikids/n/n8d1d1813ee08" text="ブリリアント・ジャーク" >}}と呼ばれるタイプの人とは合わない。
- **給与** : 定量的に測れるため他の基準で優劣がつかないときの最終判断に使う。新卒に対してもスキルを求めている以上、中途同様に個別オファーを出してほしい。（{{< link href="https://twitter.com/komi_edtr_1230/status/1095694399692976128" text="800欲しい" >}}がそれは夢の話であった）
- **楽しく働けるか・やりたいことができるか**  : 最終的にはここが全てだと思う。その会社で楽しく働くイメージが沸かない場合は注意した方が良さそう。


## 選考を受けた企業 (A→Z)

ここまでは会社の選び方について書いてきましたが、ここからは実際に自分が選考を受けた会社について書いていきます。予め断っておきますが、会社名は出しますが具体的なオファー額は出しません。

エントリーした会社は4社です。逆求人やインターンを通して自分の中でフィルタリングされた結果なのですが、多いのか少ないのかは分かりません。友人は10社近く受けてて「はへ〜」って言いながら話を聞いていました。逆に1社しか受けてないという友人もいます。

### CyberAgent

B3の夏に{{< link href="https://blog.p1ass.com/posts/abema-intern/" text="AbemaTVでインターンしていた" >}}最中に{{< link href="https://www.cyberagent.co.jp/careers/news/detail/id=23532" text="サキドリ選考" >}}[^1]に申し込みました。

[^1]: 実質インターン生のための枠なのでは？と思わされる選考

インターン生でも普通にESを書いて、現場面接x3+役員面接を受けました。ESでは「ご自身が最終的に目指すところについて、最も近いものを教えてください」という選択式の設問があったのが印象に残っています。「まだそんなこと考えてないわ！」って言いながら選んだ覚えがあります。

現場面接は至って普通という感じで、インターンの面接で慣れていたこともありスムーズに受け答えできました。役員面接はエンジニア上がりじゃない方だったので **「非エンジニアの方がエンジニアの面接を担当する意義は？」** という逆質問をしました。

内定は無事貰え、フィードバックではエンジニア力の高さやコミュ力の高さを評価していただきました。選考後は（うるさいぐらいに）フォローアップの面談をしてくれて、気になっていることなどをぶつけることができました。

給与に関しては「内定者バイトをすれば入社時にあがるかも」と言われつつも、新卒は新卒という雰囲気が感じられました。

#### 感想

会社のプロダクトは好きなものが多いです。他の会社と比べ、どことなく陽の雰囲気が感じられるので、それが合わない人には無理かもしれないです。（エンジニアはそこまで体育会です！という雰囲気は感じられなかった。逆にオタクな人も勿論いる。）

今更ですが、{{< link href="https://www.cyberagent.co.jp/careers/about/" text="募集要項" >}}にみなし残業が書かれていなくて「書いたほうがいいよな〜」という話を友人としました。

### DeNA

B3の夏にインターンに参加して{{< link href="https://blog.p1ass.com/posts/dena-intern/" text="優勝していました。" >}}その後、声を掛けられたことに加え、元から興味を持っていたので選考に申し込みました。選考フローは人によって全然違うらしく、{{< link href="https://student.dena.com/job/engineer" text="募集要項" >}} にも特に書かれていません。

夏インターンの頃から選考にCTOが参加されていた({{< link href="https://fullswing.dena.com/archives/4281" text="参考" >}})のですが、本選考もそんな感じでした。内定後のオファー面談では、社内の評価制度の説明やそれに対し私がどこに位置するのかという話を詳しくしていただいたのが好印象でした。「即戦力を期待している」と言われたときは素直に嬉しかったですが、それと同時に見合うだけのスキルを身に付けなければという気持ちになりました。

上の文章から分かる通りオファーは人それぞれで、自分も募集要項に書かれた500 ~ 1000 の間でした。21卒では内定第1号らしい？

#### 感想

インターンがバチクソ楽しかったので選考前から好感度が高かったです。ただ就業型ではなかったので実際に働くイメージがしずらいところが難点で、その辺の質問をしました。担当の人事の方の一人がエンジニア上がりだったので、技術の相談ができたのはとても良かったです。

募集要項に「ソフトウェアエンジニアとして、技術が好きで、モノづくりが好きな方を求めています。今のモノづくりは一人ではできません。」と書かれているように、プロダクトを開発したいエンジニアを求めていそうな雰囲気を感じました。

社員の方はロジカルなタイプの人が多い印象を持ちましたがサンプルが少ないので信憑性は微妙です。自分には合ってそうだなと感じました。

築地で奢っていただいた寿司はめっちゃ美味しかったです。🍣

### LINE

B2(新B3)の春に{{< link href="https://blog.p1ass.com/posts/line-intern/" text="LINE LIVEでインターンしてました。" >}}{{< link href="https://live.line.me/channels/4120347/" text="推しの月額有料チャンネル" >}}に入るくらいには使ってます。

LINEの選考は他と違ってtracksを使ったコーディングテストがあります。何回でも受け直すことができるRe-Challenge制度があり、自分は2回目で通りました。{{< link href="https://linecorp.com/ja/career/newgrads/engineering/flow" text="新卒採用のページ" >}}には使用できる言語は「C#、Java、 JavaScript、Ruby、Python」と書かれていますが、他にも沢山使えて、私はGoを使いました。多少なりともデータ構造とアルゴリズムを勉強していたのでなんとかなりましたが、「Webフロント一本でやってきました！」という人には厳しくない？という気持ちになりました。

私は残念ながらその後の技術面接で選考は落とされました。インターンのときのことをかなり聞かれたのですが、結構前のことなので「忘れました」という返事をしたら「そこが本質だと思うんですけど。」と言われてﾐｯってなりました。後、「あなたならこういう状況に陥ったらどうしますか？」という質問に対して、技術的解決策ではなく仕様を変更する形の提案をとっさに言ってしまったのが微妙だったかなぁと思ってます。その後そのまま次の質問に流れてしまったので、こういう系の質問のときは頭で考える前に相手に逆質問で情報を聞き出す方が良さそうです。

#### 感想

多くのユーザを抱えるプロダクトを開発しているところにはとても魅力的です。また、特定の技術領域に強い人が多く在籍しているのも良いです。しかし、Javaでオンプレの会社ということもあり、自分の技術スタックや求めるものとは合わないのは事実です。インフラやセキュリティをやってる人にはかなり良い会社なんじゃないかなと思います。

会社の雰囲気は穏やかな人が多い印象で、良くも悪くも中途に良さそうというイメージを持ちました。

学生は高学歴の人が多かったです。東大院、筑波院、京大院はよく見かけました。コーディングテストがある → 競プロをやっている → AtCoder人口的に高学歴が多い というロジックなのかなと勝手に推測しています。後は機械学習をガッツリやってるからですかね。批判されるような書類で学歴フィルタなんかはしてないと思います。念の為。

余談ですが、生理的にSBが嫌いでYahoo!との報道が流れてから選考のモチベが削れていました。

### ピクシブ

B2の冬に2dayのハッカソンに参加して{{< link href="https://blog.p1ass.com/posts/pixiv-intern-2018/" text="優勝しました。" >}}そのときの繋がりで声を掛けられたのと、pixivやBOOTHはずっと使っている[^2]ので、自分の使っているプロダクトを開発できたらいいなという思いで選考を受けました。

[^2]: pixivを中学生のころから(見る側として)使っていて、初めてプレミアム会員になったのは2014年でした。

ただ「異なる複数の事業領域を持つ会社に行きたい」という気持ちが強くなったので、選考は途中で辞退させていただきました。理由を説明したところ人事の方にも理解していただきました。それにもかからわずPIXIV TECH FESには招待していただいて感謝しかないです。

Webサービス自体は今後も１ユーザとして応援していきたいです。

### 選考まとめ

というわけで、2内定、1落ち、1辞退という結果になりました。苦労したわけではないですが、内定総取りというわけでもないです。内定はそれぞれ9月と11月に貰って、承諾したのは1月でした。

各社のインターンや選考を受けていて感じたのは、それぞれの会社ごとに集まる学生の性格やスキルに特徴があることです。自分と似た性格の人が多いところや逆にちょっと違う人が多いなど、すぐ感じ取れるぐらいには分かります。合わない会社は少し注意した方が良いかもしれません。

## FAQ

ここからは聞かれそうな質問に対して順に答えていきます。記事も長くなってきたことですし、気になるところだけを読めば良いと思います。ある程度時系列順です。

### 逆求人に行ったほうが良い？

私は3月と4月にサポーターズの逆求人に参加しましたが、多くの会社と接点を持てるという意味では良いと思います。面接の練習にもなると思いますし。また、選考免除がもらえるメリットもあります。(参加しませんでしたが)**サマーインターンの選考全免除**を貰うこともできました。

ただ、良いところばかりではないです。正直一日近くずっと面談し続けるのは、学生にとっても人事に方にとってもキツイです。最後の方はお互いに疲れてしんどそうです。

学生側としては、**お目当ての会社よりも興味のない会社が多いと一日中モチベーションが続かないです**。ある程度行きたいところが決まってるなら直接エントリーしてしまった方が早いのでは？と最近は思っています。

会社側も最近は一周回って合説のような採用イベントを開くようになってきた({{< link href="https://ydca.connpass.com/" text="Yahoo! & DeNA & CA" >}}、{{< link href="https://line.connpass.com/event/153644/" text="LINE & メルカリ & Cookpad" >}}etc)ので、そっちの方がエンジニアの方が多く参加されている場合が多く良いかもしれません。[^3]

[^3]: 自分は参加してないので詳しくは知りません。

### インターンに行ったほうが良い？

確実にインターンには行ったほうが良いです。これは選考のためではなく、**自分の客観的なスキル力を知るため**にです。

大学にこもっていると視野が狭くなり、他の学生がどれほどのスキルを持っているのかを知らなかったり、自分に足りていないスキルを見出すのは困難です。インターンは全国から様々な学生が集まるのでそれらを知る絶好のチャンスです。おまけに良い時給がもらえるので最高です。自分もそうでしたが**就活関係なくてもバシバシ参加しましょう。**

上の目的を考えれば分かると思いますが、実績作りのためだけによく分からない怪しいインターンに行って、**git管理すらされてない闇コードを解読するのに時間を使うのだけは辞めた方が良い**です。基本的にネットで検索して参加ブログが見つかるものは安心できるはずです。


### インターンに参加するには何をしたら良い？

**「インターンに参加しているとインターンに参加しやすくなります！！！！」**

これはよくTwitterで言われているセリフですが、大体この通りだと思います。どこのインターンに言っても毎回別のインターンで知り合った学生がいます。同じ人がぐるぐる色んな所を回り回ってるイメージです。
そのため一度その中に入れると後は簡単なのですが、そこまでのハードルは少し高いです。

そこでまずはスクール型のインターンに参加することをオススメします。就業型に比べ選考が通りやすく、おまけに業務で必要な知識を学べます。私の最初のインターンはLINEのエンジニアスクールコースでした。他だと、{{< link href="https://voyagegroup.com/internship/treasure/" text="VOYAGEのTreasure" >}}や{{< link href="https://techlife.cookpad.com/entry/2019/09/06/180000" text="Cookpadのインターン" >}}、{{< link href="https://www.cyberagent.co.jp/careers/students/event/detail/id=23251" text="CA Tech Dojo" >}}あたりですかね。


### インターンは採用に直結するか？

お互いに相手のことを知っている状態では選考しやすくなるのは間違いないと思います。選考ルートが変わるかどうかは会社によりけりなので一概には言えません。

### どれだけの技術力が必要？

これはよく聞かれるのですが、「技術力」という単語の定義は人によってバラバラなので少々答えづらいです。**皆が使う「技術力」には「純粋な技術力」と「プロダクト開発力」の２つがあると思っています**。

「純粋な技術力」は**ある固有の領域に関する深い知見を有していること**を指します。例えば、TCP/IPやRDBMS、OS、機械学習などに詳しい方はこれに当たると思います。この観点で言うと私は全然技術力はありません。

「プロダクト開発力」は**技術を用いてITに関連するプロダクトを開発・運用する能力**を指します。実現したい機能要件を技術を用いて実現したり、運用しやすいようなコードを書くことが出来る能力です。趣味でWebサービスの開発をしていたことから、こちらの方の経験は学生の中ではある方だと思います。

どちらの能力が必要かは受ける会社によって変わってきます。Webサービスを作ったことがなくても会社が求めている技術とマッチする「純粋な技術力」があれば通ると思いますし、「自分でプロダクトを完遂させた経験がない人は厳しい」と考えている会社もあります。まずは自分の受ける会社がどのようなスキルを求めているのかを把握した方が良いと思います。

次に、必要な能力を外(学部や大学の外)の人と客観的に比較してみましょう。それができたら自分に足りないもの・強みになるものがわかると思います。

とは言っても、ちょっと抽象的すぎで分かりづらいと思うので、(Web)プロダクト開発の観点で最低限あった方が良いスキルを箇条書きでまとめておきます。参考にしてください。

- 自分の使っている言語やフレームワークの特徴を理解して使っている。
    - フレームワークを使うのではなく、使わされてる感になっている人がたまにいる。
    - チュートリアルを流しただけではダメという話。
- フルスタックなフレームワークを使う場合はその裏がどのようになっているかをそれなりに理解している。
    - Active Recordを使うならその裏で発行されるSQLをなんとなくでも分かっている。
- HTTPの理解。
    - HTTPメソッドの使い分けやヘッダー、ボディの使い方など。
- 読みやすい、メンテしやすいコードを書く努力をしている。
    - 変数名を意識したりや関数を細かく切るなど。
- GitHub FlowやGit Flowを用いた開発。
- Web APIを用いたクライアント・サーバ間の通信。
- **最終的にプロダクトを完成させている。**

他にもバックエンドであれば、

- Docker
- MySQL
- AWS or GCP

あたりは開発する上で必要になるパターンが多いので基礎的なところは理解していた方が良いと思います。「使える」くらいのスキルで大丈夫だと思います。(「MySQLのインデックスを貼った経験はあるが、B+Treeは知らない」くらいのイメージ感、適当）

### アウトプットは必要か？

あれば面接で話すネタになりますし、会社としてもスキルを見極める材料になるので、あった方が良いのは間違いないです。

とはいえ、僕の友人は個人でプロダクトや技術ネタのブログを書いてこなかったにも関わらず、有名な会社の内定をバシバシ貰ってたので、必ずしも必要ではないと思います。[^4]

[^4]: エンジニアバイトやインターンには沢山参加していたのでそっちの経験でカバーできてたと思われる。

### 技術スタックは就活に影響する？

各会社の中途の募集を見て「使われている言語の知識を必須としているかどうか」を見れば、どれだけ影響するかは読み取れると思います。


### 競プロをやった方が良い？

コーディングテスト対策にはなります。自分はペーペーなので、参考の競プロerの就活ブログを読むと良いと思います。

### コミュニケーション能力は必要か？

人が話している時は話し終わるまで聞いて、それに対し自分なりの意見を言える能力は必要だと思います。飲み会でワイワイできるコミュ力はいらないです。

### 何社選考受けるべきですか？

多く受けるのはしんどいし、私のような地方勢には時間的に厳しいので、何かしらの方法で予め絞り込んでから受けた方が良いと思います。

{{< link href="https://note.com/ss_shopetan/n/nba8cf2c11cc2" text="このブログ" >}}にも書かれていますが、「沢山内定を持っていても悩むだけなので，仮に内定が出たとして断る理由がないような会社しか受けなくて良い」です。

就業型インターンに受かるようなスキルがある人であれば選考全落ちなんでことにはならないと思うので、滑り止めはいらない気がしてます。第一志望群、第二志望群のようなグルーピングができるのであれば、第一以外は受けなくて良いと思います。そもそもエンジニア界隈の採用は各社スケジュールがバラバラ&早期化してるので、全落ちしてからでも間に合うと思います。[^5]

[^5]: 責任は取りません。

### 面接の受け答えが上手くできません

私もB2の春に初めて面接を受けた時は散々でしたが、回を重ねるごとにまともな受け答えをできるようになったので慣れだと思います。

大体どこの面接も聞かれることは似ているので、面接のたびに聞かれた質問をメモっておいて、他の面接を受ける前にその質問に対する答えを考えておくと良いです。

### 就活お金かかりましたか？

インターン、本選考を通して全ての新幹線代、宿泊費は出して貰いました。京都駅までは流石に自腹ですが、新幹線代に比べたら微々たる額なので全く困まりませんでした。

ただ、我々地方勢にとって東京に行くのはしんどいことなので、東京で予定がない限りお金が貰えたとしても、なるべくオンラインでしてもらえるように交渉した方が良いと思います。

後、**補助が出るかどうかは早めに聞きましょう。** 人事が地方に住んでることを忘れている場合があったりするので。

### 大学院に行くべきですか？

大学院に行く目的があれば行けば良いと思います。「研究がしたい」、「とりあえず修士号を取っておきたい」、「推薦で就活をサクッと終わらせたい」など何かしら目的があればやっていけるのではないでしょうか？私は院に行かないので院生活がどのようなものかは知りませんが、知り合いは続々中退しているので、モチベーションは大事そうだなと傍から見て感じています。

私が院に行かないのは院に行く目的がないからです。京大の願書を書く時期まで**大学院という存在を知らなかった**ですし、卒業した9割の人が院に行くということも知りませんでした。そのため、元から「研究したい」というモチベはありません。就活に関しても困っていない、なんなら就職して2年経って転職した方が良いまであります。情報学の修士号は少し欲しいですが、GPAが3.6↑くらいあり、社会人になってから改めて海外の院を目指すこともできるので強い動機にはなりませんでした。

### 内定が出ません

{{< link href="https://note.com/ss_shopetan/n/nba8cf2c11cc2" text="このブログ" >}}から引用しますが、「ぶっちゃけ日本のメガベンチャーなら，一定レベルに達してる人間は選考で落ちない」状況にあるのを周りを見ていて感じます。

インターン経験がない人は就活学年より前からインターンに行っている人に比べたら経験が周回遅れになっているので、それをカバーできればなんとかなるかもしれないです。個別ケースなので、汎用的な良いアドバイスはできません、、、[^dm]

この本は一度読んでみると参考になるかもしれません。

{{<ex-link url="https://booth.pm/ja/items/1575005">}}

[^dm]: DMとかなら反応できるかもしれないです。


### オファー額は？

ここでは言いません。オフラインで会った時に聞いてください。オファー額絡みで妬み・恨みが発生しているのを観測していて厳しいものを感じています。

### 給与交渉した？

「上げてくれませんか？」と明示的には言っていません。面談のときに御社の給料は他に比べてしょっぱいという話はしました。



## おわりに

正直、就活は体力的・精神的に疲れます。**選択肢を広げる行動は楽しいのですが、絞り込む行動には苦痛を伴います。** そういったときに頼りになるのは同じく就活をしている同期だったりします。人事や変なキャリアコンサルに比べてポジショントークが少ないし、元から自分のことを知っていて状況を理解しながら客観的に相談に乗ってくれます。飲みに連れて行ってTwitterでは呟けないぶっちゃけトークをしたりするとかなり気持ちがスッキリします。一人で悩み込んでも大体解決しないのでとりあえず色んな人に相談することをオススメします。

私の今後の予定ですが、4月から研究室配属されて卒研をします。プライベートはCAMPHOR-の代表として他の運営からこぼれてきているものを拾いつつ、余った時間でCS系の勉強をしていこうと思います。最近学びの少ないただコードを書くだけの時間が虚無に思えてきたので、もっとベースとなる知識を学んでいきたいです。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">これコーディングしててもほとんど学びがなくて、貯金をただ消化してる感じがするのが原因かも</p>&mdash; ぷらす (@p1ass) <a href="https://twitter.com/p1ass/status/1233055323247628288?ref_src=twsrc%5Etfw">February 27, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

私の就活話はこれで終わりにしますが、この文章が皆さんの役に立てば幸いです。[^6]最後の色んな方の参考記事も是非読んでみてください。長々と書いてきましたが、最後までお読みいただきありがとうございました。

[^6]: 文章全体を通して上から目線のように捉えられそうなのですがそんなつもりはありません。文章力がないだけです。

## 参考

就活をする上で沢山のネットの記事やブログを読みました。就活はセンシティブなものなので情報を集めるのは一苦労ですが、情報はとても役に立ちます。そこで役に立った記事のリンクをまとめて貼っておこうと思います。結局昔ながらのハイパーリンクが最高説。被リンク大歓迎(?)

### 学生の記事

ある会社に就職する人と退職した人が混ざっているのが面白いですね。

- {{< link href="https://medium.com/@konnyaku256/%E3%82%B5%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%BC%E3%82%BA-%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A21on1%E9%9D%A2%E8%AB%87%E4%BC%9A%E3%81%AB%E5%8F%82%E5%8A%A0%E3%81%97%E3%81%A6%E3%81%8D%E3%81%9F-1bbc94a18790" text="サポーターズ エンジニア1on1面談会に参加してきた - konnyaku256 - Medium " >}}
- {{< link href="https://denden-seven.hatenablog.com/entry/2019/04/23/175329" text="逆求人イベントに行って疲れた話 - 電電のブログ" >}}
- {{< link href="https://lorse.hatenablog.com/entry/2019/08/03/223000" text="2019サマーインターン選考記録 - La Vie en Lorse" >}}
- {{< link href="https://denden-seven.hatenablog.com/entry/2019/08/11/203801" text="サマーインターン2019の選考記録． - 電電のブログ" >}}
- {{< link href="https://saram.hatenablog.com/entry/2018/12/24/165357" text="大学院に行かないことにした - 知ったかぶらない " >}}
- {{< link href="https://note.com/ss_shopetan/n/nba8cf2c11cc2" text="19卒としてWeb系エンジニア職のJobHuntingをしたのでまとめる" >}}
- {{< link href="http://shopetan.hatenablog.com/entry/2018/12/21/000813" text="ソフトウェアエンジニアとして就職する時に考えたこと - 未来永劫" >}}
- {{< link href="https://www.creativ.xyz/job-search-926/" text="就職活動を終えました" >}}
- {{< link href="https://www.creativ.xyz/post-20/" text=" 就職活動を終えました（第2期）" >}}
- {{< link href="http://kuxumarin.hatenablog.com/entry/2019/03/27/154414" text="20卒地方Fラン大のウェブ系就活記録 - くうと徒然なるままに" >}}
- {{< link href="https://anond.hatelabo.jp/20190407192318" text="新卒で入社したヤフーを退職した" >}}
- {{< link href="http://ukuku09.hatenablog.com/entry/2019/07/04/222316" text="大悪魔でも就職したい！ - オンサイトで未確認" >}}
- {{< link href="https://chakku.hatenablog.com/entry/2019/07/05/141305" text="IQ1も就活したんだよっ - ちゃっくのメモ帳" >}}
- {{< link href="http://watarumon.hatenablog.com/entry/2018/11/18/222012" text="新卒配属ガチャに失敗しました - 筋肉で解決しないために。" >}}
- {{< link href="https://note.com/naro143/n/n0cfbf94df264" text="複数のメガベンチャーに内定した就職活動の総まとめ｜naro143｜note" >}}
- {{< link href="https://rian.hatenablog.jp/entry/2019/07/03/230000" text="レッドコーダーなので就活で俺TUEEEEをしようと思ったがそうもいかなかった件（タイトル募集中です） - うにゅーん、って感じだ" >}}
- {{< link href="https://itkq.jp/blog/2017/07/13/get-my-first-job/" text="新卒就活を終えた" >}}
- {{< link href="https://keens.github.io/blog/2015/02/07/shuukatsunitsuiteomottakotowokokonikakishirusu/" text="就活について思ったことをここに書き記す | κeenのHappy Hacκing Blog" >}}
- {{< link href="https://note.com/komi3/n/n944805a8d12c" text="就活終わったので一筆とろうと思う｜コミさん｜note" >}}
- {{< link href="https://syuchan1005.hatenablog.com/entry/2018/12/17/205130" text="LINEの内定をもらった話(新卒, 第2ターム, 2020卒) - syuchan1005のにっき" >}}

### 社会人エンジニアの記事

キャリアに関する記事が多めです。都元ダイスケさんの「エンジニアとしての歩き方」は10年以上前の記事なのに今読んでも色褪せないものがあります。ご冥福をお祈りします。

- {{< link href="http://daisuke-m.hatenablog.com/entry/20090707/1246979611" text="エンジニアとしての歩き方 - 都元ダイスケ IT-PRESS" >}}
- {{< link href="https://soudai.hatenablog.com/entry/2019/01/06/142202" text="文系でもプログラマになれるのか - そーだいなるらくがき帳" >}}
- {{< link href="https://speakerdeck.com/rtechkouhou/enziniatositekofalsexian-sheng-kifalsekorutameni" text="エンジニアとしてこの先生きのこるために - Speaker Deck" >}}
- {{< link href="https://note.com/psychs/n/n6dfa2319114b" text="ソフトウェアエンジニアとして心がけていること｜Satoshi Nakagawa｜note" >}}
- {{< link href="http://konifar.hatenablog.com/entry/2015/05/07/101333" text="きっと何者にもなれない焦りを抱えながら、がむしゃらに前に進む - Konifar's WIP " >}}
- {{< link href="https://speakerdeck.com/potato4d/number-bcu30-engineer-career" text="エンジニアキャリアにおける焦燥感との向き合い方 #BCU30_1 / #BCU30 Engineer Career - Speaker Deck" >}}
- {{< link href="http://tech.fuqinho.net/?p=191" text="ソニーを退職しました。 – Happy Coder" >}}
- {{< link href="http://tech.fuqinho.net/?p=620" text="2年間の独学をふりかえって – Happy Coder" >}}
- {{< link href="https://engineer-lab.findy-code.io/konifar-growth-history" text="キャリアへの焦燥感を成長の糧に。新卒2年目で直面した不安を払拭するため、こにふぁーさんが試行錯誤してきたこと - Findy Engineer Lab" >}}
- {{< link href="https://engineer-lab.findy-code.io/neet-to-cto" text="「成長できる環境に身を置く」ことが本当のスタート。就活に失敗したニートからCTOになったエンジニアの話 - Findy Engineer Lab" >}}
- {{< link href="https://engineer-lab.findy-code.io/engineer-lab/why-study-stem" text="シリコンバレーから失意の帰国をした十年選手のITエンジニア、生き残るため大学院で情報科学を学ぶ - Findy Engineer Lab" >}}
- {{< link href="https://blog.takanabe.tokyo/2019/03/carnegie-mellon-university-%E3%81%AB%E5%90%88%E6%A0%BC%E3%81%97%E3%81%9F%E8%A9%B1/" text="Carnegie Mellon University に合格した話afafan.hatenablog.com/entry/2020/02/25/093000" text="コード書く以外の仕事上暗黙的に必要とされている様々なスキルについてブレストしてみる - @stefafafan の fa は3つです" >}}
- {{< link href="https://speakerdeck.com/soudai/engineer-life-hack" text=" 35歳を超えた僕たちが、 今と未来の技術と如何に向き合うか ~ 35歳の壁を超えていく ~ - Speaker Deck" >}}
- {{< link href="http://konifar.hatenablog.com/entry/2015/05/17/224120" text="圧倒的に成長している時は実感がない - Konifar's WIP" >}}
- {{< link href="https://yshibata.blog.ss-blog.jp/2013-10-10" text="ソフトウェアエンジニアの成長カーブ（再掲載）：柴田 芳樹 (Yoshiki Shibata)：SSブログ " >}}
- {{< link href="https://speakerdeck.com/sogitani1107/shi-shi-togei-yu-toping-jia-falseguan-xi" text="仕事と給与と評価の関係 - Speaker Deck" >}}
- {{< link href="https://anond.hatelabo.jp/20171202134440" text="口の悪い人間をエンジニアとして採用するべきか" >}}


### 会社側の記事

よく見るとインターンの倍率などが書いてあって意外と面白いです。

- {{< link href="https://mercan.mercari.com/articles/19653/" text="「採用面接で必ず質問することは？」に対する、スマニュー・グリー・DMM・メルペイの答え #EMTalk レポート【後編】 | mercan (メルカン) " >}}
- {{< link href="https://publickey1.jp/blog/19/it_2019.html" text="IT系上場企業の平均給与を業種別にみてみた 2019年版［前編］ ～ ネットベンチャー、ゲーム、メディア系 － Publickey" >}}
- {{< link href="https://blog.codecamp.jp/engineer-training-cookpad-part1" text="クックパッド 星氏「新卒でも技術力を重視、尖ったエンジニアはエキスパート枠として採用」《新卒エンジニア育成カイギ その5》" >}}
- {{< link href="https://pages.supporterz.jp/repporterz_interview_DMM.com.html" text="DMMの多彩な事業を支えるエンジニア技術とスピード感。DMM TECH VISIONを掲げるCTOが語る、新卒エンジニア採用と課題解決とは？" >}}
- {{< link href="https://career.levtech.jp/guide/knowhow/article/565/" text="2020年新卒エンジニア 就職活動実態調査" >}}
- {{< link href="https://note.com/mie_roto/n/nb9e5c92d59dc" text=" いい就活をしてる人の共通点｜峰岸 啓人｜note" >}}
- {{< link href="https://be-ars.colopl.co.jp/company/post/000759.html" text="コロプラ、技術テストの作成基準 & 過去問を公開します！ 2018年度入社エンジニア向け｜コロプラベアーズ" >}}
- {{< link href="https://www.slideshare.net/linecorp/line-80520817" text="LINEの新卒採用試験 ズバリ問題解説" >}}
- {{< link href="https://hrnote.jp/contents/b-contents-follow-20190628/" text="学生の不安をなくす内定者フォロー｜企業側が意識すべきポイント | 人事部から企業成長を応援するメディアHR NOTE" >}}
- {{< link href="https://hrnote.jp/contents/b-contents-saiyo-shinsotsukyuyotaidan-180724/" text="サイバーエージェント・LINE・scoutyが「新卒の一律初任給」をやめた理由 | | 人事部から企業成長を応援するメディアHR NOTE" >}}
- {{< link href="https://tracks.run/agilehr/column2017042501/" text="今さら聞けないGitHub採用におけるエンジニア採用の効果と注意点 | AgileHR magazine | エンジニア組織のHRを考える" >}}
- {{< link href="https://tracks.run/agilehr/sprint08-1/" text="クックパッド株式会社のバズらせるインターン集客法とは | AgileHR magazine | エンジニア組織のHRを考える" >}}
- {{< link href="https://tracks.run/agilehr/sprint08-3/s" text="実際のチームに従事して課題解決を体験できるのが、Gunosyのインターンシップ | AgileHR magazine | エンジニア組織のHRを考える" >}}
- {{< link href="https://fukabori.fm/episode/20" text="20. 技術力をいかに評価するか？インターンシップにおける採用・戦略とは？ w/ makoga | Fukabori.fm" >}}

### 採用とは直接関係ない記事
- {{< link href="http://tokunoriben.hatenablog.com/entry/20121209/1355067152" text="就活論を熱く語ってる人間には、それでメシ食ってる人間か、女子大生と一発ヤリたい人間くらいしかいない。" >}}
- {{< link href="http://konifar.hatenablog.com/entry/2015/05/03/013511" text="休日に何もできなかった時の虚無感対策 - Konifar's WIP" >}}
- {{< link href="http://konifar.hatenablog.com/entry/2015/05/04/010305" text="伝えたいことがあるなら汚い言葉は控えた方がいい - Konifar's WIP" >}}
- {{< link href="https://note.com/denden320/n/n396b58ce2b20" text="自分の決定プロセスについて｜電電｜note" >}}
- {{< link href="https://note.com/moaikids/n/n8d1d1813ee08" text="ブリリアント・ジャーク｜moaikids｜note" >}}
- {{< link href="https://taisyoku.company/" text="退職エントリまとめ" >}}

### SHIROBAKO

SHIROBAKOは多くのことを考えさせてくれる素晴らしいアニメです。見てない人はすぐ見ましょう！！！絶賛映画公開中！！！

{{< ex-link url="https://blog.p1ass.com/posts/shirobako-2019/" >}}

### おまけ

本来は有料noteにする予定だったんですけどブログで無料で公開したので{{< link href="https://www.amazon.jp/hz/wishlist/ls/32EJQUG5H8XPB?ref_=wl_share" text="例のあれ" >}}を貼っておきます。

## 合わせて読みたい

- {{< block-link href="https://blog.p1ass.com/posts/aktsk-intern/" text="ドメインロジックと永続化処理を分離する設計改善を行って得られた知見 - ぷらすのブログ" >}}
- {{< block-link href="https://blog.p1ass.com/posts/abema-intern/" text="CyberAgentのAbemaTVでインターンしてきた話 - ぷらすのブログ" >}}
- {{< block-link href="https://blog.p1ass.com/posts/dena-intern/" text="DeNAのエンジニアサマーインターンで優勝してきた - ぷらすのブログ" >}}
- {{< block-link href="https://blog.p1ass.com/posts/line-intern/" text="LINEの就業型インターンに参加してきた - ぷらすのブログ" >}}
- {{< block-link href="https://blog.p1ass.com/posts/cyberagent-architecture-challenge/" text="Cyber Agentのインターン「Architecture Challenge」に参加してきた - ぷらすのブログ" >}}
- {{< block-link href="https://blog.p1ass.com/posts/pixiv-intern-2018/" text="pixiv2018冬インターンシップで「最高のpixiv」を作ってきた【参加記】 - ぷらすのブログ" >}}