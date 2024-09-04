import { Box, BoxProps } from '@kuma-ui/core'

interface Props extends BoxProps {}

export const MainContent = ({ children, ...boxProps }: Props) => {
  return (
    <Box marginBottom={[0, 0, '3em', '3em']} className="main-content-container">
      <Box
        className="main-content"
        width="100%"
        marginTop={[0, 0, '3em', '3em']}
        paddingTop={'1em'}
        paddingBottom="2em"
        paddingLeft={['1em', '1em', '1.5em', '1.5em', '2em']}
        paddingRight="1em"
        backgroundColor="var(--main-content-bg)"
        borderRadius={[0, 0, '0.4em']}
        boxShadow="var(--main-content-box-shadow)"
        {...boxProps}
      >
        {children}
      </Box>
    </Box>
  )
}
