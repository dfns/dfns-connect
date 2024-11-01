'use client'
import { Page } from 'utils/types/page'

import { Loader } from '@/components/Iframe/Loader'
import { MainIframeLayout } from '@/layouts/index'

const NotStatePage: Page = () => {
  return <Loader />
}
NotStatePage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default NotStatePage
