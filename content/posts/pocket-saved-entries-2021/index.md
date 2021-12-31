---
title: 2021年にブックマークした記事まとめ
date: 2021-12-29T21:00:00+09:00
draft: false
description: 普段利用しているブックマークサービスである Pocket の API を使って、今年ブックマークした記事の一覧をまとめてみました。280記事くらいあるので、目次をみつつ漁ってみてください。
categories:
  - 雑記
tags:
  - ブックマーク
  - Pocket
share: true
toc: true
---

こんにちは、[@p1ass](https://twitter.com/p1ass)です。

普段利用しているブックマークサービスである [Pocket の API](https://getpocket.com/developer/) を使って、今年ブックマークした記事の一覧をまとめてみました。
大体 280 記事くらいあるので、目次をみつつ漁ってみてください。
バックエンドからインフラ、設計、フロントエンド、マネジメントまで幅広くあります。

なお、記事の一覧は下記のスクリプトを使って生成しました。
急いで作ったので拡張性はないです。
使いたい方は適当に手直しして使ってください。

{{<ex-link url="https://github.com/p1ass/list-pocket-saved-items">}}

<!--more-->

**注意: タグはかなり適当**

## バックエンド

### Go

- [Nintendo Switch™ ネイティブバイナリへの Go コンパイルを成功させた話](https://zenn.dev/hajimehoshi/articles/72f027db464280)
- [Go の入力バリデーションパッケージ ozzo-validation を試した。](https://zenn.dev/mattn/articles/893f28eff96129)
- [k0kubun/pp: Colored pretty printer for Go language](https://github.com/k0kubun/pp)
- [OpenTelemetry in Go](https://zenn.dev/ww24/articles/beae98be198c94)
- [Go のロギングライブラリ 2021 年冬](https://moriyoshi.hatenablog.com/entry/2021/12/14/183703)
- [GraphQL の静的解析基盤を作った](https://tenntenn.dev/ja/posts/2021-04-11-gqlanalysis/)
- [Go のリリースプロセスとブランチ戦略](https://ymotongpoo.hatenablog.com/entry/2021/12/15/231928)
- [Go 1.16 の signal.NotifyContext()](https://future-architect.github.io/articles/20210212/index.html)
- [Go has both make and new functions, what gives ? – The acme of foolishness](https://dave.cheney.net/2014/08/17/go-has-both-make-and-new-functions-what-gives)
- [Go のトランザクションマネージャ作った](https://shogo82148.github.io/blog/2015/05/09/go-txmanager/)
- [Go の最初の手順 \- Learn \| Microsoft Docs](https://docs.microsoft.com/ja-jp/learn/paths/go-first-steps/)
- [スレッドセーフなテスト用の時間を固定するライブラリを作った](https://tenntenn.dev/ja/posts/2021-07-06-testtime/)

### Java

- [JAX-RS 入門および実践](https://backpaper0.github.io/ghosts/jaxrs-getting-started-and-practice.html#1)
- [私からあなたへ 一人前の Java エンジニアになるためのロードマップを送ろう](https://qiita.com/haruto167/items/5a784df032518277f4a0)
- [Immutable でスレッドセーフになった Java の新しい日時 API の基礎知識](https://atmarkit.itmedia.co.jp/ait/articles/1412/16/news041.html)
- [Singleton をモックする。](https://blog.fieldnotes.jp/entry/2013/12/17/220126)
- [How to print out all dependencies in a Gradle multi-project build?](https://stackoverflow.com/questions/44266687/how-to-print-out-all-dependencies-in-a-gradle-multi-project-build)
- [Groovy を知らない人のための build.gradle 読み書き入門](https://qiita.com/opengl-8080/items/a0bb31fb20cb6505188b)
- [Indeed.com の Java コード 2014-12-14](https://www.otchy.net/20141214/java-code-of-indeed-com/)
- [拙訳 JUnit 5 User Guide](https://qiita.com/carimatics/items/f13f0c26c7ad2dee2c94)
- [OWASP Dependency-Check を使って Maven の依存ライブラリの脆弱性を確認する](https://zenn.dev/koduki/articles/608d2efe6b2fd3)
- [10 年間 Java を書いていた僕が Effective Java 第 2 版を読み返して新人に薦められるのかを考えてみた](http://www.susumuis.info/entry/2014/advent_calendar_java)
- [JUnit5 使い方メモ](https://qiita.com/opengl-8080/items/efe54204e25f615e322f)
- [VisibleForTesting と RestrictTo](http://yuki312.blogspot.com/2017/07/visiblefortestingrestrictto.html)
- [final を付けるのをやめてみた](https://irof.hateblo.jp/entry/2019/09/27/233547)
- [Java17 対応版！Java コーディング規約の紹介 \| フューチャー技術ブログ](https://future-architect.github.io/articles/20211007a/index.html)
- [Java プログラミングスキルの更新](https://torutk.hatenablog.jp/entry/2021/05/31/223952)
- [Gradle のタスク定義のあれこれ](https://qiita.com/opengl-8080/items/0a192b62ee87d8ac7578)
- [Java の例外処理について](https://megascus.hatenablog.com/entry/20151205/1449318827)
- [Gradle のネイティブ Bom サポートについて](https://zenn.dev/empenguin/articles/de588b771f1602)
- [java.util.Objects を使おう](https://kokuzawa.github.io/blog/2014/12/25/java-dot-util-dot-objectswoshi-ikonasou/)
- [「maven と書いて達人と読む」という勉強会を 4 日連続でやった話](http://nabedge.blogspot.com/2015/12/maven4.html)
- [Add build dependencies](https://developer.android.com/studio/build/dependencies)
- [JavaEE 使い方メモ（CDI）](https://qiita.com/opengl-8080/items/431de9175dca33a09ba8)
- [lombok val](https://projectlombok.org/features/val)
- [Effective Java 第３版 「ほぼ全章」を「読みやすい日本語」で説明してみました。](https://qiita.com/nyandora/items/3e5ec76ca3881bc17924)
- [BOM プロジェクトとは](https://qiita.com/syogi_wap/items/432bbdbe9892eb05e122)
- [JDK 8 の jdeps で JAR ファイル間の依存関係を可視化](https://torutk.hatenablog.jp/entry/20140624/p1)
- [Struts を使い続けることの問題点＆現在有力な Java EE、Spring、Play Framework の基礎知識とアーキテクチャ](https://atmarkit.itmedia.co.jp/ait/articles/1507/02/news012.html)
- [Java コーディング規約 \| Future Enterprise Coding Standards](https://future-architect.github.io/coding-standards/documents/forJava/Java%E3%82%B3%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E8%A6%8F%E7%B4%84.html)

### Gradle

- [What is Gradle?](https://docs.gradle.org/current/userguide/what_is_gradle.html)

### Perl

- [Perl Hackers Hub：連載｜ gihyo\.jp … 技術評論社](https://gihyo.jp/dev/serial/01/perl-hackers-hub)
- [hatena/Hatena-Textbook: はてな研修用教科書](https://github.com/hatena/Hatena-Textbook)
- [Perl 入学式 | Perl Entrance](https://www.perl-entrance.org/handout.html#handout-2019)
- [どうしても業務命令で Perl を使わざるを得ないあなたに送る、IDE（IntelliJ）で Perl を殴る方法。](https://bbq-all-stars.github.io/2019/05/01/intellij-perl-environment.html)
- [macOS(mojave)に DBD::mysql をインストールしたいっ！](https://blog.mitsuto.com/macos-mojave-perl-dbd-mysql)
- [Perl の勘所をマスターしよう! コンテキストとリファレンスを我が物に!](https://www.slideshare.net/KondoYoshiyuki/yapc2012-20120929)
- [Perl と型とコンテキスト](https://qiita.com/karupanerura/items/361b620a123d80ad9fbe)
- [Perl 基礎入門](http://www.kent-web.com/perl/)
- [Perl5 plugins for IntelliJ IDEA](https://github.com/Camelcade/Perl5-IDEA)

### Rust

- [Rust の最初のステップ](https://docs.microsoft.com/ja-jp/learn/paths/rust-first-steps/)
- [Rust Cookbook for Beginners](https://caddi.tech/archives/2381)
- [Rust Design Patterns](https://rust-unofficial.github.io/patterns/)
- [Rust を始めるための資料集](https://blog-dry.com/entry/2021/01/23/141936)
- [時間がかかる複数の CLI タスクを Rust 製ツールの Pueue で管理する](https://zenn.dev/gosarami/articles/b777836712294dc22bd4)

### C++

- [C++11 スマートポインタ入門](https://qiita.com/hmito/items/db3b14917120b285112f)

## 設計

### Architecture

- [バックエンドに興味を持つ学生にオススメするクラウド系メインのリンク 10 選](https://y-ohgi.blog/entry/2021/01/05/%E3%83%90%E3%83%83%E3%82%AF%E3%82%A8%E3%83%B3%E3%83%89%E3%81%AB%E8%88%88%E5%91%B3%E3%82%92%E6%8C%81%E3%81%A4%E5%AD%A6%E7%94%9F%E3%81%AB%E3%82%AA%E3%82%B9%E3%82%B9%E3%83%A1%E3%81%99%E3%82%8B%E3%83%AA%E3%83%B3)
- [クラウド設計パターン](https://docs.microsoft.com/ja-jp/azure/architecture/patterns/)
- [Google Cloud solutions](https://cloud.google.com/solutions)
- [ゲームサーバーの「割り当て」設計](https://zenn.dev/castaneai/articles/allocating-game-servers)

### Application Architecture

- [初期に人数が多すぎると、プロジェクトは重要な設計作業を省略せざるをえない](https://twitter.com/demarco_bot_jp/status/1472870398476046340)
- [技術的負債は開発者体験を悪化させる](https://mtx2s.hatenablog.com/entry/2021/12/21/084227)
- [ソフトウェア設計原則は変更容易性に通ず](https://blog.shin1x1.com/entry/all-principals-of-software-design-lead-to-etc)
- [ソフトウェア設計の Why & What & How](https://www.wantedly.com/companies/wantedly/post_articles/327621)
- [決済システムの残高管理周りの DB 設計と戦略 - カンムテックブログ](https://b.hatena.ne.jp/entry/s/tech.kanmu.co.jp/entry/2021/06/29/131649)

### DDD

- [ドメイン駆動設計で保守性をあげたリニューアル事例 〜 ショッピングクーポンの設計紹介](https://techblog.yahoo.co.jp/entry/2021011230061115/)
- [ユビキタス言語策定したらビジネス理解がめっちゃ捗った話](https://zenn.dev/leaner_tech/articles/20210922-ubiquitous-language)
- [■DDD(ドメイン駆動設計)、理念に大賛成、実装に大反対。](https://anond.hatelabo.jp/20210425022947)
- [ドメイン駆動設計の集約のわかりにくさの原因と集約を理解するためのヒント](https://masuda220.hatenablog.com/entry/2021/05/07/142824)
- [スケールする要求を支える仕様の「意図」と「直交性」](https://qiita.com/hirokidaichi/items/61ad129eae43771d0fc3)
- [実は DDD ってしっくりこないんです](https://hachibeechan.hateblo.jp/entry/domain-driven-deskwork)

### UML

- [PlantUML：見た目系 Tips 覚書](https://zenn.dev/kazuhito/articles/33815f6af2157a)

## インフラ

### Infra

- [IaC 化されていないリソースを driftctl で検知する](https://zenn.dev/gosarami/articles/dd938001eac988e44d11)
- [インフラのボトルネックについて知る](https://tikasan.hatenablog.com/entry/2018/06/05/082728)
- [DevOps の能力 | Google Cloud](https://cloud.google.com/architecture/devops/capabilities?hl=ja)

### Nginx

- [Nginx の Ratelimit 発動時に、安定したアクセスを提供する ngx-smart-ratelimit を開発しました](https://ten-snapon.com/archives/2701)

### Docker

- [軽量 Docker イメージに安易に Alpine を使うのはやめたほうがいいという話](https://blog.inductor.me/entry/alpine-not-recommended)
- [Docker イメージビルド時の秘密情報の扱い方に関するまとめ](https://terashim.com/posts/docker-build-secret/)

### Kubernetes

- [okteto で無料 Kubernetes を遊び尽くす](https://zenn.dev/aoi/articles/9ff83fe3c2e58d)

### SRE

- [入門監視や SRE 本に学ぶ障害対応フォーメーション](https://blog.song.mu/entry/incident-formation)

### ISUCON

- [ISUCON の最初の 30 分にやること[計測編]](https://nasaemon.hateblo.jp/entry/isucon_joban)
- [MySQL クエリーキャッシュ 【チューニング方法とかも】](http://qiita.com/ryurock/items/9f561e486bfba4221747)
- [インフラエンジニアに便利な負荷計測コマンド【基礎編】](https://hatebu.me/entry/linuxcommand)

### gRPC

- [Go でミドルウェアとインターセプターのテストをする方法](https://zenn.dev/glassonion1/articles/d4f434cd3cb58c)

### Microservice

- [[翻訳] Shopify におけるモジュラモノリスへの移行](https://qiita.com/tkyowa/items/ae9fa550237cb6f48318)
- [スタートアップのためのマイクロサービス入門](https://aws.amazon.com/jp/blogs/startup/techblog-microservices-introduction/)

## クラウド

### AWS

- [GitHub Actions に「強い」AWS の権限を渡したい ~作戦 3 - AssumeRole with Google ID Token ~](https://techblog.kayac.com/assume-role-with-google-id-token)
- [形で考えるサーバーレス設計](https://aws.amazon.com/jp/serverless/patterns/serverless-pattern/)
- [20190305 AWS Black Belt Online Seminar Amazon EC2](https://www.slideshare.net/AmazonWebServicesJapan/20190305-aws-black-belt-online-seminar-amazon-ec2)
- [[AWS Black Belt Online Seminar] Amazon Aurora MySQL Compatible Edition ユースケース毎のスケーリング手法 資料及び QA 公開](https://aws.amazon.com/jp/blogs/news/webinar-bb-amazon-aurora-mysql-2020/)
- [詳細: Fargate データプレーン](https://aws.amazon.com/jp/blogs/news/under-the-hood-fargate-data-plane/)
- [Event Source Data Classes](https://awslabs.github.io/aws-lambda-powertools-python/latest/utilities/data_classes/)
- [[AWS Black Belt Online Seminar] 形で考えるサーバーレス設計 サーバーレスユースケースパターン解説 資料及び QA 公開](https://aws.amazon.com/jp/blogs/news/webinar-bb-severless_usecase_pattern-2020/)
- [Black Belt Online Seminar AWS Amazon RDS](https://www.slideshare.net/AmazonWebServicesJapan/black-belt-online-seminar-aws-amazon-rds)
- [AWS Well-Architected](https://aws.amazon.com/jp/architecture/well-architected/)
- [AWS のグローバル IP の空間はインターネットなのか？](https://tech.nri-net.com/entry/2021/05/10/085654)
- [AWS DevDay Online Japan に「AWS CDK はどう使いこなすのか、初期開発から運用までのノウハウ」というタイトルで登壇しました #AWSDevDay](https://dev.classmethod.jp/articles/aws-devday-online-japan-know-how-from-initial-development-to-operation-on-how-to-use-aws-cdk/)
- [AWS IAM User アクセスキーローテーションの自動化](https://engineering.dena.com/blog/2021/12/aws-iam-user-credential-auto-rotation/)
- [Docker Compose と Amazon ECS を利用したソフトウェアデリバリの自動化](https://aws.amazon.com/jp/blogs/news/automated-software-delivery-using-docker-compose-and-amazon-ecs/)
- [スタートアップのためのコンテナ入門 – AWS Fargate 編](https://aws.amazon.com/jp/blogs/startup/techblog-container-fargate-1/)
- [AWS の Parameter Store と Secrets Manager、結局どちらを使えばいいのか？比較](https://qiita.com/tomoya_oka/items/a3dd44879eea0d1e3ef5)
- [Amazon ECS でのコンテナデプロイの高速化](https://toris.io/2021/04/speeding-up-amazon-ecs-container-deployments/)
- [IAM ロールの PassRole と AssumeRole をもう二度と忘れないために絵を描いてみた](https://dev.classmethod.jp/articles/iam-role-passrole-assumerole/)
- [AWS-01：今だからこそ知りたい、AWS のデータベース 2020 基礎](https://resources.awscloud.com/aws-summit-online-japan-2020-on-demand-aws-sessions-40931/aws-01-aws-summit-online-2020-720p)
- [20200630 AWS Black Belt Online Seminar Amazon Cognito](https://www.slideshare.net/AmazonWebServicesJapan/20200630-aws-black-belt-online-seminar-amazon-cognito)

### ECS

- [ECS とローカル間でファイルをコピーしたり、対話形式で run-task や exec できるデバッグ特化の CLI ツールを作りました](https://zenn.dev/yukiarrr/articles/b2d3f8392ff56a)
- [Amazon ECS タスクのイベントとログを時系列で出す tracer を作った](https://techblog.kayac.com/ecs-task-tracer)
- [AWS Black Belt コンテナシリーズのあるきかた 2021 年まとめ](https://aws.amazon.com/jp/blogs/news/aws-black-belt-container-2021-eoy/)
- [ECS + firelens で大きなサイズのログを NewRelic に転送する](https://inside.dmm.com/entry/2021/12/07/firelens-log-newrelic)
- [Amazon ECS と AWS Fargate を利用した Twelve-Factor Apps の開発](https://aws.amazon.com/jp/blogs/news/developing-twelve-factor-apps-using-amazon-ecs-and-aws-fargate/)

### Terraform

- [Terraform 職人入門: 日々の運用で学んだ知見を淡々とまとめる](https://qiita.com/minamijoyo/items/1f57c62bed781ab8f4d7)
- [AWS CDK と Terraform を n 個の観点で徹底比較/compare-aws-cdk-and-terraform-from-n-perspectives](https://speakerdeck.com/tomoki10/compare-aws-cdk-and-terraform-from-n-perspectives)
- [Terraform 職人再入門 2020](https://qiita.com/minamijoyo/items/3a7467f70d145ac03324)
- [Terraform の state 操作を git にコミットしたくて tfmigrate というツールを書いた](https://qiita.com/minamijoyo/items/670eb100552b0834dd5e)

### CDN

- [CDN のエッジで実行する系が面白い](https://yusukebe.com/posts/2021/functions-at-edge/)

### PubSub

- [Choosing between Cloud Tasks and Pub/Sub](https://cloud.google.com/tasks/docs/comp-pub-sub)

### Cognito

- [[AWS Black Belt Online Seminar] Amazon Cognito 資料及び QA 公開](https://aws.amazon.com/jp/blogs/news/webinar-bb-amazon-cognito-2020/)

### Deploy

- [Cloud Deploy ウォークスルー](https://rnakamaru.medium.com/cloud-deploy-397c8a7c68c0)

### CircleCI

- [Dynamic Configuration を使って.circleci/config.yml を分割する](https://zenn.dev/kesin11/articles/96f0947583f34d)

## データベース

### MySQL

- [データベースを自動でチューニングしてくれるサービス「OtterTune」](https://gigazine.net/news/20211020-ottertune/)
- [DB 変更リリースの停止時間を最小化するには？「DevOps with Database on AWS」 #AWSDevDay](https://dev.classmethod.jp/articles/devops-with-database/)
- [Aurora MySQL のバックアップは本当にそれでいいのだろうか？](https://developers.cyberagent.co.jp/blog/archives/29925/)
- [ALTER TABLE を上手に使いこなそう。](http://nippondanji.blogspot.com/2009/05/alter-table.html)
- [facebook / mysql-5.6](https://github.com/facebook/mysql-5.6)
- [pingcap/parser (MySQL 互換) で SQL を手軽に解析](https://developers.freee.co.jp/entry/parse-sql-with-pingcapparser)
- [トランザクションの分離レベルで出てくる用語](https://christina04.hatenablog.com/entry/transaction-isolation-level)
- [MySQL 8.0 リファレンスマニュアル](https://dev.mysql.com/doc/refman/8.0/ja/innodb-online-ddl.html)
- [MySQL でプライマリキーを UUID にする前に知っておいて欲しいこと](https://techblog.raccoon.ne.jp/archives/1627262796.html)

### TiDB

- [TiDB on AWS EKS 〜DMM 動画の PoC レポート〜](https://inside.dmm.com/entry/2021/12/12/tidb-on-aws-eks-poc-report)

## 技術全般

### Auth

- [セキュアなトークン管理方法](https://christina04.hatenablog.com/entry/secure-token-management)
- [『クラウドを支えるこれからの暗号技術』](https://herumi.github.io/ango/)
- [ユーザー アカウント、認証、パスワード管理に関する 13 のベスト プラクティス 2021 年版](https://cloud.google.com/blog/ja/products/identity-security/account-authentication-and-password-management-best-practices/)
- [ID 連携の標準化仕様紹介とセキュアな実装のためのアプローチ ~ 2021](https://ritou.hatenablog.com/entry/2021/09/05/100000)
- [Digital Identity 技術勉強会 #iddance Advent Calendar 2020](https://qiita.com/advent-calendar/2020/iddance)
- [ソフトウェア２段階認証](https://gist.github.com/asufana/daaa0477df93a5a2870c)
- [認証と認可の超サマリ　 OAuth とか OpenID Connect とか SAML とかをまとめてざっと把握する本](https://zenn.dev/suzuki_hoge/books/2021-05-authentication-and-authorization-0259d3f)
- [ID Token and Access Token: What Is the Difference?](https://auth0.com/blog/id-token-access-token-what-is-the-difference/)
- [図解 DPoP (OAuth アクセストークンのセキュリティ向上策の一つ)](https://qiita.com/TakahikoKawasaki/items/34c82fb5c0595b6fc289)
- [完全無料の IDaaS？？Google Cloud Identity Free を試してみる](https://okash1n.blog/try-google-cloud-identity-free-b4d9be399bd9)
- [Digital Authentication Guideline](https://openid-foundation-japan.github.io/index.ja.html)
- [全員が OAuth 2.0 を理解しているチームの作り方 #devio2021](https://dev.classmethod.jp/articles/devio2021-learning-oauth/)
- [OpenID Foundation Japan](https://www.openid.or.jp/document/)
- [SPA でのバックエンド認証用トークンの管理方法に関する考察](https://qiita.com/unhurried/items/e9f751dcdfc0900947ee)

### Security

- [Spectre の脅威とウェブサイトが設定すべきヘッダーについて](https://blog.agektmr.com/2021/11/browser-security.html)
- [SPA セキュリティ入門～ PHP Conference Japan 2021](https://www.slideshare.net/ockeghem/phpconf2021spasecurity)
- [Qiita や Zenn よりも便利？ IPA の資料を読もう!](https://zenn.dev/koduki/articles/d36e18c41b4bd0)
- [Introduction \- OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/index.html)

### JWT

- [どうしてリスクアセスメントせずに JWT をセッションに使っちゃうわけ？](https://co3k.org/blog/why-do-you-use-jwt-for-session)

### UUID

- [ユースケースに応じたユニークな ID の生成](https://christina04.hatenablog.com/entry/golang-uuid)

### Git

- [git worktree コマンドを使って複数ブランチを並行して操作する](https://kakakakakku.hatenablog.com/entry/2021/04/15/092256)
- [Git リポジトリ内を grep する git grep はシンプルで超便利](https://dev.classmethod.jp/articles/useful-git-grep-command/)
- [大きな Git リポジトリをクローンするときの工夫を図解します](https://swet.dena.com/entry/2021/07/12/120000)
- [git bisect で問題箇所を特定する](https://qiita.com/usamik26/items/cce867b3b139ea5568a6)
- [GitHub の GPG Key を設定する](https://star-zero.medium.com/github%E3%81%AEgpg-key%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B-70e22874e533)

### Cookie

- [FLoC とはなにか](https://jovi0608.hatenablog.com/entry/2021/05/06/160046)
- [same-site/cross-site, same-origin/cross-origin をちゃんと理解する](https://zenn.dev/agektmr/articles/f8dcd345a88c97)

### Haskell

- [Haskell 入門](http://lotz84.github.io/haskell/tutorial.html)

## Web フロントエンド

### TypeScript

- [TypeScript のエラーハンドリングを考える](https://qiita.com/frozenbonito/items/e708dfb3ab7c1fd3824d)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

### React

- [React で生 HTML を自由自在に加工する](https://kray.jp/blog/react-html-parser/)
- [React, TypeScript, and TDD](https://www.jetbrains.com/webstorm/guide/tutorials/react_typescript_tdd/)

### Nuxt.js

- [Nuxt 3 を今すぐオススメしたい 15 のポイント](https://zenn.dev/ytr0903/articles/d0a91f6180d34e)

### Next

- [いろいろな .config.js で型の補完を効かせる方法まとめ](https://zenn.dev/jay_es/articles/2021-04-22-config-js)

### Deno

- [Deno から npm パッケージを使用するノウハウ](https://zenn.dev/uki00a/articles/how-to-use-npm-packages-in-deno)

### Frontend

- [Safari･Chrome･Firefox でありがちなバグの対処法について(主に CSS)](https://irokoto.co.jp/blog/20201228/post-17)

## 開発全般

### Development

- [エンジニアのための技術選定のポイントとやり方](https://product-development.io/posts/criteria-for-selecting-technologies)
- [How to use HTTPS for local development](https://web.dev/how-to-use-local-https/)
- [新しくプロダクト開発に入ったときにやっていること](https://wapa5pow.com/posts/2021-03-31--day-one-in-project)
- [知らない Web アプリケーションの開発に途中から JOIN したとき、どこから切り込むか？ / PHPerKaigi 2020](https://speakerdeck.com/k1low/phperkaigi-2020)
- [新しくプログラミング言語に入門するときの流れ](https://bufferings.hatenablog.com/entry/2021/12/24/004608)
- [大事ではないことを大事だと錯覚した結果、オーバーエンジニアリングになる](https://i2key.hateblo.jp/entry/2021/12/25/101957)
- [ヤフーでは開発迅速性と品質のバランスをどう取ってるか](https://techblog.yahoo.co.jp/entry/2021121430233793/)
- [そのシャッフル、本当にシャッフルですか？何気ない落とし穴にハマった話](https://devblog.thebase.in/entry/2021/03/10/110000)
- [Pull Request から社内全チームの開発パフォーマンス指標を可視化し、開発チーム改善に活かそう](https://developer.hatenastaff.com/entry/2021/03/04/093000)

### Docs

- [質の高い技術文書を書く方法](https://blog.riywo.com/2021/01/how-to-write-high-quality-technical-doc/)
- [ユビーが長期に渡ってソフトウェアを進化させ続けるためのドキュメンテーションプラクティス](https://zenn.dev/souppower/articles/bfdf79069ae9a7)
- [Design Docs への思い](https://nhiroki.jp/2021/03/31/design-docs)

### Education

- [List of Free Learning Resources In Many Languages](https://github.com/EbookFoundation/free-programming-books)
- [研修資料まとめ.md](https://gist.github.com/gcchaan/02f4746a323acac4095c30e0783a3912)
- [リクルートテクノロジーズ　エンジニアコース新人研修の内容を公開します！（2019 年度版）](https://recruit-tech.co.jp/blog/2019/07/02/rtech_bootcamp_2019/)

### Feature Flag

- [フィーチャーフラグ（Feature Flag）はなぜ必要なのか？](https://codezine.jp/article/detail/14114)

### i18n

- [ページのローカライズ版について Google に知らせる](https://developers.google.com/search/docs/advanced/crawling/localized-versions?hl=ja)

### Credentials

- [1Password に保存しているクレデンシャルを環境変数として利用するためのツールを作った](https://blog.ssrf.in/post/set-the-credetnial-in-1password-as-an-environment/)

### GitHub

- [GitHub Actions で Dependabot のプルリクエストの滞留を防ぐ仕組みづくり](https://zenn.dev/ryo_kawamata/articles/improve-dependabot-pr)

### JetBrains

- [忙しい人のための IntelliJ IDEA ショートカット集（´-`）](https://qiita.com/yoppe/items/f7cbeb825c071691d3f2)

### Test

- [テストを書くか書かないかの状況判断 / Deciding whether to write tests - DeNA Tech Talk](https://speakerdeck.com/twada/deciding-whether-to-write-tests-dena-tech-talk)

## プロダクト開発

### Product

- [UX ライターが解説する超実践的 UX ライティング入門｜ nao](https://note.com/miyaccchi/n/n71945eaf38a5)
- [【翻訳】 図解 プロダクトづくりの構造](https://ykmc09.hateblo.jp/entry/2021/04/13/091443)
- [無料プランは百害あって一利なし](https://qiita.com/rana_kualu/items/4d43fbbbc32a122e7231)
- [【CEDEC 2018】明快で軽快！ Nintendo Switch の UI を触るだけで楽しい理由](https://game.watch.impress.co.jp/docs/news/1139303.html)
- [プロダクト・ポートフォリオ・マネジメント](https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%83%80%E3%82%AF%E3%83%88%E3%83%BB%E3%83%9D%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%AA%E3%82%AA%E3%83%BB%E3%83%9E%E3%83%8D%E3%82%B8%E3%83%A1%E3%83%B3%E3%83%88)

### Design

- [デザイナーじゃなくても知っておきたい色と配色の基本](https://baigie.me/officialblog/2021/01/27/color_theory/)
- [Web デザインの参考になるギャラリーサイト 11 選](https://pulpxstyle.com/webdesigngallery/)

## ソフトスキル

### Management

- [後輩が自走できるようにサポートするぞー](https://bufferings.hatenablog.com/entry/2021/05/04/193159)
- [人は常に本末転倒している ~私の PM 論~](https://developers.freee.co.jp/entry/2021/12/07/100000)
- [技術的に難しいことを力技でやってしまうこと](https://www.orangeitems.com/entry/2021/03/09/170148)
- [リーンスタートアップの限界への雑感](https://blog.takaumada.com/entry/limitation-of-lean-startup)
- [事業をスケールさせるエンジニアリング〜技術のコモディティ化にエンジニアは敗北する〜](https://inside.dmm.com/entry/2021/12/01/connecting-business-engineering)
- [プロダクトの強い軸を作るために「大切なものランキング」を作ろう｜ Tably ｜ note](https://note.com/tably/n/n64eacb97f55b)
- [仕事のインパクトを大きくしようとすると人を巻き込む必要がある](https://konifar-zatsu.hatenadiary.jp/entry/2021/11/17/193247)
- [Engineering Manager をやめた](https://konifar.hatenablog.com/entry/2021/12/02/000210)
- [ペア制度を導入して、開発チーム内の相談しやすさ向上・知見展開・透明性向上を狙う](https://blog.shibayu36.org/entry/2021/08/12/173000)
- [Atomic Scrum 個人の生産性を最大化する方法](https://speakerdeck.com/raykataoka/atomic-scrum-ge-ren-falsesheng-chan-xing-wozui-da-hua-surufang-fa)
- [No を伝える技術 #pmconf2021](https://speakerdeck.com/aki_i/nowochuan-eruji-shu-number-pmconf2021)
- [なぜ、ソフトウェアプロジェクトは人数を増やしても上手くいかないのか](https://qiita.com/hirokidaichi/items/7f7f7881acba9302301f)
- [Culture \| メルカリエンジニアリング](https://engineering.mercari.com/culture/)
- [なぜスクラムチームをスケールしたくなるのか](https://daiksy.hatenablog.jp/entry/2021/02/05/104829)
- [かつて EM をやりたくなかった俺たちへ](https://naopr.hatenablog.com/entry/2021/12/02/000008)
- [言いたいことを言える場の設計](https://konifar-zatsu.hatenadiary.jp/entry/2021/03/29/101243)
- [「何か質問や意見ありますか」の後の無言対策](https://konifar-zatsu.hatenadiary.jp/entry/2021/05/12/232722)
- [Engineering Manager の役割を無くしてみた](https://hackerslab.aktsk.jp/2021/12/22/070000)
- [自走できるエンジニアとは](https://zenn.dev/erukiti/articles/self-running)
- [プロダクトマネジメント入門](https://product-development.io/guides/management-basics)
- [プロジェクトをリードする技術](https://kakakakakku.hatenablog.com/entry/2018/04/23/223304)
- [KPT の K がいまいち膨らまないチームに贈るパワフルな質問](https://yigarashi.hatenablog.com/entry/kpt-powerful-question)
- [5~8 人の Backend チーム編成を目指そう](https://engineering.mercari.com/blog/entry/20211225-size-backend-team-to-5-to-8-members/)
- [意見を言ってくれた人を孤立させない立ち振る舞い](https://konifar-zatsu.hatenadiary.jp/entry/2021/01/07/201230)
- [NTT Com オンボーディングハンドブック](https://nttcom.github.io/onboarding-handbook/)
- [メンバーが増えると出力が落ちる「リンゲルマン効果」と対策としての DRI](https://coralcap.co/2021/04/dri/)
- [振り返りで積み上げた開発プラクティス（2020 年総まとめ）](https://devblog.thebase.in/entry/bank-practices-2020)
- [再現性と質を高める「意思決定のフロー化」 ―― 開発畑のプロダクトマネージャーの失敗から学べ](https://productzine.jp/article/detail/801)
- [10 年エンジニアリングマネージャーをやって気づいた 4 つの大事なポイント 【EM はもっと自由でいい】](https://tech-blog.monotaro.com/entry/2021/12/22/090000)
- [スクラムマスターって何をする人なの？](https://daiksy.hatenablog.jp/entry/2021/12/02/083000)
- [エンジニアリングマネージャーとしてどんなことをしているのか？](https://tune.hatenadiary.jp/entry/2021/09/05/165453)
- [体制を考えるときに意識していること](https://onk.hatenablog.jp/entry/2021/08/07/133352)
- [キャリアキーノートとはなにか](http://blog.hifumi.info/2016/06/20/career-keynote/)
- [アジャイル開発におけるスケジュールを継続的に見直す](https://creators-note.chatwork.com/entry/2021/12/15/085108)
- [アーキテクトを目指すエンジニアの最短ルート](https://tech.bm-sms.co.jp/entry/2021/03/09/090000)
- [良い上司の条件・悪い上司の条件](https://baigie.me/officialblog/2021/06/29/good_leader_bad_leader/)
- [はじめてのエンジニア 1on1 メンター](https://yigarashi.hatenablog.com/entry/introduction-to-engineer-1on1)
- [組織デザイン概論 - WDA 研究会 191121](https://speakerdeck.com/tomomina/zu-zhi-dezaingai-lun-wdayan-jiu-hui-191121)

### Career

- [圧倒的に成長している時は実感がない](https://konifar.hatenablog.com/entry/2015/05/17/224120)
- [Dropbox Engineering Career Framework](https://dropbox.github.io/dbx-career-framework/overview.html)
- [エンジニアリングマネージャーを目指す若者の戦略](https://yigarashi.hatenablog.com/entry/load-to-em)
- [評価の満足度を劇的にあげた秘訣。Continuous Feedback のすすめ](https://engineering.mercari.com/blog/entry/20211206-15c9c9dc16/)
- [チームにいると頼りになるソフトウェアエンジニア](https://nhiroki.jp/2021/04/30/reliable-software-engineers)

### Values

- [意見を言う前に感謝や謝罪を伝えて感情の摩擦を減らす](https://konifar-zatsu.hatenadiary.jp/entry/2020/03/12/104716)

## クライアント

### Electron

- [Next.js + Electron がとても簡単になっていた](https://zenn.dev/erukiti/articles/933fc127f751aef45b4f)

### Flutter

- [Dart/Flutter の静的解析強化のススメ](https://medium.com/flutter-jp/analysis-b8dbb19d3978)

### Unity

- [push したら自動で Unity ビルドが走る人権環境を手に入れる](https://blog.kyubuns.dev/entry/2021/07/04/212005)

## 日常生活

### 引っ越し

- [ソフトウェアエンジニア、建売を買う](https://kumagi.hatenablog.com/entry/kodate-katta)
- [ソフトウェアエンジニア、家を買う](https://hichihara.hatenablog.com/entry/2021/07/26/070000)
- [UR 賃貸住宅が最強な理由と優先的な空室の見つけ方](http://www.akiyan.com/blog/archives/2009/03/10gamehard.html)
- [都内に引っ越す際の物件選びの話](https://shopetan.hatenablog.com/entry/2018/12/26/214534)
- [マンション購入記(勢いで購入を決めるまで)](https://songmu.jp/riji/entry/2021-03-16-bought-a-condominium.html)
- [上京したて新卒 1 年目エンジニアの生活費を公開します｜ぽこひで｜ note](https://note.com/pokohide/n/n640b2152675e)
- [地方で働こうと思ったあなたへ、移住時に検討すべき 5 つのこと](https://developers.freee.co.jp/entry/five-things-you-should-consider-when-moving-countryside)
- [モダンインテリア 6 つのスタイル&真似たいおしゃれな厳選 47 実例](https://interior-supply.jp/style/modern-interior/)
- [アパートは光回線に対応してる？ネットで確認する方法](https://gesyuku-internet.com/hikari-check/)
- [中古マンションを契約したので備忘録｜ dyoshimitsu ｜ note](https://note.com/dyoshimitsu/n/nf7f86684b583)
- [「モノトーン」に徹底してこだわる。大人のひとり暮らしインテリア](https://www.goodrooms.jp/journal/?p=31546)
- [物件契約時の初期費用を交渉したときのメモ](https://mrtry.hatenablog.jp/entry/2018/06/19/134930)
- [無垢フローリングに雰囲気の良い木の家具でつくる。小さなワンルームの暮らし方](https://www.goodrooms.jp/journal/?p=42769)
- [一人暮らし準備](https://gakumado.mynavi.jp/torigura/preparation)
- [満足度の高い引越しのためにやったこと](https://ohbarye.hatenablog.jp/entry/2017/06/10/212130)
- [物件探し確認事項](https://pokutuna.hatenablog.com/entry/2014/06/30/233504)
- [満足できる物件を探すために僕がした事](https://fromatom.hatenablog.com/entry/2015/01/28/010843)
- [持ち家派ではなかったけど家持ちになった](https://lestrrat.medium.com/%E6%8C%81%E3%81%A1%E5%AE%B6%E6%B4%BE%E3%81%A7%E3%81%AF%E3%81%AA%E3%81%8B%E3%81%A3%E3%81%9F%E3%81%91%E3%81%A9%E5%AE%B6%E6%8C%81%E3%81%A1%E3%81%AB%E3%81%AA%E3%81%A3%E3%81%9F-f50c4c3a6dc0)
- [そろそろ引っ越しシーズンが近づいてきたので、計 10 回以上の引っ越し経験で培った「良い物件の見つけ方」をシェアします。](https://twitter.com/tottokolancer/status/1348621522504536067?s=12)

### Investment

- [ETF（上場投資信託）ゼミ](https://nextfunds.jp/semi/)
- [失業したら iDeCo の落とし穴にハマった件](https://aikawame.hateblo.jp/entry/2021/10/29/%E5%A4%B1%E6%A5%AD%E3%81%97%E3%81%9F%E3%82%89iDeCo%E3%81%AE%E8%90%BD%E3%81%A8%E3%81%97%E7%A9%B4%E3%81%AB%E3%83%8F%E3%83%9E%E3%81%A3%E3%81%9F%E4%BB%B6)

### Food

- [千駄木腰塚　自家製コンビーフ　 400g](https://www.koshizuka.jp/c/gr42/d-konbiifu400)

### Insurance

- [病気に備える保険にはいつ加入すべきか？ 罹患の累積確率と許容リスクから考える](https://aotamasaki.hatenablog.com/entry/when_do_i_need_insurance)

### Sake

- [富翁 純米吟醸 ひやおろし｜日本酒｜京都・伏見の清酒「富翁」醸造元（株）北川本家](https://www.tomio-sake.co.jp/syouhin/nihonshu/11.html)

### Music

- [【DJ の基礎】第 4 回 ハーモニック・ミキシング とは](https://myunsic-records.com/2019/02/10/dj04/)

## その他

### 個人開発

- [14 年かかった！個人開発で月収 100 万達成した話｜ SiRO ｜ note](https://note.com/codemesi/n/n122513c4a453)

- [【個人開発】開発プロセスが何より大事だった ~ タグ 1 つでブログを収益化できる投げ銭サービス ~](https://qiita.com/yoshinori_hisakawa/items/caaf6acd7d979b7d7c01)

- [8 年間で 20 以上の Web サービスを作ってきて、ほとんど失敗した理由｜ ren@Anyflow Inc.｜ note](https://note.com/lotus/n/n0105dd7226ee)

- [【個人開発向け】失敗の経験と成功した人から学んだこと 10 選](https://qiita.com/alclimb/items/556370ce8cc72dac9e39)

### Job Hunting

- [Tech Interview Handbook](https://techinterviewhandbook.org/introduction)
- [エンジニア採用の方法とか、技術組織の作り方とか｜いわーく｜ note](https://note.com/iwark02/n/n9712d4d3f2d0)

### Lab

- [研究発表でのよくある質問集](http://kanamori.cs.tsukuba.ac.jp/docs/presentation_faqs.html)

### English

- [ソフトウェアエンジニアに最低限必要な英語力](https://blog.takanabe.tokyo/2021/12/1338a4bc-1a89-41bb-bbaa-64546af7cfc2/)

## 終わりに

「読んだっけ？」って記事が沢山見つかって、記憶力が心配になりました。
