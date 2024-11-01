'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Page } from 'utils/types/page'

import Loader from '@/components/Iframe/Loader'
import { MainIframeLayout } from '@/layouts/index'

const MotionLoader = motion(Loader)

const WaitingStatePage: Page = () => {
  return (
    <AnimatePresence>
      <MotionLoader
        initial={{ opacity: 0, x: '30px' }}
        animate={{ opacity: 1, x: '0px' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
    </AnimatePresence>
  )
}
WaitingStatePage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default WaitingStatePage
