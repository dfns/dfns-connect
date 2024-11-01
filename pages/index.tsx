import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Page } from 'utils/types/page'

import { MainIframeLayout } from '@/layouts/index'

const HomePage: Page = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/iframe')
  }, [router])
  return <span></span>
}

HomePage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default HomePage
