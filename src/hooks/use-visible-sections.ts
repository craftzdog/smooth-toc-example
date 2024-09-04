import { useCallback, useEffect, useLayoutEffect } from 'react'
import { useTocStore } from '@/stores/toc'

export function useVisibleSections() {
  const { sections, setVisibleHeadings } = useTocStore()

  const checkVisibleSections = useCallback(() => {
    const { innerHeight, scrollY } = window
    const newVisibleSections: string[] = []

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const { id, headingRef } = sections[sectionIndex]

      if (!headingRef?.current) {
        continue
      }

      const top = headingRef?.current.getBoundingClientRect().top + scrollY

      const nextSection = sections[sectionIndex + 1]
      const bottom =
        (nextSection?.headingRef?.current?.getBoundingClientRect().top ??
          Infinity) + scrollY

      if (
        (top > scrollY && top < scrollY + innerHeight) ||
        (bottom > scrollY && bottom < scrollY + innerHeight) ||
        (top <= scrollY && bottom >= scrollY + innerHeight)
      ) {
        newVisibleSections.push(id)
      }
    }

    // check if the visible sections have changed
    const oldVisibleHeadings = sections.filter(s => s.isVisible).map(s => s.id)
    const hasChanged = oldVisibleHeadings.join() !== newVisibleSections.join()
    if (hasChanged) setVisibleHeadings(newVisibleSections)
  }, [sections, setVisibleHeadings])

  useEffect(() => {
    window.addEventListener('scroll', checkVisibleSections, { passive: true })
    window.addEventListener('resize', checkVisibleSections)

    return () => {
      window.removeEventListener('scroll', checkVisibleSections)
      window.removeEventListener('resize', checkVisibleSections)
    }
  }, [sections, checkVisibleSections])

  useLayoutEffect(() => checkVisibleSections())
}
