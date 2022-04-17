---
title: GitHub APIを使ってブランチを新規作成する
date: 2020-03-10T23:00:00+09:00
draft: false
description: GitHub APIを用いてブランチを作成するには、gitのref(参照)を操作するAPIを使用します。
categories:
  - 開発
tags:
  - GitHub
share: true
---

こんにちは、({{<link href="https://twitter.com/p1ass" text="@p1ass" >}})です。

先日、GitHub API を使用して git のブランチを作成しようとしたのですが、純粋にブランチを作成する API が生えておらず、色々調べた結果作成できることが分かってのでメモを残しておきます。

<!--more-->

## 方法

ここに書いてありました。

{{<ex-link url="https://stackoverflow.com/questions/9506181/github-api-create-branch/9513594" >}}

GitHub API を用いてブランチを作成するには、git の ref(参照)を操作する API を使用します。

https://docs.github.com/ja/rest/reference/git#refs

まず参照を取得する API を用いて起点となるコミットのリビジョンハッシュを取得します。

```bash
$ TOKEN=<AUTH_TOKEN>
$ AUTHOR=<AUTHOR>
$ REPO=<REPOSITORY>
$ BASE_BRANCH=master
$ curl -s -H "Authorization: token ${TOKEN}" https://api.github.com/repos/${AUTHOR}/${REPO}/git/refs/heads/${BASE_BRANCH}
```

```json
[
  {
    "ref": "refs/heads/master",
    "node_id": "...",
    "url": "https://api.github.com/repos/<AUTHOR>/REPOSITORY>/git/refs/heads/master",
    "object": {
      "sha": "ハッシュ値",
      "type": "commit",
      "url": "https://api.github.com/repos/<AUTHOR>/REPOSITORY>/git/commits/...."
    }
  }
]
```

リビジョンハッシュ値を取得することがでました。これを起点に参照を作成します。

```bash
$ NEW_BRANCH=<NEW_BRANCH_NAME>
$ HASH=<.[0].object.sha に当たるハッシュ>
$ curl -X POST -s -H "Authorization: token ${TOKEN}" -d '{"ref": "refs/heads/'"${NEW_BRANCH}"'","sha":"'"${HASH}"'"}' https://api.github.com/repos/${AUTHOR}/${REPO}/git/refs
```

```json
{
  "ref": "refs/heads/<NEW_BRANCH_NAME>",
  "node_id": "...",
  "url": "https://api.github.com/repos/<AUTHOR>/<REPO>/git/refs/heads/<NEW_BRANCH_NAME>",
  "object": {
    "sha": "...",
    "type": "commit",
    "url": "https://api.github.com/repos/<AURHOT>/<REPO>/git/commits/..."
  }
}
```

## なぜこれでブランチを作成できるのか？

git におけるブランチは基本的にポインタ（参照）であり、コミットを指しています。

![](data-model-4.png)

引用: {{<link text="Gitの内側 - Gitの参照" href="https://git-scm.com/book/ja/v2/Git%E3%81%AE%E5%86%85%E5%81%B4-Git%E3%81%AE%E5%8F%82%E7%85%A7" >}}

そのため、起点となるコミットのハッシュ値に対して参照を作ることはブランチを作成する行為を一致します。

## 感想

git の内部仕組みをあまり知らなかったので勉強になりました。
