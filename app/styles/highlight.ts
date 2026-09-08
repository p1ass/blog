// highlight.js のテーマ。
// テーマによらず atom-one-dark の 1 つだけを持つ。
//
// コードブロックは明るいテーマでも暗いまま置く。地の文と別の役割を持つ塊として扱っているためで、
// 暗いテーマを入れたときも同じ理由で切り替えない。地に馴染ませるのはインラインコードの側の役目にしてある。
//
// 元は _renderer.tsx にベタ書きされていたものを、そのまま移してある。

// highlight.js の src/styles/atom-one-dark.css を写したもの。配布元の帰属表示をそのまま残す。
//
//   Atom One Dark by Daniel Gamage
//   Original One Dark Syntax theme from https://github.com/atom/one-dark-syntax
//
// highlight.js 本体は BSD 3-Clause (Copyright (c) 2006, Ivan Sagalaev) で、著作権表示の保持を条件にしている。
const atomOneDark = `
  .hljs {
    color: #abb2bf;
    background: #282c34;
  }
  .hljs-comment,
  .hljs-quote {
    color: #5c6370;
    font-style: italic;
  }
  .hljs-doctag,
  .hljs-keyword,
  .hljs-formula {
    color: #c678dd;
  }
  .hljs-section,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-deletion,
  .hljs-subst {
    color: #e06c75;
  }
  .hljs-literal {
    color: #56b6c2;
  }
  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute,
  .hljs-meta .hljs-string {
    color: #98c379;
  }
  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-type,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo,
  .hljs-number {
    color: #d19a66;
  }
  .hljs-symbol,
  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-title {
    color: #61aeee;
  }
  .hljs-built_in,
  .hljs-title.class_,
  .hljs-class .hljs-title {
    color: #e6c07b;
  }
  .hljs-emphasis {
    font-style: italic;
  }
  .hljs-strong {
    font-weight: bold;
  }
  .hljs-link {
    text-decoration: underline;
  }
`

export const highlightTheme = atomOneDark
