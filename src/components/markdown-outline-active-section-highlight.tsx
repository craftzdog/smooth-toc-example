import { Box } from '@kuma-ui/core'
import { motion } from 'framer-motion'
import { Section } from '@/stores/toc'

type Props = {
  sections: Section[]
}

export const MarkdownOutlineActiveSectionHighlight = (props: Props) => {
  const { sections } = props
  const visibleSectionIds = sections
    .filter(section => section.isVisible)
    .map(section => section.id)
  const elTocItems = sections.reduce((map, s) => {
    return {
      ...map,
      [s.id]: s.outlineItemRef?.current
    }
  }, {}) as Record<string, HTMLLIElement | null | undefined>

  const firstVisibleSectionIndex = Math.max(
    0,
    sections.findIndex(section => section.id === visibleSectionIds[0])
  )

  const height: number | string = visibleSectionIds.reduce(
    (h, id) => h + (elTocItems[id]?.offsetHeight || 0),
    0
  )
  const top = sections
    .slice(0, firstVisibleSectionIndex)
    .reduce((t, s) => t + (elTocItems[s.id]?.offsetHeight || 0), 0)

  return (
    <Box
      as={motion.div}
      className="active-section-highlight"
      position="absolute"
      left="0.75rem"
      width="1px"
      background="var(--color-active)"
      layout
      initial={false}
      animate={{ opacity: 1, transition: { delay: 0.2 }, height, top }}
      exit={{ opacity: 0 }}
    />
  )
}
