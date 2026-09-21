import { css, Style } from 'hono/css'
import { html } from 'hono/html'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { contentWidth } from '../styles/breakpoint'
import {
  accent,
  border,
  icon,
  surface,
  surfaceHover,
  surfaceSubtle,
  text,
  textMuted,
} from '../styles/color'
import { highlightTheme } from '../styles/highlight'
import {
  canHover,
  duration,
  easing,
  enterScale,
  reducedMotion,
} from '../styles/motion'
import { borderWidth, focusRing, radius } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { dark, light, themeVariables } from '../styles/theme'
import { hoverTransition } from '../styles/transition'
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from '../styles/typography'

const bodyCss = css`
:-hono-global {
  ${themeVariables}

  body {
    color: ${text};
    background-color: ${surface};
    font-size: ${fontSize.body};
    font-family: ${fontFamily.body};

    line-height: ${lineHeight.body};
    overflow-wrap: break-word;

    margin: 0 ${space.md};
    padding: 0;

    -webkit-text-size-adjust: 100%;
  }

  :focus-visible {
    outline: ${focusRing.width} solid ${accent};
    outline-offset: ${focusRing.offset};
  }

  ${reducedMotion} {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: ${lineHeight.heading};
    font-weight: ${fontWeight.bold};
  }

  h2 {
    font-size: ${fontSize.h2};
  }

  article h2 {
    border-bottom: ${borderWidth.thin} solid ${border};
    padding-bottom: ${space['2xs']};
  }

  h3 {
    font-size: ${fontSize.h3};
  }

  h4 {
    font-size: ${fontSize.h4};
  }

  h5, h6 {
    font-size: ${fontSize.body};
  }

  h2, h3, h4, h5, h6 {
    margin: ${blockGap} 0 ${space.md};
  }

  article :is(h2, h3) {
    scroll-margin-top: ${space.lg};
  }

  p {
    margin: 0 0 ${blockGap};
  }

  ul, ol {
    margin: 0 0 ${blockGap};
    padding-left: ${space.lg};
  }

  li {
    margin-bottom: ${space['2xs']};
  }

  li:last-child {
    margin-bottom: 0;
  }

  li > ul, li > ol {
    margin: ${space['2xs']} 0 0;
  }

  hr {
    border: 0;
    border-top: ${borderWidth.thin} solid ${border};
    margin: ${blockGap} 0;
  }

  details {
    border: ${borderWidth.thin} solid ${border};
    border-radius: ${radius.md};
    margin: 0 0 ${blockGap};
    padding: ${space.sm} ${space.md};
  }

  summary {
    cursor: pointer;
    font-weight: ${fontWeight.bold};
  }

  details[open] summary {
    margin-bottom: ${space.sm};
  }

  sup {
    line-height: 0;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    border: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .theme-picker {
    display: none;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  :root[data-theme-choice] .theme-picker {
    display: block;
  }

  .theme-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${space['2xl']};
    height: ${space['2xl']};
    padding: 0;
    border: 0;
    border-radius: ${radius.full};
    background-color: transparent;
    color: ${icon};
    cursor: pointer;
    ${hoverTransition(['background-color', 'color'], { pressable: true })}
  }

  ${canHover} {
    .theme-trigger:hover {
      background-color: ${surfaceHover};
      color: ${text};
    }
  }

  .theme-trigger[aria-expanded=true] {
    background-color: ${surfaceHover};
    color: ${text};
  }

  .theme-choice {
    display: none;
  }

  :root[data-theme-choice=system] .theme-choice-system,
  :root[data-theme-choice=light] .theme-choice-light,
  :root[data-theme-choice=dark] .theme-choice-dark {
    display: inline-flex;
  }

  .theme-menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1;
    min-width: 240px;
    padding: ${space['2xs']};
    border: ${borderWidth.thin} solid ${border};
    border-radius: ${radius.md};
    background-color: ${surface};
    text-align: left;
    transform-origin: top right;
    transition-property: opacity, scale, display;
    transition-duration: ${duration.fast}, ${duration.spring}, ${duration.spring};
    transition-timing-function: ${easing.standard}, ${easing.spring}, linear;
    transition-behavior: allow-discrete;

    @starting-style {
      opacity: 0;
      scale: ${enterScale};
    }
  }

  .theme-menu[hidden] {
    opacity: 0;
    scale: ${enterScale};
    transition-duration: ${duration.exit}, ${duration.exit}, ${duration.exit};
    transition-timing-function: ${easing.standard}, ${easing.out}, linear;
  }

  ${reducedMotion} {
    .theme-menu,
    .theme-menu[hidden] {
      scale: none;
      transition-property: opacity, display;
    }

    .theme-menu {
      @starting-style {
        scale: none;
      }
    }
  }

  @view-transition {
    navigation: auto;
  }

  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: ${duration.navigation};
    animation-timing-function: ${easing.standard};
  }

  ::view-transition-group(*.post) {
    animation-duration: ${duration.spring};
    animation-timing-function: ${easing.spring};
  }

  :root:active-view-transition-type(post)::view-transition-old(*),
  :root:active-view-transition-type(post)::view-transition-new(*) {
    animation-duration: ${duration.spring};
    animation-timing-function: ${easing.spring};
  }

  :root:active-view-transition-type(theme)::view-transition-old(root),
  :root:active-view-transition-type(theme)::view-transition-new(root) {
    animation-duration: ${duration.base};
  }

  :root:active-view-transition-type(next)::view-transition-old(root) {
    animation-name: vt-fade-out, vt-shift-out-next;
    animation-duration: ${duration.navigation}, ${duration.spring};
    animation-timing-function: ${easing.standard}, ${easing.spring};
  }

  :root:active-view-transition-type(next)::view-transition-new(root) {
    animation-name: vt-fade-in, vt-shift-in-next;
    animation-duration: ${duration.navigation}, ${duration.spring};
    animation-timing-function: ${easing.standard}, ${easing.spring};
  }

  :root:active-view-transition-type(previous)::view-transition-old(root) {
    animation-name: vt-fade-out, vt-shift-out-previous;
    animation-duration: ${duration.navigation}, ${duration.spring};
    animation-timing-function: ${easing.standard}, ${easing.spring};
  }

  :root:active-view-transition-type(previous)::view-transition-new(root) {
    animation-name: vt-fade-in, vt-shift-in-previous;
    animation-duration: ${duration.navigation}, ${duration.spring};
    animation-timing-function: ${easing.standard}, ${easing.spring};
  }

  @keyframes vt-fade-out {
    to {
      opacity: 0;
    }
  }

  @keyframes vt-fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes vt-shift-out-next {
    to {
      transform: translateX(calc(-1 * ${space.md}));
    }
  }

  @keyframes vt-shift-in-next {
    from {
      transform: translateX(${space.md});
    }
  }

  @keyframes vt-shift-out-previous {
    to {
      transform: translateX(${space.md});
    }
  }

  @keyframes vt-shift-in-previous {
    from {
      transform: translateX(calc(-1 * ${space.md}));
    }
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: ${space.xs};
    width: 100%;
    padding: ${space.xs} ${space.sm};
    border: 0;
    border-radius: ${radius.sm};
    background-color: transparent;
    color: ${text};
    font-size: ${fontSize.bodySmall};
    font-family: inherit;
    line-height: ${lineHeight.tight};
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    ${hoverTransition(['background-color'], { pressable: true })}
  }

  ${canHover} {
    .theme-option:hover {
      background-color: ${surfaceHover};
    }
  }

  .theme-check {
    display: inline-flex;
    margin-left: auto;
    color: ${accent};
  }

  .footnotes {
    border-top: ${borderWidth.thin} solid ${border};
    margin-top: ${blockGap};
    padding-top: ${space.lg};
    font-size: ${fontSize.bodySmall};
    color: ${textMuted};
  }

  article > svg,
  [data-post-part=excerpt] > svg {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto ${blockGap};
    border-radius: ${radius.md};
  }

  code {
    background-color: ${surfaceSubtle};
    border: ${borderWidth.thin} solid ${border};
    border-radius: ${radius.sm};
    font-family: ${fontFamily.mono};
    font-size: 0.85em;
    padding: 2px 6px;
  }

  pre {
    margin: 0 0 ${blockGap};
    border-radius: ${radius.md};
    overflow: hidden;
  }

  ${highlightTheme}

  code.hljs {
    display: block;
    overflow-x: auto;
    padding: ${space.md};

    font-size: ${fontSize.code};
    font-family: ${fontFamily.mono};
    border: none;
  }

  .emgithub-file .code-area td.hljs-ln-line {
    font-size: ${fontSize.code} !important;
    font-family: ${fontFamily.mono} !important;
  }
}
`

const mainCss = css`
  margin: 0 auto;
  max-width: ${contentWidth};
`

export default jsxRenderer(
  (
    {
      children,
      title: propsTitle,
      description: propsDescription,
      frontmatter,
      noindex,
    },
    c,
  ) => {
    const description =
      frontmatter?.description ||
      propsDescription ||
      'Webエンジニアリングについて学んだことや考えたことをまとめるブログです'

    const title = propsTitle
      ? `${propsTitle} - ぷらすのブログ`
      : 'ぷらすのブログ'

    const canonicalUrl = `https://blog.p1ass.com${c.req.path}`

    const isPostListPage = /^\/(?:page\/\d+\/)?$/.test(c.req.path)

    const ogImage = frontmatter?.ogImage
      ? `https://blog.p1ass.com${frontmatter.ogImage}`
      : frontmatter
        ? `${canonicalUrl}og.png`
        : 'https://blog.p1ass.com/static/ogp.png'
    return (
      <html lang='ja'>
        <head>
          <meta charset='utf-8' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
          <title>{title}</title>

          <meta name='description' content={description} />
          <meta
            name='theme-color'
            content={light.surface}
            media='(prefers-color-scheme: light)'
            data-scheme='light'
          />
          <meta
            name='theme-color'
            content={dark.surface}
            media='(prefers-color-scheme: dark)'
            data-scheme='dark'
          />
          <ThemeScript />
          <ViewTransitionScript />
          <link rel='expect' href='#main' blocking='render' />
          {noindex ? (
            <meta name='robots' content='noindex' />
          ) : (
            <>
              <meta name='robots' content='max-image-preview:large' />
              <link rel='canonical' href={canonicalUrl} />
            </>
          )}
          <meta
            property='og:type'
            content={frontmatter ? 'article' : 'website'}
          />
          {frontmatter ? (
            <meta
              property='article:published_time'
              content={frontmatter.date}
            />
          ) : null}
          <meta property='og:description' content={description} />
          <meta property='og:image' content={ogImage} />
          <meta property='og:url' content={canonicalUrl} />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@p1ass' />
          <meta name='twitter:creator' content='@p1ass' />
          <meta property='og:title' content={title} />
          <meta property='og:site_name' content={siteName} />
          {frontmatter ? (
            <JsonLd
              data={{
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: frontmatter.title,
                description,
                image: [ogImage],
                datePublished: frontmatter.date,
                author: [author],
                mainEntityOfPage: canonicalUrl,
              }}
            />
          ) : null}
          {c.req.path === '/' ? (
            <JsonLd
              data={{
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: siteName,
                url: `${siteUrl}/`,
              }}
            />
          ) : null}

          {import.meta.env.PROD ? <GoogleAnalytics /> : null}

          <link rel='icon' sizes='16x16 24x24' href='/static/favicon.ico' />
          <link
            rel='icon'
            type='image/png'
            sizes='96x96'
            href='/static/favicon-96x96.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/static/apple-touch-icon.png'
          />
          <link
            href='/index.xml'
            rel='alternate'
            type='application/rss+xml'
            title='ぷらすのブログ'
          />
          <Script src='/app/client.ts' async />
          <SpeculationRules />
          <Style />
        </head>
        <body class={bodyCss}>
          <Header asHeading={isPostListPage} />
          <main id='main' class={mainCss}>
            {children}
          </main>
          <Footer />
        </body>
      </html>
    )
  },
)

const siteUrl = 'https://blog.p1ass.com'

const siteName = 'ぷらすのブログ'

const author = {
  '@type': 'Person',
  name: 'ぷらす',
  url: 'https://p1ass.com',
  sameAs: ['https://github.com/p1ass', 'https://twitter.com/p1ass'],
}

const escapeScriptEnd = (json: string) => json.replace(/</g, '\\u003c')

const JsonLd = ({ data }: { data: object }) => {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: escapeScriptEnd(JSON.stringify(data)),
      }}
    />
  )
}

const ThemeScript = () => {
  return html`
    <script>
      (function () {
        var root = document.documentElement;
        function apply(choice, persist) {
          if (persist && document.startViewTransition) {
            var run = function () {
              update(choice, persist);
            };
            var supportsTypes = window.ViewTransition && 'types' in ViewTransition.prototype;
            if (supportsTypes) {
              document.startViewTransition({ update: run, types: ['theme'] });
            } else {
              document.startViewTransition(run);
            }
            return;
          }
          update(choice, persist);
        }
        function update(choice, persist) {
          var transitionFreeze = null;
          if (persist) {
            transitionFreeze = document.createElement('style');
            transitionFreeze.textContent = '*, *::before, *::after { transition: none !important; }';
            document.head.appendChild(transitionFreeze);
          }
          root.dataset.themeChoice = choice;
          if (choice === 'system') {
            root.removeAttribute('data-theme');
          } else {
            root.setAttribute('data-theme', choice);
          }
          var metas = document.querySelectorAll('meta[name=theme-color]');
          for (var i = 0; i < metas.length; i++) {
            var scheme = metas[i].getAttribute('data-scheme');
            metas[i].media =
              choice === 'system'
                ? '(prefers-color-scheme: ' + scheme + ')'
                : choice === scheme
                  ? 'all'
                  : 'not all';
          }
          if (persist) {
            try {
              if (choice === 'system') {
                localStorage.removeItem('theme');
              } else {
                localStorage.setItem('theme', choice);
              }
            } catch (e) {}
          }
          if (transitionFreeze) {
            window.getComputedStyle(document.body).color;
            setTimeout(function () {
              transitionFreeze.remove();
            }, 1);
          }
        }
        window.__applyTheme = apply;
        var stored = null;
        try {
          stored = localStorage.getItem('theme');
        } catch (e) {}
        apply(stored === 'light' || stored === 'dark' ? stored : 'system', false);
      })();
    </script>
  `
}

const ViewTransitionScript = () => {
  return html`
    <script>
      (function () {
        if (!('onpagereveal' in window)) {
          return;
        }
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        var postKey = 'view-transition:post';
        function key(from, to) {
          return 'view-transition:' + from + '>' + to;
        }
        function nameVisiblePostParts(path) {
          var parts = document.querySelectorAll('[data-post="' + path + '"]');
          var named = 0;
          for (var i = 0; i < parts.length; i++) {
            var rect = parts[i].getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              parts[i].style.viewTransitionName = 'post-' + parts[i].dataset.postPart;
              parts[i].style.viewTransitionClass = 'post';
              named++;
            }
          }
          return named;
        }
        function clearPosts() {
          var parts = document.querySelectorAll('[data-post]');
          for (var i = 0; i < parts.length; i++) {
            parts[i].style.viewTransitionName = '';
            parts[i].style.viewTransitionClass = '';
          }
        }
        window.addEventListener('pageswap', function (event) {
          clearPosts();
          try {
            sessionStorage.removeItem(postKey);
          } catch (e) {}
          if (!event.viewTransition || !event.activation || reduce.matches) {
            return;
          }
          var to = new URL(event.activation.entry.url).pathname;
          var shared = to;
          if (!nameVisiblePostParts(to)) {
            if (to.indexOf('/posts/') === 0 || !nameVisiblePostParts(location.pathname)) {
              return;
            }
            shared = location.pathname;
          }
          try {
            sessionStorage.setItem(postKey, shared);
          } catch (e) {}
        });
        window.addEventListener('pagereveal', function (event) {
          clearPosts();
          var shared = null;
          try {
            shared = sessionStorage.getItem(postKey);
            sessionStorage.removeItem(postKey);
          } catch (e) {}
          if (!event.viewTransition || !shared) {
            return;
          }
          if (nameVisiblePostParts(shared) && event.viewTransition.types) {
            event.viewTransition.types.add('post');
          }
          event.viewTransition.finished.then(clearPosts, clearPosts);
        });
        document.addEventListener('click', function (event) {
          var link = event.target.closest && event.target.closest('a[data-direction]');
          if (!link) {
            return;
          }
          var to = new URL(link.href).pathname;
          var direction = link.dataset.direction;
          try {
            sessionStorage.setItem(key(location.pathname, to), direction);
            sessionStorage.setItem(key(to, location.pathname), direction === 'next' ? 'previous' : 'next');
          } catch (e) {}
        });
        window.addEventListener('pagereveal', function (event) {
          var activation = window.navigation && window.navigation.activation;
          if (!event.viewTransition || !event.viewTransition.types || !activation || !activation.from || reduce.matches) {
            return;
          }
          var direction = null;
          try {
            direction = sessionStorage.getItem(key(new URL(activation.from.url).pathname, location.pathname));
          } catch (e) {}
          if (direction) {
            event.viewTransition.types.add(direction);
          }
        });
      })();
    </script>
  `
}

const SpeculationRules = () => {
  return html`
    <script type="speculationrules">
      {
        "prefetch": [
          {
            "where": {
              "and": [
                { "href_matches": "/*" },
                { "not": { "href_matches": "/*.xml" } }
              ]
            },
            "eagerness": "moderate"
          }
        ]
      }
    </script>
  `
}

const GoogleAnalytics = () => {
  return (
    <>
      <script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-L66BDEDS3J'
      />
      {html`
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-L66BDEDS3J');
        </script>
      `}
    </>
  )
}
