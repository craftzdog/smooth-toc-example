import { memo } from 'react'
import { Box } from '@kuma-ui/core'
import { motion } from 'framer-motion'

type Props = {}

export const MarkdownOutlineActiveSectionHighlight = memo((_props: Props) => {
  const height = 30
  const top = 40

  return (
    <Box
      as={motion.div}
      className="active-section-highlight"
      position="absolute"
      left="0.75rem"
      width="1px"
      background="var(--color-active)"
      layout
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.2 }
      }}
      exit={{ opacity: 0 }}
      style={{ height, top }}
    />
  )
})
