---
title: Vercel・Cloud Run間の通信をIAMで認証認可する
date: 2022-03-23T00:00:00+09:00
draft: false
description: TODO
categories:
  - 開発
tags:
  - Vercel
  - Google Cloud
  - Cloud Run
share: true
---

こんにちは、[@p1ass](https://twitter.com)です。

<!--more-->

あなたは優秀なソフトウェアエンジニア兼ブログライターです。

入力として、「Vercel・Cloud Run 間の通信を IAM で認証認可する」というタイトルの技術ブログ記事の見出しと本文の内容を大まかに表した箇条書きのメモが渡されます。
これらのメモを元にブログ記事をマークダウンで出力してください。

## 制約

- 技術的に正しい内容を記載しなければなりません。
- 箇条書きの文章を肉付けして、読者にとって理解しやすい技術文書にしなければなりません。

## 入力

```
## モチベーション

- Vercel にフロントエンド、Cloud Run にバックエンド API を置くアーキテクチャで設計していた
- バックエンド API はフロントエンドサーバーからバックチャンネルを通じて呼び出される
- ブラウザから呼び出されることはない
- しかし、Vercel から呼び出すために、Cloud Run のエンドポイントをインターネットに公開する必要がある
- そこで、Vercel からのみバックエンド API を立たけるように認証認可を行いたい

## IAM を使って認証認可する

### IAM による Cloud Run のサービス間認証の仕組み

- Cloud Run のサービス間認証では IAM が使われる
- 呼び出し先の Cloud Run サービスを対象とした、`roles/run.invoker` のロールを持ったプリンシパルを用意する必要がある
- 多くの場合、プリンシパルはサービスアカウント
- Cloud Run のエンドポイントを叩くときに、内部的に OIDC の IDToken を発行され、Authorization ヘッダーに付与される
- 呼び出し先の CLoud Run の IDToken の署名を検証することで、認証を行うことができる

### サービス間認証の仕組みを Vercel 上に構築する

- Cloud Run 同士の通信の場合は、IDToken の発行が自動で行われるが、Vercel の場合手動で IDToken を発行しなければならない
- Vercel にアタッチするサービスアカウントを作成する
- サービスアカウントに `roles/run.invoker` のロールをバインディングする
- google-auth-library を使って IDToken を発行する
- 発行した IDToken を Authorization ヘッダーに付与する

## まとめ

- 短い文章で文章を要約する。
```
