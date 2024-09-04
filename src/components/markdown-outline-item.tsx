import { useEffect, useRef } from 'react'
import { Box, Link } from '@kuma-ui/core'
import { useTocStore } from '@/stores/toc'
import { TOCHeading } from '@/utils/mdast-extract-headings'

type Props = TOCHeading & { active: boolean }

export const MarkdownOutlineItem = (props: Props) => {
  const { id, level, value, active } = props
  const refItem = useRef<HTMLLIElement>(null)
  const registerOutlineItem = useTocStore(state => state.registerOutlineItem)

  useEffect(() => {
    if (id) registerOutlineItem(id, refItem)
  }, [id, registerOutlineItem])

  return (
    <Box
      ref={refItem}
      as="li"
      data-id={id}
      className="outline-item"
      lineHeight="1.5rem"
      paddingTop="0.25rem"
      paddingBottom="0.25rem"
    >
      <Box ml={level * 20}>
        <Link
          href={`#${id}`}
          textDecoration="none"
          transition="color 0.2s ease-in-out"
          color={
            active ? 'var(--outline-active-fg)' : 'var(--outline-default-fg)'
          }
        >
          {value}
        </Link>
      </Box>
    </Box>
  )
}
