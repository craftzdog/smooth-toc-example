import Slugger from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'

const slugs = new Slugger()

export type TOCHeading = {
  value: string
  id: string
  level: number
}

export const mdastExtractHeadings = (
  mdast: Root,
  { maxDepth }: { maxDepth: number } = { maxDepth: 3 }
) => {
  slugs.reset()
  const headings: TOCHeading[] = []

  visit(mdast, 'heading', function (node, _position, _parent) {
    const value = toString(node, { includeImageAlt: false })
    const id =
      node.data && node.data.hProperties && (node.data.hProperties.id as string)
    const slug = slugs.slug(id || value)

    if (node.depth <= maxDepth) {
      headings.push({
        value,
        id: slug,
        level: node.depth
      })
    }
  })

  return headings
}
