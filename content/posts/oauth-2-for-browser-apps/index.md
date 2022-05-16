---
title: SPAで役立ちそうな OAuth 2.0 for Browser-Based Apps を読んだ
date: 2022-05-05T00:00:00+09:00
draft: false
description: TODO
categories:
  - 開発
tags:
  - OAuth

share: true
---

こんにちは、[@p1ass](https://twitter.com/p1ass)です。

最近、SPA で OAuth を使うときのプラクティスについて調べていたところ、[OAuth2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps) という RFC の Internet-Fraft を見つけました。

一通り読んでいたところ、現時点でのベストプラクティスが良い感じにまとまっていたので、興味深かったところを抜粋して紹介します。

全てを網羅するわけではないので、興味がある方は原文を読んでください。

{{<ex-link url="https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps">}}

{{<note text="Internet-Draftは参考文献にするには不適切です。ただ今回の内容はベストプラクティスであり、ドラフトの段階でも価値があると判断して紹介しています。今後内容に変更があるかもしれない点に注意してください。">}}

## OAuth2.0 for Browser-Based Apps の概要

OAuth2.0 for Browser-Based Apps は、ブラウザ上で動作するアプリケーションにおける OAuth2.0 のベストプラクティスをまとめた [Best Current Practice (BCP)](https://en.wikipedia.org/wiki/Best_current_practice) のドラフトです。

すでに存在するネイティブアプリ向けの Best Current Practice である OAuth 2.0 for Native Apps ( [RFC 8252](https://datatracker.ietf.org/doc/html/rfc8252)) のブラウザ版という位置づけになります。

OAuth 2.0 の RFC は昔ながらのサーバサイドで HTML をレンダリングするアプリケーションを想定しているため、近年の JavaScript を利用した SPA で OAuth 2.0 を使う場合のベストプラクティスはまとまっていないです。

SPA に対応した Best Current Practice ができることで、モダンなブラウザベースのアプリケーションでより安全なアプリケーションを作る方法が広く認知されるのでは、と個人的に期待しています。

## 歴史的背景 : 同一オリジンポリシーと OAuth2.0

OAuth2.0 をブラウザベースのアプリケーションで扱う手段を見る前に、ドラフトに載っていた歴史的背景について紹介します。

ブラウザには[同一オリジンポリシー](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)が存在します。
この制限により、ブラウザが[クロスオリジン](https://developer.mozilla.org/ja/docs/Glossary/Origin)に対して [XMLHttpRequest](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest) を使ったネットワークアクセスを行うことは許可されていません (一部の例外を除く)。

この制限は、ブラウザ上の JavaScript から OAuth 2.0 の Authorization Code Flow を使うことを困難にさせます。
クロスオリジンでホスティングされている認可サーバに対して JavaScript を通じて Token Endpoint へリクエストを行うことができないからです (D・E の部分)。

```text
     +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+           ここができない                 |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)

```

_Authorization Code Flow の流れ(TODO: 図にしても良いかも)_

Implicit Flow はこの制限を回避するために定義されました。
Implicit Flow では、アクセストークンは URL のフラグメントとして渡されます (C の部分)。
フラグメントは [location.hash](https://developer.mozilla.org/ja/docs/Web/API/Location/hash) を使って操作できるため、ブラウザ上の JavaScript だけで OAuth2.0 のアクセストークンが使えるようになりました。

```text
     +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier     +---------------+
     |         -+----(A)-- & Redirection URI --->|               |
     |  User-   |                                | Authorization |
     |  Agent  -|----(B)-- User authenticates -->|     Server    |
     |          |                                |               |
     |          |<---(C)--- Redirection URI ----<|               |
     |          |          with Access Token     +---------------+
     |          |            in Fragment
     |          |                                +---------------+
     |          |----(D)--- Redirection URI ---->|   Web-Hosted  |
     |          |          without Fragment      |     Client    |
     |          |                                |    Resource   |
     |     (F)  |<---(E)------- Script ---------<|               |
     |          |                                +---------------+
     +-|--------+
       |    |
      (A)  (G) Access Token
       |    |
       ^    v
     +---------+
     |         |
     |  Client |
     |         |
     +---------+
```

_Implicit Flow Flow の流れ(TODO: 図にしても良いかも)_

### Implicit Flow のセキュリティ上の懸念

先に述べたように、Implicit Flow を使えばブラウザ上の JavaScript だけで OAuth のアクセストークンが使えます。

しかし、Implicit Flow には特有のセキュリティ上の懸念が伴います。

- **アクセストークンの傍受**: アクセストークンが URL に含まれるため、ログやブラウザの履歴から傍受される可能性がある
- **リダイレクト URI の操作**: もし攻撃者が認可レスポンスを自分の制御下にある URL に送らせることができれば、アクセストークンを含む認可レスポンスに直接アクセスできる (具体的な攻撃手法は[OAuth 2.0 Security Best Current Practice のドラフト](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics#section-4.1.2)に記載)
- **サードパーティスクリプトからの漏洩**: アクセストークンがフラグメントで返されると、ページ上のあらゆるサードパーティースクリプトからアクセストークンが見える

### CORS による同一オリジンポリシーの例外

このような Implicit FLow 特有の攻撃が存在するため、できれば Implicit Flow は使いたくないです。

そこで登場するのが[オリジン間リソース共有 (CORS)](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS) です。
OAuth2.0 が制定された当時 (2012 年) に比べ、 CORS はほとんどのブラウザで広く使われるようになり、同一オリジンポリシーの例外を作れるようになりました。

CORS を用いることで、ブラウザベースのアプリケーションでも (JavaScript の [XMLHttpRequest](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest) でも) OAuth 2.0 Authorization Code Flow の Token Endpoint への POST リクエストを実行することが可能になりました。

また、[Session History API](https://developer.mozilla.org/ja/docs/Web/API/History_API) があるため、ページの再読み込みを行わずに URL のパスとクエリー文字列を変更できます。
つまり、最近のブラウザベースのアプリケーションでは、ページの再読み込みをせずにクエリ文字列から認可コードを削除できます。

これらのブラウザのエコシステムの発展により、OAuth 2.0 Authorization Code Flow をブラウザでも実行できるようになりました。
Authorization Code Flow はブラウザにアクセストークンが漏洩しない (URL に含まれない) ので、Implicit Flow よりも安全です。

良さそう。

## アプリケーションアーキテクチャパターン

次に、ブラウザベースのアプリケーションで OAuth 2.0 を使う場合のアーキテクチャパターンを 2 つに分けて紹介します。

- バックエンドがない場合 (静的サイトホスティング)
- バックエンドがある場合

### バックエンドがない場合 (静的サイトホスティング)

このアーキテクチャでは、JavaScript のコードが静的な Web ホストからブラウザに読み込まれ (A)、その後アプリケーションがブラウザで実行されます。

このアプリケーションは、クライアントシークレットを安全に保管できないため、クライアントは Public Client とみなされます。

```text
                         +---------------+           +--------------+
                         |               |           |              |
                         | Authorization |           |   Resource   |
                         |    Server     |           |    Server    |
                         |               |           |              |
                         +---------------+           +--------------+

                                ^     ^                 ^     +
                                |     |                 |     |
                                |(B)  |(C)              |(D)  |(E)
                                |     |                 |     |
                                |     |                 |     |
                                +     v                 +     v

   +-----------------+         +-------------------------------+
   |                 |   (A)   |                               |
   | Static Web Host | +-----> |           Browser             |
   |                 |         |                               |
   +-----------------+         +-------------------------------+
```

_バックエンドがない場合のアプリケーションパターン_

ブラウザの JavaScript アプリケーションは、PKCE (後述) に対応した Authorization Code Flow を開始し (B)、POST リクエストによりアクセストークンを取得します (C)。

その後、適切なブラウザ API を使用して、アクセストークン（と、ある場合はリフレッシュトークン）を可能な限り安全に保存します。

{{<note text="「この出版物の日付の時点では、完全に安全な方法でトークンを保存できるブラウザ API は存在しない」と書かれています。Local Storage などを使っても「絶対な」安全は達成できないことが示唆されてます。">}}

ブラウザの JavaScript アプリケーションはリソースサーバーに対してアクセストークンを含めたリクエストを送り (D)、リソースサーバーからレスポンスを受け取ります (E)。

なお、このシナリオでは、認可サーバーとリソースサーバーは JavaScript を実行しているドメインからの POST リクエストを実行できるように、必要な CORS ヘッダーをサポートしなければなりません。

#### このアーキテクチャパターンの感想

CORS ヘッダーをサポートするには、認可サーバーとリソースサーバーがクライアントのドメインを何らかの形で登録する必要がありますが、その詳細についてはこのドラフトの中には記載されていませんでした。
もし、1 つの組織が全てを管理するファーストパーティのアプリケーションであれば、簡単に CORS のヘッダーをサポートできると思います。
一方で認可サーバーやリソースサーバーが Twitter や Google などサードパーティーの場合は一筋縄ではいかないことが予想されます。

あくまでファーストパーティのアプリケーション内の認可を SSO っぽく行いたいユースケースで使うのが良さそうだと、個人的には感じています。

### バックエンドがある場合

React のフロントエンド + Spring Boot のバックエンドのような構成です。

バックエンドにあたる Application Server があるため、JavaScript アプリケーションの外でアクセストークンを取得するためのすべてのステップを実行できます。

そのため、このアプリケーションはクライアントシークレットを安全に保管できる Confidential Client とみなされるべきです [SHOULD]。

```text
   +-------------+  +--------------+ +---------------+
   |             |  |              | |               |
   |Authorization|  |    Token     | |   Resource    |
   |  Endpoint   |  |   Endpoint   | |    Server     |
   |             |  |              | |               |
   +-------------+  +--------------+ +---------------+

          ^                ^                   ^
          |             (D)|                (G)|
          |                v                   v
          |
          |         +--------------------------------+
          |         |                                |
          |         |          Application           |
       (B)|         |            Server              |
          |         |                                |
          |         +--------------------------------+
          |
          |           ^     ^     +          ^    +
          |        (A)|  (C)|  (E)|       (F)|    |(H)
          v           v     +     v          +    v

   +-------------------------------------------------+
   |                                                 |
   |                   Browser                       |
   |                                                 |
   +-------------------------------------------------+
```

このアーキテクチャパターンでは、まず、Application Server から JavaScript コードが読み込まれます (A)。
このとき、バックエンドに当たる Application Server はリソースサーバーではなく、OAuth のクライアントの一部として考えます。

次に、Application Server はブラウザを認可エンドポイントにリダイレクトすることで、OAUth フローを開始させます (B)。

ユーザがリダイレクトされると、ブラウザは認可コードを Application Server に渡します (C)。
Application Server は Client Secret を使って Token Endpoint で認可コードとアクセストークンを交換します (D)。

Application Server はアクセストークンとリフレッシュトークンを Application Server の内部に保存し、従来のクッキーを介してブラウザベースのアプリケーションと別のセッションを作成します (E)。

ブラウザ上の JavaScript アプリケーションがリソースサーバーにリクエストを行う場合は、代わりに Application Server にリクエストを行い ます (F)。
Application Server はアクセストークンを使って Resource Server にリクエストを行い (G)、そのレスポンスをブラウザに返します (H)。

#### このアーキテクチャパターンで気をつける点

- Application Server は Confidential Client としてみなされるべき [SHOULD]
- Application Server は、アクセストークンのリクエストを開始するために、OAuth 2.0 Authorization Code Flow with PKCE を使用すべき [SHOULD]
- その他の Confidential Client に関する詳細な推奨事項は、 [OAuth 2.0 Security Best Current Practice セクション 2.1.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics#section-2.1.1) に記載

#### ブラウザと Application Server のセッションの確立方法

ブラウザと Application Server の間の接続は、Application Server が提供するセッションクッキーであるべきです [SHOULD]。
詳細はこのドラフトの範囲外ですが、HTTP-only や Secure を使うといった多くの推奨事項は [OWASP Cheat Sheet シリーズ](https://cheatsheetseries.owasp.org/)に記載されています。

#### このアーキテクチャパターンの感想

最近のモダンな Web アプリケーションを作る場合はだいたいこのような構成になると感じています。
フロントエンドとバックエンドが別れているシステムの構成図があるだけでも価値があると思いました。

また、このドラフトでは基本的にトラディショナルなクッキーを用いたセッションを貼ることを推奨していました。
いくつかのインターネットの記事ではクッキーを使わない実装 (JWT を HTTP ヘッダーで受け渡す形の実装など)を推しているものもあるため、人によっては疑問を持つ人がいるかもしれない、と個人的に感じています。

## 参考 : Proof Key for Code Exchange (PKCE)

Proof Key for Code Exchange (PKCE) は [Proof Key for Code Exchange by OAuth Public Clients (RFC 7637)](https://datatracker.ietf.org/doc/html/rfc7636)で定義されている、認可コードの乗っ取り攻撃のための対策手法です。

![認可コードの乗っ取り攻撃の図](authorization_code_interception_attack.png)
_認可コードの乗っ取り攻撃の図 (Authlete さんの記事より引用)_

詳細を全部書くと長くなってしまうので、端的に話すと次にような仕様です。

- Public Client では Client ID は公開情報として扱われ、誰でも取得できる状態にある
- 攻撃者のアプリが認可レスポンスに付随する認可コードを盗み取れれば、Client ID と合わせてアクセストークンを発行できてしまう
- 本物のクライアントしか知り得ない情報 (`code_verifier`) を Token Endpoint へのリクエストに付与することで、本物のクライアントしかアクセストークンを発行できないようにする仕組み

詳しくは、RFC や Authlete さんの記事がおすすめです。

{{<ex-link url="https://www.authlete.com/ja/developers/pkce/">}}

## OAuth 2.0 Authorization Code Flow with PKCE を使う際のベストプラクティス

ドラフトでは、アプリケーション側と認可サーバー側それぞれのベストプラクティスが紹介されていました。

### ブラウザベースアプリケーション

- アクセストークンを取得する際に、OAuth 2.0 Authorization Code Flow with PKCE を使用しなければならない [MUST]
- リダイレクト URI の CSRF 攻撃から身を守るために、以下のいずれかを行わなければならない [MUST]
  - 認証サーバーが PKCE をサポートしていることを確認する
  - OAuth 2.0 の "state" パラメータまたは OpenID Connect の "nonce" パラメータを使用し、CSRF 攻撃から身を守らなければならない
    の "nonce "パラメータを使用して、一度だけ使用する CSRF トークンを伝達する。
- 1 つ以上のリダイレクト URI を登録し、正確なリダイレクト URI のみを使用しなければならない。 登録されたリダイレクト URI のみを認可リクエストで使用しなければならない [MUST]

### ブラウザベースアプリケーションをサポートする認可サーバー

- 登録されたリダイレクト URI の完全一致を要求しなければならない[MUST]
- PKCE をサポートしなければならない[MUST]
- 認可レスポンスでアクセストークンを発行してはならない [MUST NOT]
- ブラウザベースアプリケーションにリフレッシュトークンを発行する場合
  - リフレッシュ・トークンを使用するたびにローテーションしなければならない [MUST]
  - リフレッシュ・トークンに最大有効期間を設定するか、一定時間使用されないと失効させなければならない [MUST]

### 感想

CSRF 攻撃に対する対策として PKCE が挙げられていることに加え、"いずれか"という書き方をされているのが印象に残りました。
state を使わずとも PKCE をやっていれば CSRF 攻撃を防げるのはその通りなのですが、state が必須ではない書き方なのが新鮮でした。

## おわりに

今回は紹介しませんでしたが、OAuth 2.0 for Browser-Based Apps にはリフレッシュトークンに関するベストプラクティスや認可サーバー側のセキュリティプラクティスなど、まだまだ役に立つものが載っていました。

興味がある方は一読してみることをおすすめします！
