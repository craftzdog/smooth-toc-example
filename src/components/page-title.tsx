import React from 'react'
import { Heading } from '@kuma-ui/core'
import { useContentStore } from '@/stores/content'

export const PageTitle: React.FC = () => {
  const { title } = useContentStore()

  return <Heading px="1em">{title}</Heading>
}
