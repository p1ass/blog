---
title: Caddyfileを分割する方法
date: 2020-11-07T22:40:00+09:00
draft: false
description: Caddyfile は Caddy の設定ファイルですが、どんどん設定が増えていくと可読性が下がってしまいます。Nginx の `/site-enabled` のように Caddyfile を分割して読み込めないかなと思って調べたところ、分割できることが分かったのでやり方をメモしておきます。
categories:
  - 開発
tags:
  - Caddy
share: true
---

こんにちは [@p1ass](https://twitter.com/p1ass) です。

Caddyfile は Caddy の設定ファイルですが、どんどん設定が増えていくと可読性が下がってしまいます。

Nginx の `/site-enabled` のように Caddyfile を分割して読み込めないかなと思って調べたところ、分割できることが分かったのでやり方をメモしておきます。

<!--more-->

## 方法

import ディレクトリを使えばできます。

{{<ex-link url="https://caddyserver.com/docs/caddyfile/directives/import#import" >}}

マスターとなる Caddyfile で import をすれば、マッチするファイルが読み込まれます。

```sh
import Cadyfiles/*.Caddyfile
```

私が運用してるリポジトリでは、サブドメインごとに Caddyfile を分けていて、1 つのファイルが肥大化しないように気をつけてます。

参考になれば幸いです。
