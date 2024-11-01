import type { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

// eslint-disable-next-line
export type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode
}
