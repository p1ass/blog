---
title: "VS CodeでJupyter Notebooksのノートブックを表示したときにmatplotlibのスタイルをデフォルトにする"
date: 2019-10-12T12:00:00+09:00
draft: false
description: VS CodeではJupyter Notebooksをネイティブで表示することができますが、matplotlibでplotした時のスタイルが黒ベースのものになっています。自分は標準の色の方が好きなので変更する方法を紹介します。

categories:
- 開発
tags:
- Python
- VS Code
- Jupyter Notebooks
- matplotlib
eyecatch: /posts/matplotlib-style-in-vscode/ogp.png
share: true
---

こんにちは、{{< link href="https://twitter.com/p1ass" text="@p1ass" >}}です。  

VS CodeではJupyter Notebooksのノートブックをネイティブで表示することができますが、matplotlibでplotした時のスタイルが黒ベースのものになっています。自分は標準の色の方が好きなので変更する方法を紹介します。

<!--more-->

## 方法

次のようにしてデフォルトのスタイルを適用します。

{{< highlight python >}}
import matplotlib as mpl
mpl.style.use('default')
{{< /highlight >}}

これだけでいつものスタイルでプロットされます。`savefig()`も同様のスタイルで保存されます。

![VSCode内のキャプチャ](screenshot.png)
