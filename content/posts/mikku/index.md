---
title: Kubernetesのイメージタグの更新を楽にするCLIツールをGoで作った
date: 2019-12-10T00:00:00+09:00
draft: false
description: 今回は自分が作ったp1ass/mikkuというCLIツールを紹介をします。mikkuはセマンティックバージョニングで管理しているリポジトリの管理や、KubenetesのマニフェストにかかれているDockerイメージのタグの更新を楽にするCLIツールです。この記事ではmikkuの特徴、開発することにしたモチベーションや苦労した点などを紹介したいと思います。
categories:
- 開発
tags:
- Go
- mikku
- Kubernetes
- Semantic Versioning
eyecatch: /posts/mikku/ogp.jpg
share: true
---

この記事は{{< link href="https://advent.camph.net/" text="CAMPHOR- Advent Calendar 2019" >}}の11日目の記事です。

## はじめに

こんにちは、{{< link href="https://twitter.com/p1ass" text="@p1ass" >}}です。

今回は自分が作った{{< link href="https://github.com/p1ass/mikku" text="mikku" >}}というCLIツールを紹介をします。

mikkuはセマンティックバージョニングで管理しているリポジトリの管理や、KubenetesのマニフェストにかかれているDockerイメージのタグの更新を楽にするCLIツールです。

{{< ex-link url="https://github.com/p1ass/mikku" >}}

この記事ではmikkuの特徴、開発することにしたモチベーションや苦労した点などを紹介したいと思います。

<!--more-->

## モチベーション

実際に機能などを紹介する前に、なんでこのツールを作ろうと思ったのかのモチベーションについて書いておきます。

### 前提 : Kubernetesの運用方法
私は趣味でGKEを運用していて、個人開発のWebサービスなどをGKE上で動かしています。

マニフェストファイルは1つのリポジトリで中央集権的に管理していて、プロダクトのソースコードは別のリポジトリで管理しています。マイクロサービス的な文脈で言うのであれば、poly repoな構成に近いです。

Helmなどのパッケージマネージャは使っておらず、シンプルなスタイルで運用しています。

イメージのビルドやkubectl applyはCircleCIで行っています。なるべくGitHubとCircleCIで全てが完結するようにしています。

### 2つの辛さ

このような運用をしていたのですが、少し辛さを感じるようになってきました。

１つ目はイメージタグの更新です。

マニフェストファイルには `image: sample-image:v1.0.0` のように書かれていて、これを書き換えることでイメージの更新を行っています。ほんのちょっとの書き換えのたびに毎回PRを作るのは意外と面倒くさいです。

2つ目はGitHub Releaseの作成が面倒くさいことです。

タグを切るのに合わせてGitHub Releaseを作成しているのですが、真面目にChangelogなどを書いています。
しかし、Bug Fixなどで短時間に何回も作業しているとかなり面倒くさいです。

このような問題を解決できるCLIツールが欲しいなと思ったので、{{< link href="https://github.com/p1ass/mikku" text="mikku" >}}を作成しました。

## 機能

{{< link href="https://github.com/p1ass/mikku" text="mikku" >}}の大まかな機能を以下の２つです。

- Kubernetesのマニフェストファイルに書かれているDockerイメージのタグを最新のものに書き換えるPull Requestを作成
- セマンティックバージョニングで管理しているリポジトリのバージョンをあげるGitHub Releaseを作成

	
## インストール方法

`go get` もしくは GitHub Releasesからバイナリをダウンロードしてください。

### go get

{{< highlight bash>}}
$ GO111MODULE=off go get github.com/p1ass/mikku/cmd/mikku
$ mikku --help
{{< /highlight >}}

### GitHub Releases

WindowsやLinuxをお使いの方は `darwin_amd64` をそれぞれ `windows_amd64` か `linux_amd64` に書き換えてください。

検証はMacでしかしていないので、動作は保証していません、、、

{{< highlight console>}}
$ VERSION=0.2.0
$ curl -O -L https://github.com/p1ass/mikku/releases/download/v${VERSION}/mikku_${VERSION}_darwin_amd64.tar.gz
$ tar -zxvf mikku_${VERSION}_darwin_amd64.tar.gz
$ chmod a+x mikku
$ mv mikku /usr/local/bin/mikku
$ mikku --help
{{< /highlight >}}



他のバイナリはGitHub Releasesのページをご覧ください。

{{< ex-link url="https://github.com/p1ass/mikku/releases" >}}



## 使い方

### 事前準備 : GitHubのPersonal access tokenを発行する

GitHubのPersonal access tokenが必要なので発行してください。**repo**の権限が必要です。

{{< ex-link url="https://github.com/settings/tokens" >}}


### 事前準備 : 環境変数をセット

上で発行したアクセストークンとGitHubのユーザ(もしくはOrganization)を環境変数にセットします。

- `MIKKU_GITHUB_ACCESS_TOKEN`: 上で発行したアクセストークン
- `MIKKU_GITHUB_OWNER`: 僕の場合は `p1ass`

{{< highlight bash>}}
$ export MIKKU_GITHUB_ACCESS_TOKEN=[YOUR_ACCESS_TOKEN]
$ export MIKKU_GITHUB_OWNER=[GITHUB_OWNER_NAME]
{{< /highlight >}}

### mikku pr コマンド

KubernetesのマニフェストファイルにかかれているDockerイメージのタグを最新のリリースのものに更新するPRを作成するコマンドです。

![スクリーンショット](https://raw.githubusercontent.com/p1ass/mikku/master/images/diff.png)
_スクリーンショット_

{{< highlight bash>}}
$ export MIKKU_MANIFEST_REPOSITORY=sample-manifest-repository
$ export MIKKU_MANIFEST_FILEPATH=manifests/{{.Repository}}/deployment.yml
$ export MIKKU_DOCKER_IMAGE_NAME={{.Owner}}/{{.Repository}}

$ mikku pr sample-repository
{{< /highlight >}}


#### 環境変数

これらの設定はコマンドラインオプションで上書きできます。

- `MIKKU_MANIFEST_REPOSITORY` : マニフェストファイルがあるリポジトリを指定します
- `MIKKU_MANIFEST_FILEPATH` : 実際のファイルを指定します
- `MIKKU_DOCKER_IMAGE_NAME` : Dockerイメージの名前を指定します



### mikku release コマンド

セマンティックバージョニングに従って、バージョンを上げるGitHub Releaseを作成します。バージョンを明示的に設定することも出来ます。

{{< highlight bash>}}
$ mikku release <repository> <major | minor | patch | (version)>
{{< /highlight >}}

![スクリーンショット](https://raw.githubusercontent.com/p1ass/mikku/master/images/changelog.png)
_スクリーンショット_


#### オプション
- patch : Ex. v1.0.0 → v1.0.1
- minor : Ex. v1.0.1 → v1.1.0
- major : Ex. v1.1.0 → v2.0.0

## 良さみポイント

{{< link href="https://github.com/p1ass/mikku" text="mikku" >}}の良いところは設定でテンプレートが使える点です。


{{< highlight bash>}}
$ export MIKKU_MANIFEST_REPOSITORY=sample-manifest-repository
$ export MIKKU_MANIFEST_FILEPATH=manifests/{{.Repository}}/deployment.yml
$ export MIKKU_DOCKER_IMAGE_NAME={{.Owner}}/{{.Repository}}
{{< /highlight >}}

{{< link href="https://github.com/p1ass/mikku" text="mikku" >}}では`{{.Owner}}`と`{{.Repository}}`をテンプレートとして使えるようになっています。

マニフェストファイルのファイルパスなどはある程度規則的な階層構造になっている場合は多いです。そのため、テンプレートを使うことで**設定を何度も書き換えることなく使い回せるようになります**。ただ単にコマンドラインオプションで渡すのではなく、環境変数でも設定できるのはこのためです。



## 追加したい機能

一旦公開はしましたが、まだまだ追加したい機能があります。

### Slack Bot 🤖

一番やりたいのはSlack Bot対応です。

Slack Botにすれば他の開発者はチャンネルでコマンドを叩けるようになり、便利に使えるようになるかなぁと思ってます。自分のインターン先に同じような機能のBotがいたのにも影響されてます。

### Homebrewでインストールできるようにする

せっかくなので `brew` でインストールできるようにしたいなぁと思ってます。

本家のリポジトリからインストールできるようにするには、ある程度のStarが必要らしい (要出典) なので、まずは多くの人に使ってもらえるようにしたいですね。

## おわりに

今回初めてCLIツールを作りましたが、Goではとても簡単に作ることができ感動しました。

また、GitHub Actionsを使うことでバイナリの生成などをGitHubで完結するようにできたのも良いですね。

Issue、PR、Starなどはいつでも大歓迎なので、使いにくかったり、バグがあったりしたら気軽にお願いします！

{{< ex-link url="https://github.com/p1ass/mikku" >}}


明日の{{< link href="https://advent.camph.net/" text="CAMPHOR- Advent Calendar 2019" >}}の担当は{{< link href="https://note.mu/tomokortn" text="tomokortn" >}}さんです。お楽しみに！

## 合わせて読みたい

{{< ex-link url="https://blog.p1ass.com/posts/go-database-sql-wrapper/" >}}

