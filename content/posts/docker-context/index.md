---
title: Docker Contextsを使ってDocker Composeをデプロイする際の注意点
date: 2020-04-10T16:00:00+09:00
draft: false
description: Docker Contextsを使ってDocker Composeをデプロイする際の注意点やCaddyを使ってユーザのリクエストをリバースプロキシする方法について解説しています。
categories:
- 開発
tags:
- Docker
- VPS
- Caddy
share: true
---

こんにちは、ぷらす({{< link href="https://twitter.com/p1ass" text="@p1ass" >}})です。

先日、{{< link href="https://camphor.connpass.com/event/167947/" text="CAMPHOR- DAY 2020" >}}というオンラインのトークイベントで、「複数サービスを運用しやすい理想のコンテナ環境をVPS上に構築する	」というタイトルで登壇しました。

登壇資料は既にアップロードしていて見られるのですが、端折っている部分の補足をしたいと思います。また、当日頂いた質問についても回答します。


<script async class="speakerdeck-embed" data-id="388f5d3e4da2482ba946db5c2f84d480" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

<!--more-->

## Docker Contextを作る際の注意

### `--default-stack-orchestrator`を指定する必要がある

`docker`コマンドを使用しているときは`--default-stack-orchestrator`を指定しなくても動作しますが、`docker-compose`コマンドだとエラーで落ちてしまいます。swarmに繋いているわけではないですが、値を設定しておく必要があります。

```bash
$ docker context create --help
Usage:  docker context create [OPTIONS] CONTEXT
# 中略
Options:
      --default-stack-orchestrator string \\
         Default orchestrator for stack operations \\
         to use with this context (swarm|kubernetes|all)

$ docker context create --default-stack-orchestrator=swarm \\
 --docker "host=ssh://${SSH_USERNAME}@${SSH_IP}:${SSH_PORT}" remote
$ docker context use remote
```

関連issue :  {{< link href="https://github.com/docker/compose/issues/7319" text="Failed to execute script docker-compose when doing docker-compose up on SSH context" >}}

### SSH Configが使えない

`ssh`コマンドは`~/.ssh/config` に接続先を書くと、`ssh remote`のように簡潔なコマンドで接続することができます。
{{< highlight bash >}}
Host remote
    HostName xx.xx.xx.xx
    User user
    IdentityFile ~/.ssh/id_rsa
{{< /highlight >}}

これを使ってDocker Contextを作成したいと思うところなのですが、この方法は`docker`コマンドでは使えても、`docker-compose`コマンドでは使えません。

{{< highlight bash >}}
$ docker context create --default-stack-orchestrator=swarm \\
 --docker "host=ssh://remote" remote
$ docker context use remote
$ docker --context remote ps # これは動く
$ docker-compose --context remote ps # これはダメ
{{< /highlight >}}

Docker Composeは外部ライブラリを使ってSSH接続しているのですが、それが対応していないっぽいです。（要検証）

CIで回す際はわざわざConfigに書き込むくらいなら直接設定してしまった方が楽なのであまり問題にならないですが、ローカルで試す際は注意です。

### タイムアウト対策

規模感にもよりますが、大きいイメージをビルドする際にタイムアウトで失敗してしまうことがあります。失敗したときは環境変数でタイムアウトまでの時間を伸ばすとうまくいきます。

```bash
$ export COMPOSE_HTTP_TIMEOUT=600 # デフォルトは60秒
```

## Caddyを使ったユーザリクエストのリバースプロキシ

本題からは少し外れるのですが、登壇後に「複数のサブドメインからのユーザリクエストをどのように処理しているか？」という趣旨の質問があったので回答します。

僕はCaddyという**自動でLet's Encryptを用いた証明書の更新をやってくれるGo製のWebサーバ**を使ってリバースプロキシしています。

{{< ex-link url="https://caddyserver.com/" >}}

CaddyはNginxに比べ設定が容易で、confに証明書のパスやHTTPSリダイレクトの記述を書く必要がありません。


```bash
hoge.example.jp {
	reverse_proxy /* hoge-server:8080
}

grafana.example.com {
	reverse_proxy /* grafana:3000
}
```

`Caddyfile`というファイルにこのように書くことで、HTTPSの通信の準備が整います。勿論パフォーマンスを求められる環境ではNginxの方が良いと思いますが、今回はそこまでパフォーマンスを求められてないのでCaddyを使っています。

現在v2のRelease Candidateが出ていて、もうすぐメジャーバージョンアップなので、それを待ってから導入するのも手だと思います。僕は既にv2を使っています。

また、CaddyのコンテナもDocker Context経由でデプロイしています。  
Caddyからリバースプロキシされるコンテナは `caddy-network` という自分で作成したDocker Networkに繋げているので、お互いのコンテナはコンテナ名で名前解決ができるようになっています。
DBなどCaddyから直接繋げてはいけないものは `caddy-network` には含めず、アプリケーションサーバとだけ通信できるNetworkを使って通信しています。

![Caddyのリバースプロキシの図](caddy.jpg)

## おわりに

一度デプロイフローを構築すると非常に便利なので、皆さんもやってみましょう！


