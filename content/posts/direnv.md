---
title: "direnvを使うときは環境変数を.envrcに書くより.envに書いた方が使い勝手が良い"
date: 2019-04-25T18:47:48+09:00
draft: true
---

こんにちは、[@plus_kyoto](https://twitter.com/plus_kyoto)です。  
自分はローカル開発時に、環境変数を設定するためにdirenvを使っています。
その際に、環境変数を`.envrc`に書くより、`.env`に書いた方が諸々の使い勝手が良いと感じたので紹介します。

### tl;dr
- `.env`は汎用性が高いので様々な用途で使い回せる。
- `.envrc`に`dotenv`と記述するだけで、自動的に`.env`ファイルを読み込んでくれるので楽。

<!--more-->

## そもそもdirenvとは

direnvはディレクトリごとに環境変数を設定することができるツールです。  
`.zshrc`などに`eval "$(direnv hook zsh)"`と書くことで、カレントディレクトリに存在する`.envrc`に書かれたスクリプトを実行してくれます。

[https://github.com/direnv/direnv]

例えば、次のように`.envrc`を記述することで、`HOGE`という環境変数を設定することができます。

{{< highlight envrc >}}
export HOGE=hogehoge
{{< / highlight>}}

これがdirenvのREADMEに書かれている使い方です。

## direnvで`.env`を読み込む

さて、環境変数をファイルで管理する際に、次のような書式で書かれた`.env`ファイルが使われることがあります。  

{{< highlight env >}}
HOGE=hogehoge
FUGA=fugafuga
{{< / highlight>}}

`.envrc`と違って`export`は書かず、単に`KEY=VALUE`という形になっています。

direnvでは`.envrc`を以下のように記述することで、**`.env`ファイルを読み込むことができる**ようになります。

{{< highlight envrc >}}
dotenv
{{< / highlight>}}

##  `.env`に書くことで何が嬉しいのか
`.env`は汎用性が高いフォーマットであり、様々な場面で流用することができます。

1つ目の例として、docker-composeが挙げられます。  
docker-composeは以下のように書くことで、コンテナ内に環境変数を流し込むことができます。
その際のフォーマットが`.env`と一致しています。

{{< highlight yaml >}}
version: "3"
services:
  hoge:
    image: python
    restart: always
    env_file: .env
{{< / highlight>}}

これにより、「ずっとコンテナ内で開発してたけど、ローカルで試したいな」と思った時に、(少なくとも環境変数は)楽に移行できます。


2つ目は、エディターのエクステンションと相性が良い点です。  
私は**JetBrains製のIDEを愛している人間**なのですが、IDEでコンパイル・実行するときに`direnv`のフックを発火してくれません。  
そのため、環境変数は別の手段で読み込む必要があります。

幸いにもJetBrains Pluginsには、`.env`ファイルを読み込んでくれるプラグインがあるため、正しく環境変数を読み込むことができます。

[https://plugins.jetbrains.com/plugin/9525--env-files-support]


[https://plugins.jetbrains.com/plugin/7861-envfile]


このように`.env`に環境変数の設定をまとめることで、いい感じに色々な場面で使い回すことができます。  
同じ環境変数を複数箇所で書いていた方は一度試してみてはどうでしょうか？

