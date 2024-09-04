import './markdown-view.css'
import React, { useEffect } from 'react'
import { Box } from '@kuma-ui/core'
import markdownContent from '@/example.md?raw'
import { useVisibleSections } from '@/hooks/use-visible-sections'
import { useContentStore } from '@/stores/content'

export const MarkdownView: React.FC = () => {
  const { dom, render } = useContentStore()

  useEffect(() => {
    render(markdownContent)
  }, [render])

  useVisibleSections()

  return <Box className="markdown-view">{dom ? dom : 'rendering...'}</Box>
}
