---
title: "WebサーバをNginxから証明書自動更新に対応したCaddy 2に移行した"
date: 2020-05-11T15:00:00+09:00
draft: false
description: 運用していたWebサーバをNginxから最近v2にメジャーバージョンアップされたCaddyに移行しました。この記事ではCaddyの特徴や移行してみた感想などを書きたいと思います。
categories:
- 開発
tags:
- Caddy
- Nginx
eyecatch: /posts/nginx-to-caddy/ogp.jpg
share: true
---

こんにちは、{{< link href="https://twitter.com/p1ass" text="@p1ass" >}}です。

最近、運用していたWebサーバをNginxからCaddyに移行しました。この記事ではCaddyの特徴や移行してみた感想などを書きたいと思います。

 <!--more-->

## What is Caddy？

CaddyはのデフォルトでHTTPSに対応しているOSSのWebサーバです。

![Caddy](caddy_v2.png)

{{< ex-link url="https://caddyserver.com/" >}}

- GitHub : {{< link href="https://github.com/caddyserver/caddy" text="https://github.com/caddyserver/caddy" >}}
- 公式ドキュメント : {{< link href="https://caddyserver.com/docs" text="https://caddyserver.com/docs" >}}

つい先日(2020/05/04)、v2にメジャーバージョンアップされ{{< link href="https://caddyserver.com/docs/architecture" text="アーキテクチャが刷新されました。" >}}

Caddyは様々な特徴があるのですがいくつかピックアップします。(v2からの新機能というわけではないです。) 

### デフォルトかつ自動でHTTPSに対応

CaddyはLet's Encryptの証明書を自動で取得し、適用してくれます。また、更新の内部で自動で行われるため、ユーザ側が証明書のことを気にする必要がありません。
80から443へのリダイレクトも自動で行われるのでユーザが設定する必要がありません。

Nginxの場合は、これらを実装するために多くのコンフィグを書いていたことを考えると、かなりの作業を省略できます。

### Nginxにあった基本的な機能をカバー

一般的なユースケースで必要となる機能は大体カバーしています。

- リバースプロキシ
- ロードバランス
- 静的ファイルのホスティング
- バーチャルホスト
- リダイレクト
- ヘッダーの付与
- ヘルスチェック
- BASIC認証
- WebSocket
- アクセスログ

他にも面白い機能として、

- マークダウンのレンダリング
- HTTP/3 (experimental)
- デフォルトでJSON形式で標準出力にログ出力

などもあります。

### シンプルに設定を記述できる`Caddyfile`

Caddyの設定は2通りの方法が用意されており、ユーザが用途に合わせて選べるようになってます。

一つ目は `Caddyfile` というファイルで設定する方法で、Nginxのコンフィグに似た書き方で記述できます。

```bash
# https://hoge.p1ass.comにきたリクエストをlocalhost:8080にプロキシ
hoge.p1ass.com {
  reverse_proxy /* localhost:8080
}

# バーチャルホストで複数のドメインを設定できる
fuga.p1ass.com {
  reverse_proxy /* localhost:3000
}
```

後は起動時にファイルを指定すれば完了です。

```bash
$ caddy run --config ./Caddyfile --adapter caddyfile
```

公式で、
> Caddyfiles to be ~15% the size of a less capable nginx.conf!

と謳われているように、Nginxと似た文法ながらもシンプルに記述することが可能です。

### JSON API経由での設定変更

2つ目はAPI経由で設定をアタッチする方法です。
Caddyは80番と443番以外に2019番もListenしていて、管理用のAPIが提供されています。

https://caddyserver.com/docs/api-tutorial

例えば、現在の設定は `GET /config` で取得できます。


```bash
$ curl localhost:2019/config | jq
{
  "apps": {
    "http": {
      "servers": {
        "srv0": {
          "listen": [
            ":443"
          ],
          "routes": [
            {
              "handle": [
                {
                  "handler": "subroute",
                  "routes": [
                    {
                      "handle": [
                        {
                          "handler": "reverse_proxy",
                          "upstreams": [
                            {
                              "dial": "localhost:8080"
                            }
                          ]
                        }
                      ],
                      "match": [
                        {
                          "path": [
                            "/*"
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              "match": [
                {
                  "host": [
                    "hoge.p1ass.com"
                  ]
                }
              ],
              "terminal": true
            },
                        {
              "handle": [
                {
                  "handler": "subroute",
                  "routes": [
                    {
                      "handle": [
                        {
                          "handler": "reverse_proxy",
                          "upstreams": [
                            {
                              "dial": "localhost:3000"
                            }
                          ]
                        }
                      ],
                      "match": [
                        {
                          "path": [
                            "/*"
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              "match": [
                {
                  "host": [
                    "fuga.p1ass.com"
                  ]
                }
              ],
              "terminal": true
            }
          ]
        }
      }
    }
  }
}
```
    
これと同じ形式で `POST /load` にJSONを投げれば動的に設定を変更できます。なお、デフォルトではJSONですが、`Content-Type: text/caddyfile` とすればそのまま`Caddyfile` を投げることもできます。

また、この設定の変更はACIDを保証しています。

> Atomic: Multiple changes in a single request are treated as a single unit; any failed change aborts all the other changes.  
> Consistent: No invalid configurations can be loaded; your server will never break if a problem is detected at config load.  
> Isolated: No config changes rely on another. (It helps that HTTP is a stateless protocol!)  
> Durable: Caddy automatically persists the current, valid configuration to disk and can safely resume it after a power cycle if the --resume flag is used.  

無効な設定がPOSTされたとしてもサーバが止まる心配はありません。

### 使い分け

CI・CDパイプラインに組み込みたいならAPI経由での設定がオススメです。
`Caddyfile`を使うか、JSONを使うかは悩みどころですが、
- 人間にとっての可視性や書きやすさを重視 → `Caddyfile`
- LinterなどをCIで実行したい → JSON

かなぁと個人的に思っています。

## NginxからCaddyへの移行のモチベーション

Caddyへの移行の最も大きなモチベーションは「HTTPSの自動対応」でした。

今まではNginx+certbotという組み合わせで運用していたのですが、証明書のためだけにバッチ処理を走らせるのも面倒で、Nginx単体で完結しないかなと思っていました。

そのNginxもHTTPSに対応するには、実際の動作とはあまり関係のない非本質的な記述を大量に書く必要があります。HTTPSが当たり前になってきたこのご時世に合ってないと感じていました。

その点、Caddyは証明書の更新は内部でやってくれて、設定の記述もシンプルです。

メンテナンス性を考慮するとCaddyは非常に魅力的でした。

## 移行してみた感想

CaddyにはNginxのコンフィグをそのまま読み込むアダプターが存在するのですが、今回は１からでCaddyfileを書きました。

{{< ex-link url="https://github.com/caddyserver/nginx-adapter" >}}

動作に関しては概ね問題ないです。セットアップが完了してから一度もプロセスは死んでないし、メモリリークなどもなさそうです。

そして当初の目論見通り、メンテナンスのしやすさは非常に向上しました。バーチャルホストを新しく切るのに**3行追加するだけ**というのは非常に楽でした。

細かいところで言うと、 `caddy fmt` で `Caddyfile` のフォーマットができるのも良いポイントでした。


## おわりに

- Caddyには便利な機能はたくさん揃っているので、そこまでパフォーマンスが求められない小規模・中規模環境では有用そう。
- 具体的なパフォーマンス計測をしていないので、高負荷環境での導入はちゃんと計測してからのほうが良さそう。
- ここ最近はマネージドなロードバランサーを使うことが多く、Nginxを生で使う機会が減ってきているような気がするが、これはアプリケーション寄りのサーバサイド畑にいるから感じるだけなんだろうか？

## 合わせて読みたい

- [Docker Contextsを使ってDocker Composeをデプロイする際の注意点 - ぷらすのブログ](https://blog.p1ass.com/posts/docker-context/)
