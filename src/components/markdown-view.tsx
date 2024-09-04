import React from 'react'
import { Box } from '@kuma-ui/core'
import markdownContent from '@/example.md?raw'

export const MarkdownView: React.FC = () => {
  return <Box className="markdown-view">{markdownContent}</Box>
}
