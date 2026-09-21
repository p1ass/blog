---
version: alpha
name: ぷらすのブログ
description: 日本語の技術ブログのスタイルガイド
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
  dark-brand-surface-border: "{colors.neutral-500}"
  dark-github-mark: "#ffffff"
  dark-x-mark: "#ffffff"
  # 他社のブランドカラー。こちらでは決められないので、コントラストの検証から外す
  brand-hatena: "#4ba3d9"
  brand-x-hover: "#444444"
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
    height: 112px
  link-card-hover:
    backgroundColor: "{colors.surface-subtle}"
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
  toc-item:
    textColor: "{colors.text-muted}"
    typography: "{typography.body-sm}"
    padding: "{spacing.2xs}"
  toc-item-current:
    textColor: "{colors.text}"
---

# DESIGN.md

blog.p1ass.com のデザイン思想と基本方針をまとめたドキュメント。[design.md](https://github.com/google-labs-code/design.md) の形式で記述している。frontmatter は `npx @google/design.md lint DESIGN.md` で検証できる。

複数のコンポーネントにまたがる全体方針のみを記載する。個別のコンポーネントの寸法や配置などはスタイルガイド (`/styleguide`) で確認する。

デザインを変更する場合は [design-system Skill](.claude/skills/design-system/SKILL.md) を実行する。

## Overview

このブログは日本語の技術記事を腰を据えて読んでもらうことを目的としている。想定読者は仕事の合間に検索から訪れるエンジニアであり、記事を最後まで読み通せるデザインを目指す。

デザインは控えめにし、記事の内容より主張しすぎないようにする。派手な装飾ではなく、行長と行間と余白のリズムで読みやすさを作る。色数を絞り、単一色相の濃淡を用いたスタイリングによって、長文を読んでも目が疲れにくい設計とする。

## Colors

単一色相の濃淡で表現する。プリミティブカラーは neutral (色相 216 度) と accent (色相 215 度) の 2 系統を基本とする。これらに加え、注意と補足を明示するための色相を 2 つ定義している。

- **Primary (#4172b5):** リンク、アクセントボーダー、フォーカスリングに用いる唯一のアクセントカラー。OG 画像にも使用する事実上のブランドカラー。
- **Secondary (#636e7d):** 日付やキャプションなど、本文より控えめに表示したい文字に用いる。
- **Neutral (#ffffff 〜 #0f1114):** ベースと文字。全 12 段階が同一色相であり、ライトテーマとダークテーマの双方で利用する。
- **Warning (#a35b00) / Tip (#1f7a3d):** 注意と補足を示すカラー。accent と同一色相の濃淡では流し読みした際に見分けがつかないため、独立した色相を割り当てている。

### カラーの濃淡スケール

数字は明度の目安であり、値が小さいほど明るい。

accent の 300 のみ彩度を高めに設定している (他のスケールが 47% であるのに対し、300 は 80%)。ダークテーマのベースの上に配置した際、同じ彩度では色みが弱く見え、リンクの青がくすんで感じられるため。

他社のブランドカラーは `brand-*` として定義し、コントラストの検証対象から除外する。[WCAG 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum) においても、ロゴやブランド名の一部であるテキストは Logotypes の例外としてコントラスト要件から除外されている。

### コントラスト

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) の AA 基準を満たす。本文の 4.5 対 1 と大きい文字の 3 対 1 が [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)、UI コンポーネントと図形の 3 対 1 が [1.4.11 Non-text Contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast) にあたる。役割の組み合わせは両テーマで自動検証している。

## Typography

読者の OS のフォントを使い、Web フォントは入れない。表示速度を保つためであり、デザインの工夫はフォントそのものより行長・行間・フォントサイズの整理で行う。

- **本文:** 17px、行間 1.9。日本語の長文で読みやすいとされる 1.8〜2.0 の中央値を採用した。
- **見出し:** 本文 17px を基準に、比率 1.2 の等比スケールで 20 / 24 / 28 / 34px を設定する。太字にして行間を 1.4 まで詰める。h5 と h6 は本文と同じ大きさに揃え、太さだけで区別する (これ以上小さくすると本文を下回り、見出しに見えなくなるため)。
- **キャプション:** 13px。日付や補足など、本文より一段落とす文字に使う。
- **コード:** 等幅の 14px。地の文より小さくして、行の詰まりを抑える。

行間は倍率で保持し、px では持たない。px 固定にすると、フォントサイズを変更した際の追従が難しくなるため。

`font-family` には和文フォントを先に並べる。欧文だけのフォントを先に置くと、和文がそのフォントのフォールバックに委ねられ、環境によって別のフォントで描画されてしまうため。

## Layout

本文は最大 760px の 1 カラム。17px で 1 行が全角 44 文字になる。日本語で読みやすいとされる目安 (1 行 35〜45 文字) の上限側に寄せている。行が短いと視線の折り返しが増え、長文を読む際の疲れにつながるため。

スペーシングはすべて 4px の倍数とする。細かな刻みを取っても端数が出ないようにするため。

本文のブロック間は `block-gap` (32px) で統一する。行送りとほぼ同じ値にすることで、本文が一定のリズムで流れる。

ブレークポイントは 640px と 1080px の 2 段。1080px は、本文の右に目次を置ける幅にあたる。

本文の右に目次などを配置するページでは、中身の入る列をその幅まで広げ、列ごと画面中央に配置する。本文を中央に置いたままだと、右に置いたぶん左の余白が広くなり、ページが右へ寄って見えてしまうため。ヘッダーからフッターまで画面の中央に揃えつつ、本文の列は広げた列の左端へ寄せる。

## Elevation & Depth

**シャドウを使わない。** ダークテーマでは影がほとんど見えず、2 テーマ分のカラーを適切に設定するのが難しいため。

階層はボーダーと面のカラーで表現する。`surface`、`surface-subtle`、`border` の組み合わせで奥行きを出す。

面どうしの差は、ダークテーマのほうが広く出る。スケールの刻みがダークテーマだと粗いため。背景に対して `surface-subtle` はライトが 1.05 対 1、ダークが 1.17 対 1、`border` はライトが 1.32 対 1、ダークが 1.99 対 1 になる。中間のスケールを作れば揃えられるが、暗い背景では同じ比でも差が見えにくいため、あえて粗いスケールのまま使う。

## Shapes

角丸は 3 パターン用意している。小さな要素に 4px、面を持つ要素に 8px、円形のものに `full` を使う。

ボーダーの太さは 1px とする。3px は強調したいときだけ使う。

## Components

コンポーネントごとのデザインはスタイルガイドを参照。このセクションでは、どのコンポーネントにも当てはまる方針だけを記載する。

### リンク

リンクはカラーだけでなく、下線でも見分けられるようにする。

文字のカラーは hover しても変えない。accent には、本文の基準に対するコントラストの余裕がないため。

### フォーカス

フォーカスリングは `:focus-visible` としてグローバルにスタイルを当てる。要素ごとにスタイルを当てると、指定し忘れた要素だけキーボードでフォーカスできなくなってしまうため。`:focus` ではなく `:focus-visible` を使っているのは、マウスで押した直後にリングが残るのを避けるため。

### 画像

画像は読み込む前から場所を確保することで Layout Shift をなくす。

### モーション

カラーの変化と、位置やサイズの動きで扱いを分ける。

カラーの変化は `ease` で 150ms。hover から離れたときの戻りは 100ms にして、入るときより速くする。読者が選んでいる途中の変化はゆっくりでよいが、離れた後まで変化が残ると反応が鈍く見えるため。

位置とサイズの動きは、減衰比 1 のばね (Apple の定義で response 0.35 秒) を `linear()` で近似したイージングを用い、450ms かけて動かす。跳ね返らずに、最後にゆっくり収まる。`cubic-bezier` の ease-out を短く当てると、一瞬で止まって硬く見えるため。入るときと戻るときで、ばねの曲線は変えない。

動かすプロパティは明示的に指定する。`transition: all` は将来足したプロパティにも適用されてしまい、カラーを変えるつもりの hover で padding や width まで動いてしまうのを防ぐため。

位置とサイズは `transform` で動かし、`width` や `margin` は動かさない。毎フレームの再計算が発生してしまうため。

ボタンは押している間 `scale(0.97)` に縮める。押したことを、ページが移る前に読者へフィードバックする。押したときは出だしの強い `cubic-bezier(0.23, 1, 0.32, 1)` で 100ms かけて素早く縮め、離したときはばねで戻す。面積の大きいカードは縮小させない。

読者がテーマを選んだら、View Transitions でページ全体を 250ms のクロスフェードで切り替える。明暗が一瞬で入れ替わると目に負担がかかるため。要素ごとの transition はその間止める。止めないと、transition を持つ要素だけがベースより遅れて見えてしまう。

ページの遷移は View Transitions で 200ms のクロスフェードにする。遷移は読者が何度も繰り返す操作なので短くし、ページ全体の位置は大きく動かさない。

動きを減らす設定の読者には、`prefers-reduced-motion: reduce` で位置と大きさの動きだけを止める。カラーや透明度の補間、テーマとページのクロスフェードは酔いの原因にならないのでそのままにする。

## Theming

ライトテーマとダークテーマの 2 つを持つ。デフォルトは OS の設定への追従だが、読者が明示的に選べるようにする。一度選んだ後も、OS への追従へ戻せるようにする。

ダークテーマの割り当ては、ライトテーマのスケールの並びをそのまま裏返して作る。たとえば text は neutral-900 と neutral-200、surface は neutral-0 と neutral-950 を対応させ、ベースと文字の関係を入れ替える。

### テーマで切り替えないもの

Mermaid の図はビルド時に描画されるが、本文に SVG として埋め込むため、色を CSS 変数へ置き換えてテーマに追従させる。

## Iconography

アイコンは図形をソースに書き、外部から読み込まない。外部の Font Awesome を使うと外部 JS の読み込みが発生してしまうため。

ブランドマークは [Simple Icons](https://simple-icons.org) から取る。プロジェクト自体は CC0 だが、[DISCLAIMER](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md) が「収録アイコンすべてが CC0 とは限らない」と断っているとおり、マークの商標は各社に残る。使うのは各社が配布を認めている範囲にとどめる。それ以外のアイコンは自前でレンダリングする。

ブランドマークの形と色は変えない。ダークモードに配置するときは、各社がダークモード向けに配っているバージョンを使う。

## Do's and Don'ts

- Do 値をトークンから参照する。カラーと寸法とブレークポイントを、コンポーネント側で決めない。
- Do カラーを足すときはライトテーマとダークテーマの両方を同時に決める。
- Do 新しいロールを追加したら、コントラストの検証にその組み合わせを追加する。
- Do そのコンポーネントのみで決まる寸法 (アバターの直径など) は生の値のまま書く。
- Don't シャドウを使う。
- Don't hover でリンクの文字カラーを変える。
- Don't 状態をカラーだけで表現する。色の見え方によっては意図を伝えづらいため。
- Don't `transition: all` を書く。動かすプロパティを明示的に指定する。

## Terminology

見出しと本文の単語は、デザインの現場で使うものに揃える。漢字に置き換えない。

<!-- 使わない語そのものを表に並べるため、辞書の検査を外す -->
<!-- textlint-disable ai-words-ja/no-ai-words -->

| 使う                         | 使わない                |
| ---------------------------- | ----------------------- |
| カラー                       | 色 (節の見出しとして)   |
| プリミティブカラー           | パレット、原料          |
| セマンティックカラー         | 意味づけした色          |
| ブランドカラー               | ブランド色              |
| フォント、フォントファミリー | 書体                    |
| フォントサイズ               | 文字の大きさ            |
| フォントウェイト             | 文字の太さ              |
| スペーシング                 | 余白 (節の見出しとして) |
| ボーダー                     | 境界線                  |
| モーション                   | 動き                    |
| イージング                   | 曲線                    |
| ブレークポイント             | 画面幅の分岐点          |

<!-- textlint-enable ai-words-ja/no-ai-words -->

本文では「余白」「行間」「角丸」のような日本語も使う。これらはデザイナーも日常的に使うため。置き換えるのは、上の表で対応がある語だけ。
