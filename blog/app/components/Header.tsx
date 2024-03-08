import { css } from 'hono/css'
import { border, gray, grayLight } from '../styles/color'

const headerCss = css`
overflow: auto;
  border-bottom: 1px solid ${border};
  `

const headerContainerCss = css`
  margin: 0.85rem auto;
  text-align: center;
`

const titleCss = css`
  margin: 0.425rem 0;

  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
  margin: 0.425rem 0;
  color: ${gray};
  text-decoration: none;
  
  &:hover,
  &:focus {
    color: ${grayLight};
  }

  &:after {
    display: none;
  }
`

const navigationListCss = css`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: center;

  li {
    display: inline-block;
    padding: 0 1.5rem;
    margin: 0.2125rem 0 0.2125rem;

    a {
      color: ${grayLight};
      -webkit-transition: all 0.2s ease-out;
      -moz-transition: all 0.2s ease-out;
      transition: all 0.2s ease-out;
      text-decoration: none;

      &:hover,
      &:focus {
        color: ${gray};
      }
    }
  }
`

export const Header = () => {
  return (
    <header class={headerCss}>
      <div class={headerContainerCss}>
        <a href='/' class={titleCss}>
          <h2>ぷらすのブログ</h2>
        </a>
        <ul class={navigationListCss}>
          <li>
            <a href='/categories'>Categories</a>
          </li>
          <li>
            <a href='/tags'>Tags</a>
          </li>
          <li>
            <a href='/index.xml'>RSS</a>
          </li>
          <li>
            <a
              href='https://p1ass.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              Portfolio
            </a>
          </li>
          <li>
            <a
              href='https://github.com/p1ass'
              target='_blank'
              rel='noopener noreferrer'
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href='https://twitter.com/p1ass'
              target='_blank'
              rel='noopener noreferrer'
            >
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
