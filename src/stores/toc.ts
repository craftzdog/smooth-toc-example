import { create } from 'zustand'
import {
  mdastExtractHeadings,
  TOCHeading
} from '@/utils/mdast-extract-headings'
import { loggerMiddleware } from './logger'
import type { Root } from 'mdast'

export type Section = TOCHeading
export type TocState = {
  sections: Section[]
  update: (mdast: Root) => void
}

export const useTocStore = create<TocState>(
  loggerMiddleware((set, get) => ({
    sections: [],
    update: (mdast: Root) => {
      if (mdast) {
        const sections = mdastExtractHeadings(mdast).map(h => {
          return {
            ...h,
            isVisible: false
          }
        })

        set({ sections })
      } else {
        set({ sections: [] })
      }
    }
  }))
)
