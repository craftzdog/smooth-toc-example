import { createTheme } from '@kuma-ui/core'

const theme = createTheme({
  radii: {
    sm: '0.5rem',
    md: '1rem'
  }
})

type UserTheme = typeof theme

declare module '@kuma-ui/core' {
  export interface Theme extends UserTheme {}
}

export default theme
