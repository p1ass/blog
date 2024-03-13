import { css } from 'hono/css'

export function transition(duration: number) {
  return css`
        -webkit-transition: all ${duration}s ease-out;
        -moz-transition: all ${duration}s ease-out;
        transition: all ${duration}s ease-out;
    `
}
