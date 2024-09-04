import { create } from 'zustand'
import { MarkdownRenderer } from '@/markdown-renderer'
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
  render: (markdown: string) => Promise<void>
  lastError: Error | null | undefined
}

const renderer = new MarkdownRenderer()

export const useContentStore = create<ContentState>(set => ({
  renderId: 0,
  dom: null,
  mdast: null,
  hast: null,
  isKatexRequired: false,
  lastError: null,
  render: async (markdown: string) => {
    try {
      const file = await renderer.render(markdown)
      set({
        dom: file.result,
        mdast: file.mdast,
        hast: file.hast,
        lastError: null
      })
    } catch (e: any) {
      console.error(`Failed to render preview: ${e.stack}`)
      set({
        dom: null,
        mdast: null,
        hast: null,
        lastError: new Error('Failed to render Markdown')
      })
    }
  }
}))
