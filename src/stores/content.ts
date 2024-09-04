import { EXIT, visit } from 'unist-util-visit'
import YAML from 'yaml'
import { create } from 'zustand'
import { mdastExtractHeadings } from '@/utils/mdast-extract-headings'
import type { Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'

type ContentType = React.ReactElement<
  unknown,
  string | React.JSXElementConstructor<any>
>

interface ContentState {
  dom: ContentType | null
  mdast: MdastRoot | null
  hast: HastRoot | null
  title: string | null
  render: (markdown: string) => Promise<void>
  lastError: Error | null | undefined
}

export const useContentStore = create<ContentState>(set => ({
  renderId: 0,
  dom: null,
  mdast: null,
  hast: null,
  title: null,
  lastError: null,
  render: async (markdown: string) => {
    try {
      const { MarkdownRenderer } = await import('@/markdown-renderer')
      const renderer = new MarkdownRenderer()
      const { result: dom, mdast, hast } = await renderer.render(markdown)
      let title = ''

      visit(mdast, 'yaml', node => {
        const frontmatter = YAML.parse(node.value)
        title = frontmatter.title || ''
        return EXIT
      })

      const headings = mdastExtractHeadings(mdast)
      console.log('headings:', headings)

      set({ dom, mdast, hast, title, lastError: null })
    } catch (e: any) {
      console.error(`Failed to render preview: ${e.stack}`)
      set({
        dom: null,
        mdast: null,
        hast: null,
        title: null,
        lastError: new Error('Failed to render Markdown')
      })
    }
  }
}))
