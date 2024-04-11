import { css } from 'hono/css'
import { border, gray, grayLight } from '../styles/color'
import { verticalRhythmUnit } from '../styles/variables'

const authorWrapperCss = css`
  border: solid 1px ${border};
  padding: ${verticalRhythmUnit * 0.5}rem;
  border-radius: ${verticalRhythmUnit * 0.5}rem;
  display: flex;
  margin-bottom: ${verticalRhythmUnit}rem;
`

const authorImageWrapper = css`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  margin: 0 1rem 0 0;
  width: 100px;
  
  @media (max-width: 600px) {
      width: 80px;
  }
`

const authorImageCss = css`
  border-radius: 100%;
  border: 1px solid ${border};
  margin: 0;
  width: 100%;
  height: auto;
`

const authorNameCss = css`
  font-size: 1.2rem;
  margin-bottom: ${verticalRhythmUnit * 0.25}rem;
  font-weight: bold;
`

const authorDescriptionCss = css`
  margin: 0;
  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`

const authorSNSLinkCss = css`
  color: ${gray};
  margin-right: 1rem;
  text-decoration: none;
  
  &:hover {
      color: ${grayLight};
  }

  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
`

const authorSNSGitHubCss = css`
  ${authorSNSLinkCss}
  & i {
    color: #211f1f;
    padding-right: 0.2rem;
  }
`

const authorSNSTwitterCss = css`
  ${authorSNSLinkCss}
  & i {
    color: #1b95e0;
    padding-right: 0.2rem;
  }
`

export function Author() {
  return (
    <aside class={authorWrapperCss}>
      <div class={authorImageWrapper}>
        <img src={'/static/icon.png'} class={authorImageCss} alt='筆者画像' />
      </div>
      <div>
        <div class={authorNameCss}>ぷらす (p1ass)</div>
        <p class={authorDescriptionCss}>
          サーバーサイドエンジニア。GoやISUCONが好きです。
        </p>
        <a
          href='https://github.com/p1ass'
          class={authorSNSGitHubCss}
          target='_blank'
          rel='noopener noreferrer'
        >
          <i class='fab fa-github author-sns-github' />
          p1ass
        </a>
        <a
          href='https://twitter.com/p1ass'
          class={authorSNSTwitterCss}
          target='_blank'
          rel='noopener noreferrer'
        >
          <i class='fab fa-twitter author-sns-twitter' />
          p1ass
        </a>
      </div>
    </aside>
  )
}
