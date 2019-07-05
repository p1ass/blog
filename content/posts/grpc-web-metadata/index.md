---
title: "gRPC-Webでメタデータ付きのリクエストを送信する"
date: 2019-04-29T18:47:48+09:00
draft: false
categories:
- 開発
tags:
- gRPC-Web
- Go
---


こんにちは、ぷらす([@plus_kyoto](https://twitter.com/plus_kyoto))です。

最近、gRPC-Webについて調査しているのですが、その際にメタデータ付きのリクエストを送る方法に関するドキュメントが一切ないことに気づきました。

分かってしまえば簡単なのですが、結構つまづいたので紹介します。

なお、サンプルコードはgRPC-Web公式のHello Worldガイドを使用します。

{{< ex-link url="https://github.com/grpc/grpc-web/tree/master/net/grpc/gateway/examples/helloworld" >}}

<!--more-->

## 方法

### STEP1 `enovy.yaml`の`allow_headers`にメタデータのkeyを設定する

gRPC-Webを使うときは、EnvoyまたはNginxを通してリクエストをプロキシする必要があります。ドキュメントを見る限りEnvoyを使う方が推奨されているっぽいので、Envoyを使ってプロキシサーバを建てます。

`envoy.yaml`のcorsを設定する部分で`allow_headers`に使いたいメタデータ (ex. `x-custom-metadata`)を追加します。

これによって、メタデータが消えることなくgRPCサーバまで届きます。

{{< highlight yaml >}}
admin:
  access_log_path: /tmp/admin_access.log
  address:
    socket_address: { address: 0.0.0.0, port_value: 9901 }

static_resources:
  listeners:
  - name: listener_0
    address:
      socket_address: { address: 0.0.0.0, port_value: 8080 }
    filter_chains:
    - filters:
      - name: envoy.http_connection_manager
        config:
          codec_type: auto
          stat_prefix: ingress_http
          route_config:
            name: local_route
            virtual_hosts:
            - name: local_service
              domains: ["*"]
              routes:
              - match: { prefix: "/" }
                route:
                  cluster: greeter_service
                  max_grpc_timeout: 0s
              cors:
                allow_origin:
                - "*"
                allow_methods: GET, PUT, DELETE, POST, OPTIONS
                allow_headers: x-custom-metadata # x-custom-metadataを許可する
                max_age: "1728000"
                enabled: true
          http_filters:
          - name: envoy.grpc_web
          - name: envoy.cors
          - name: envoy.router
  clusters:
  - name: greeter_service
    connect_timeout: 0.25s
    type: logical_dns
    http2_protocol_options: {}
    lb_policy: round_robin
    hosts: [{ socket_address: { address: localhost, port_value: 9090 }}]
{{< / highlight>}}

### STEP2 クライアントサイドでメタデータを付与してリクエストを行う

STEP1で正しくgRPCサーバまでメタデータが届くようになったので、後はクライアントサイドでメタデータを付与してリクエストを行うだけです。

{{< highlight javascript >}}
const {HelloRequest, HelloReply} = require('./helloworld_pb.js');
const {GreeterClient} = require('./helloworld_grpc_web_pb.js');

const client = new GreeterClient('http://localhost:8080');

const request = new HelloRequest();
request.setName('World');

const metadata = {'x-custom-metadata': 'metadata-value'}

// メタデータを付与する
client.sayHello(request, metadata, (err, response) => {
  console.log(response.getMessage());
});
{{< / highlight>}}

## まとめ

gRPC-Webはまだまだ発展途上で情報も少ないですが、確実に使えるものになってきていると思います。

ちらほらとプロダクションで使っているという話を聞く機会も増えてきましたし、皆さんも積極的に使っていきましょう💪
