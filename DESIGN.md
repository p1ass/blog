---
version: alpha
name: ぷらすのブログ
description: 日本語の技術記事を長文で読ませるための、1 色相の静かな配色と 17px の本文
colors:
  # プリミティブ: neutral (色相 216 度)
  neutral-0: "#ffffff"
  neutral-50: "#f9f9fa"
  neutral-100: "#eaeaea"
  neutral-200: "#dde0e4"
  neutral-300: "#c0c6ce"
  neutral-400: "#8d97a5"
  neutral-500: "#636e7d"
  neutral-600: "#535a65"
  neutral-700: "#42464c"
  neutral-800: "#303233"
  neutral-900: "#1e2126"
  neutral-950: "#0f1114"
  # プリミティブ: accent (色相 215 度)
  accent-50: "#e8f5fe"
  accent-100: "#cfe2fc"
  accent-200: "#adc7eb"
  accent-300: "#7eaef1"
  accent-400: "#6891ca"
  accent-500: "#4172b5"
  accent-600: "#365e96"
  accent-700: "#2b4b78"
  accent-800: "#223959"
  accent-900: "#16263b"
  # プリミティブ: warning (色相 35 度)
  warning-50: "#fff4e5"
  warning-300: "#f0a742"
  warning-600: "#a35b00"
  warning-900: "#342614"
  # プリミティブ: tip (色相 145 度)
  tip-50: "#e8f6ec"
  tip-300: "#66cc90"
  tip-600: "#1f7a3d"
  tip-900: "#142e1f"
  # セマンティック (ライト)
  primary: "{colors.accent-500}"
  secondary: "{colors.neutral-500}"
  neutral: "{colors.neutral-0}"
  text: "{colors.neutral-900}"
  text-muted: "{colors.neutral-500}"
  text-inverted: "{colors.neutral-0}"
  accent: "{colors.accent-500}"
  accent-muted: "{colors.accent-400}"
  accent-surface: "{colors.accent-50}"
  text-on-accent-surface: "{colors.neutral-800}"
  warning: "{colors.warning-600}"
  warning-surface: "{colors.warning-50}"
  text-on-warning-surface: "{colors.neutral-800}"
  tip: "{colors.tip-600}"
  tip-surface: "{colors.tip-50}"
  text-on-tip-surface: "{colors.neutral-800}"
  border: "{colors.neutral-200}"
  surface: "{colors.neutral-0}"
  surface-subtle: "{colors.neutral-50}"
  surface-hover: "{colors.neutral-100}"
  icon: "{colors.neutral-700}"
  diagram-surface: transparent
  brand-surface-border: transparent
  github-mark: "#211f1f"
  x-mark: "#000000"
  # セマンティック (ダーク)
  dark-text: "{colors.neutral-200}"
  dark-text-muted: "{colors.neutral-400}"
  dark-text-inverted: "{colors.neutral-950}"
  dark-accent: "{colors.accent-300}"
  dark-accent-muted: "{colors.accent-500}"
  dark-accent-surface: "{colors.accent-900}"
  dark-text-on-accent-surface: "{colors.neutral-300}"
  dark-warning: "{colors.warning-300}"
  dark-warning-surface: "{colors.warning-900}"
  dark-text-on-warning-surface: "{colors.neutral-300}"
  dark-tip: "{colors.tip-300}"
  dark-tip-surface: "{colors.tip-900}"
  dark-text-on-tip-surface: "{colors.neutral-300}"
  dark-border: "{colors.neutral-700}"
  dark-surface: "{colors.neutral-950}"
  dark-surface-subtle: "{colors.neutral-900}"
  dark-surface-hover: "{colors.neutral-800}"
  dark-icon: "{colors.neutral-300}"
  dark-diagram-surface: "{colors.neutral-0}"
  dark-brand-surface-border: "{colors.neutral-500}"
  dark-github-mark: "#ffffff"
  dark-x-mark: "#ffffff"
  # 他社のブランドカラー。こちらでは決められないので、コントラストの検証から外す
  brand-hatena: "#4ba3d9"
  brand-x-hover: "#444444"
  brand-x-surface-hover: "#dddddd"
  # コードブロック (highlight.js の atom-one-dark)
  code-surface: "#282c34"
  code-text: "#abb2bf"
typography:
  h1:
    fontFamily: Hiragino Kaku Gothic ProN
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.4
  h2:
    fontFamily: Hiragino Kaku Gothic ProN
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.4
  h3:
    fontFamily: Hiragino Kaku Gothic ProN
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.4
  h4:
    fontFamily: Hiragino Kaku Gothic ProN
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: Hiragino Kaku Gothic ProN
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.9
  body-sm:
    fontFamily: Hiragino Kaku Gothic ProN
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.9
  caption:
    fontFamily: Hiragino Kaku Gothic ProN
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.25
  label:
    fontFamily: Hiragino Kaku Gothic ProN
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.25
  code:
    fontFamily: ui-monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 8px
  full: 9999px
spacing:
  2xs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  block-gap: 32px
  content-width: 760px
  breakpoint-sm: 640px
  breakpoint-lg: 1080px
components:
  link-body:
    textColor: "{colors.accent}"
  link-body-hover:
    textColor: "{colors.accent}"
    backgroundColor: "{colors.surface-subtle}"
  inline-code:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
  code-block:
    backgroundColor: "{colors.code-surface}"
    textColor: "{colors.code-text}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  note-info:
    backgroundColor: "{colors.accent-surface}"
    textColor: "{colors.text-on-accent-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  note-warning:
    backgroundColor: "{colors.warning-surface}"
    textColor: "{colors.text-on-warning-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  note-tip:
    backgroundColor: "{colors.tip-surface}"
    textColor: "{colors.text-on-tip-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  post-card:
    textColor: "{colors.text}"
    typography: "{typography.h2}"
  post-card-hover:
    textColor: "{colors.accent}"
  link-card:
    backgroundColor: "{colors.surface}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  link-card-hover:
    backgroundColor: "{colors.surface}"
  button-more:
    backgroundColor: "{colors.text}"
    textColor: "{colors.text-inverted}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  button-more-hover:
    backgroundColor: "{colors.text-muted}"
  tag:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  share-button-x:
    backgroundColor: "#000000"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    size: "{spacing.2xl}"
  share-button-x-hover:
    backgroundColor: "{colors.brand-x-hover}"
  share-button-hatena:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.brand-hatena}"
    rounded: "{rounded.full}"
    size: "{spacing.2xl}"
  share-button-hatena-hover:
    backgroundColor: "{colors.surface-hover}"
  theme-trigger:
    textColor: "{colors.icon}"
    rounded: "{rounded.full}"
    size: "{spacing.2xl}"
  theme-trigger-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.text}"
  theme-menu:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xs}"
  theme-menu-option:
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
  theme-menu-option-selected:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.text}"
---

# DESIGN.md

blog.p1ass.com の見た目の方針。[design.md](https://github.com/google-labs-code/design.md) 形式で、front matter がトークン、この本文がその理由にあたる。front matter は `npx @google/design.md lint DESIGN.md` で確かめる。

実装の置き場所と、記事まわりの語彙は [CLAUDE.md](CLAUDE.md) にある。見た目を変える手順は [design-system Skill](.claude/skills/design-system/SKILL.md) が案内する。

## Overview

日本語の技術記事を、腰を据えて読ませるためのブログ。読者は仕事の合間に検索から流れ着くエンジニアで、目的は記事を最後まで読み通してもらうことにある。

見た目は静かで、記事の内容より前に出ない。装飾ではなく、行長と行間と余白のリズムで読みやすさを作る。色数を絞り、1 色相の濃淡で組む。読者の注意を引くのは、リンクと `Note` と見出しのボーダーだけにとどめる。

疎と密でいえば疎。1 行を 44 文字で折り返し、段落のあいだに行送りと同じ 32px を空ける。画面あたりの情報量は落ちるが、長文を読むあいだの疲れが減る。

トークンで縛るのは、新しいコンポーネントを書くときに参照する基準を作るためだ。基準がないと既存のコードを真似ることになるが、真似た先の値が正しいとは限らない。

## Colors

1 色相の濃淡でできている。プリミティブは neutral (色相 216 度) と accent (色相 215 度) の 2 系統で、そこに `Note` のための色相を 2 つだけ足してある。

- **Primary (#4172b5):** リンク、アクセント線、フォーカスリングに使う唯一のアクセント。OG 画像の下辺のボーダーにも使う事実上のブランドカラーなので値を動かさない。OG 画像は `scripts/generate-og-images.ts` がこのトークンを読んで描くため、値を変えると次のビルドで 77 枚が新しい青になる
- **Secondary (#636e7d):** 日付やキャプションのように、本文より一段落とす文字
- **Neutral (#ffffff 〜 #0f1114):** 地と文字。12 段すべてが同じ色相で、明るいテーマと暗いテーマの両方をここから取る
- **Warning (#a35b00) / Tip (#1f7a3d):** `Note` の 3 種別のうち info 以外。accent と同じ色相の濃淡で分けると、記事を流し読みしたときに「いつもと違う」が伝わらない。段は `Note` で使う面とアイコンのぶんだけ置く

### 段の決め方

数字は明度の目安で、小さいほど明るい。

本文リンクの下線には accent の 400 を `accent-muted` として当てる。300 のほうが「薄い」の見た目には近いが、白地で 2.35 対 1 にとどまる。下線はリンクを色以外で見分けるための印なので、UI コンポーネントと同じ 3 対 1 を満たす 400 (3.24 対 1) を採る。

accent の 300 だけ彩度が高い (他の段が 47%、この段だけ 80%)。暗い地に置くと同じ彩度でも色みが弱く見え、リンクの青がくすんで感じられる。

他社のブランドカラーは `brand-*` として持ち、コントラストの検証から外す。値をこちらでは決められない。[WCAG 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum) も、ロゴやブランド名の一部であるテキストを Logotypes の例外としてコントラストの要件から外している。

### コントラスト

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) の AA を満たす。本文 4.5 対 1 と大きい文字 3 対 1 が [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)、UI コンポーネントと図形の 3 対 1 が [1.4.11 Non-text Contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast) にあたる。役割の組み合わせは両テーマで自動検証し、下回ったら CI で落とす。

暗いテーマの地 (neutral の 950) に対して、本文は 14.28 対 1、`text-muted` は 6.40 対 1、`accent` は 8.29 対 1。3 つとも AA を超える。

## Typography

読者の OS のフォントを使い、Web フォントは入れない。表示速度を保つためで、見た目の伸びしろはフォントそのものより行長と行間とサイズの整理のほうが大きい。

- **本文:** 17px、行間 1.9。日本語の長文で読みやすいとされる 1.8〜2.0 の中央を取った
- **見出し:** 本文 17px を基準に比 1.2 の等比で 20 / 24 / 28 / 34px。太字にして行間を 1.4 まで詰める。h5 と h6 は本文と同じ大きさにして太さだけで区別する。これ以上小さくすると本文より小さくなり、見出しに見えない
- **キャプション:** 13px。日付やリンクカードのホスト名に使う
- **コード:** 等幅の 14px。地の文より小さくして、行の詰まりを抑える

段の名前は用途で付ける。段の番号にすると「見出しにはどれか」を毎回決め直すことになるが、用途名なら書くものから引ける。

行間は倍率で持ち、px では持たない。px にすると文字サイズを変えたときに追従しない。

和文を先に並べる。欧文だけのフォントを先に置くと、和文がそのフォントのフォールバックに委ねられ、環境によって別のフォントが混ざる。

章の切れ目のボーダーは記事本文の h2 にだけ置く。一覧のカードのタイトルも h2 だが、そちらには上端のアクセント線とタイトル直下の下線があるので、ここにボーダーを足すと短い範囲に線が 3 本並ぶ。

## Layout

本文は最大 760px の 1 カラム。17px で 1 行が全角 44 文字になる。1 行 35〜45 文字という目安の上限側に寄せた。行が短いほど視線の折り返しが増え、長文ではそれが疲れになる。

スペーシングは 4px の倍数。小さい刻みを取っても端数が出ないようにするためで、基準が 4 の倍数でないと 3.4px のような値が生まれ、アイコンやボーダーと揃わなくなる。

本文のブロック間は `block-gap` (32px) で統一する。行送りと同じ値にすることで、本文が一定のリズムで流れる。

ブレークポイントは 640px と 1080px の 2 段。1080px は本文の右に目次を置ける幅にあたる。分岐は `min-width` に統一し、狭いほうを既定として書く。

## Elevation & Depth

**影を使わない。** 暗い地では影がほとんど見えず、2 テーマぶんの値を揃えるのが難しい。

階層はボーダーと面のカラーで作る。地が `surface`、一段沈んだ面が `surface-subtle`、その境界が `border`。カード、囲み、コードブロックはこの 3 つの組み合わせだけで奥行きを出す。

面どうしの差は、暗いテーマのほうが広く出る。段の刻みが暗い側で粗いためだ。`surface-subtle` は地に対してライトが 1.05 対 1、ダークが 1.17 対 1、`border` はライトが 1.32 対 1、ダークが 1.99 対 1 になる。中間の段を作れば揃うが、暗い地では同じ比でも差が見えにくいので粗いまま使う。

## Shapes

角丸は 3 段。4px はインラインコード、タグ、小さいボタン。8px はカード、コードブロック、囲み。`full` はアバターとアイコンボタン。

ボーダーの太さは 1px の 1 段に絞る。強調する箇所だけ 3px を使う。引用の左線と、一覧カードの上端のアクセント線の 2 つがこれにあたる。

## Components

### リンク

下線の引き方は 2 種類に絞る。

| 種類 | 平常時 | hover と focus |
| --- | --- | --- |
| 文章の中に置くリンク | `accent-muted` の薄い下線 | `accent` まで濃くする |
| 単独で置くリンク | 下線を透明にする | `currentColor` で現れさせる |

前後の記事へのリンクやフッターが後者にあたる。どちらも `text-decoration-color` を補間する。`text-decoration` の有無は補間できず、hover した瞬間に線が現れて文字が跳ねて見える。

hover では下線を 1px から 2px に太くし、あわせてリンクの背後に `surface-subtle` を敷く。1px の線の色だけを変えても、指しているかどうかが分からない。

**文字の色は hover でも動かさない。** accent は白地で 4.91 対 1 しかなく、1 段薄い accent の 400 にすると 3.24 対 1 で本文の基準を割る。ヘッダーや筆者のリンクが hover で薄くできているのは、text が 15 対 1 近くあって余裕があるためだ。面を敷いたときの accent は `surface-subtle` の上で 4.67 対 1 で、基準を保つ。面をこれ以上濃くできないのも同じ理由で、neutral の 100 では 4.08 対 1 になる。

下線の offset は 0.2em 取る。和文の字面が下いっぱいまであり、既定の位置だと `g` や `p` の下に伸びる部分と下線が重なる。

### フォーカス

フォーカスリングは `:focus-visible` に 1 つだけ、グローバル規則として置く。accent 色の 2px のリングを 2px のオフセットで描く。

要素ごとに書くと、書き忘れた要素だけキーボードで追えなくなる。`:focus` ではなく `:focus-visible` にするのは、マウスで押した直後にリングが残るのを避けるためだ。

### 面を持つリンク

面の全体で hover を受ける。一覧のカードはアクセント線が伸びるだけだと動く範囲が狭いので、タイトルの色もあわせて accent にする。リンクカードはサムネイルの上でも反応させる。

### 画像

押すと原寸で開く。それが分かるように、hover で枠を accent にする。

`width` と `height` はビルド時に入れる。寸法がないと、ブラウザは読み終わるまで高さを 0 として組み、読み終わった時点で下の本文を押し下げる。

入れるのは元の寸法ではなく、実際に描かれる寸法にする。属性は[プレゼンテーション上のヒント](https://html.spec.whatwg.org/multipage/rendering.html#dimRendering)として CSS の `width` と `height` に反映されるので、CSS の `max-height` で高さだけを詰めると横幅が付いてこず、画像が縦に潰れる。上限は本文幅の 760px と高さ 500px で、縦に長い画像が画面を占領しないようにする。

### モーション

長さは 150ms と 250ms の 2 段。150ms は hover や focus の色の変化、250ms は面の入れ替わりや少し距離のある動きに使う。イージングは `ease-out` の 1 種類。

動かすプロパティは名指しで書く。`transition: all` は将来足したプロパティまで巻き込むので、色を変えるつもりの hover で padding や width まで動く。

動きを減らす設定の読者には `prefers-reduced-motion: reduce` で全停止する。

## Theming

明るいテーマと暗いテーマの 2 つを持つ。既定は OS の設定への追従で、読者はヘッダーで明示的に選べる。

暗いテーマの割り当ては、明るいテーマの段の並びをそのまま裏返して作る。text は neutral の 900 と 200、surface は 0 と 950 で、地と文字の関係が入れ替わるだけになる。

本文リンクの下線だけは裏返しにならない。明るいテーマが accent より 1 段薄い色を使うのに対して、暗いテーマは 2 段濃い色を使う。1 段違いの accent の 400 では 5.85 対 1 あり、リンクの文字 (8.29 対 1) との差が付かない。

### 適用の順序

後ろほど強い。

1. 既定 (明るいテーマ)
2. `prefers-color-scheme` による OS への追従
3. 読者の明示的な選択

選択は `localStorage` に持ち、head の同期スクリプトが読んで属性を置く。同期で置かないと、記憶した色が当たる前に一度描かれ、リロードのたびに色が入れ替わって見える。

`color-scheme` も地に合わせる。スクロールバーやフォームのコントロールのように、こちらで色を指定していない部分を揃えるためだ。

### 選択の見せ方

選択肢は「端末に合わせる」「ライト」「ダーク」の 3 つ。出ているのは今の選択のアイコンだけで、押すと 3 つが開く。

押すたびに巡回する形は採らない。次に何になるかが押すまで分からない。「端末に合わせる」を残すのは、一度選んだ後に OS へ戻す道を断たないためだ。

今の選択には面を敷く。色だけで示すと、色の見え方によって選択が読み取れない。

引き金は平常時に枠と地を持たない。ヘッダーは文字のリンクだけでできていて、箱を持つ要素が 1 つもないので、枠を常に出しておくとここだけ重くなる。hover では丸い面を敷き、色も `icon` から `text` へ濃くする。一覧を開いているあいだも同じ見た目にして、どのボタンが一覧を出しているのかを示す。

置き場所は画面の幅によらずヘッダーの右上。案内の並びの中に流し込むと、狭い画面でヘッダーがもう 1 行ぶん高くなる。48px の当たり判定は保つ。

### テーマで切り替えないもの

ビルド時に色が決まるものは切り替えない。

コードブロックは常に暗いまま置く。地の文と別の役割を持つ塊として扱うためだ。

Mermaid の図は常に明るいまま置く。ビルド時に線と文字の色まで確定するので、暗い地では読めない。図の後ろにだけ白い面を敷いて、そこだけ明るいテーマのまま見せる。

インラインコードは地の文になじませる側なので、両テーマとも地に寄せる。

## Iconography

アイコンは図形をソースに書き、外部から読み込まない。外部の kit を読むと、アイコン数個のために毎回スクリプトを 1 本取りに行く。

ブランドマークは [Simple Icons](https://simple-icons.org) から取る。プロジェクト自体は CC0 だが、[DISCLAIMER](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md) が「収録アイコンすべてが CC0 とは限らない」と断っているとおり、マークの商標は各社に残る。使うのは GitHub と X の 2 つで、どちらも各社が配布を認めている範囲にとどめる。`Note` の 3 種別とテーマの 3 択は自前で描く。円や三角と線だけで済む図形なので、外から持ってくる理由がない。テーマの「端末に合わせる」を画面の形にしたのは、太陽と月の中間のような図形にすると、どちらでもない状態が伝わらないためだ。

GitHub と X のマークは、暗い地では白で描く。どちらも暗い地に置くための白版を配っている ([GitHub Logos and Usage](https://github.com/logos)、[X Brand Toolkit](https://about.x.com/en/who-we-are/brand-toolkit)) ので、ブランドの表示としても正しい。役割を 1 つにまとめないのは、明るい地で使う黒が GitHub と X で違うためだ。

X のシェアボタンは黒い円のままにする。円そのものがブランドの形なので、色を変えずに輪郭だけを足す。円の中の `𝕏` は白で固定する。テーマに追従させると、暗いテーマで文字まで暗くなり円に沈む。

はてなブックマークボタンの `B!` は白地で 2.79 対 1 だが、ブランドカラーのまま描く。この `B!` ははてなブックマークのロゴそのもので、Colors に書いた Logotypes の例外にあたる。満たす必要のない基準のために色を動かすと、そのボタンが何かを見分けるための手がかりを失う。

## Do's and Don'ts

- Do 値をトークンから引く。色と寸法と分岐を、コンポーネントの側で決めない
- Do 色を足すときは明るいテーマと暗いテーマの両方を同時に決める
- Do 新しい役割を足したら、コントラストの検証にその組み合わせを足す
- Do コンポーネントひとつの都合で決まる寸法 (アバターの直径など) は生の値のまま書く。段を作っても引く先が 1 箇所にしかない
- Don't 影を使う。階層はボーダーと面のカラーで作る
- Don't hover でリンクの文字色を動かす。コントラストの余裕がない
- Don't `transition: all` を書く。動かすプロパティを名指しする
- Don't 1px と 3px 以外のボーダーを引く
- Don't フォントサイズを等比の段から外す。h5 と h6 は本文と同じ大きさで太さだけ変える
- Don't 実物を見ないまま基準画像を受け入れる。撮り直す前に開く

## Terminology

見出しと本文の語は、デザインの現場で使うものに揃える。漢字に置き換えず、そのまま書く。

<!-- 使わない語そのものを表に並べるため、辞書の検査を外す -->
<!-- textlint-disable @textlint-ja/morpheme-match -->

| 使う | 使わない |
| --- | --- |
| カラー | 色 (節の見出しとして) |
| プリミティブカラー | パレット、原料 |
| セマンティックカラー | 意味づけした色 |
| ブランドカラー | ブランド色 |
| フォント、フォントファミリー | 書体 |
| フォントサイズ | 文字の大きさ |
| フォントウェイト | 文字の太さ |
| スペーシング | 余白 (節の見出しとして) |
| ボーダー | 境界線 |
| モーション | 動き |
| イージング | 曲線 |
| ブレークポイント | 画面幅の分岐点 |

<!-- textlint-enable @textlint-ja/morpheme-match -->

本文では「余白」「行間」「角丸」のような日本語も使う。これらはデザイナーも日常的に使うためだ。置き換えるのは、上の表で対応がある語だけ。
