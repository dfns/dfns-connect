'use client'
import { Typography } from '@mui/material'
import { useContext } from 'react'
import { Page } from 'utils/types/page'

import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'
import { useWhiteLabelTheme } from '@/utils/hooks/iframe/useWhiteLabelTheme'

const ParentErrorPage: Page = () => {
  const whiteLabelTheme = useWhiteLabelTheme()
  const { parentErrorMessage } = useContext(IframeContext)
  return (
    <>
      <Typography
        color={whiteLabelTheme?.indicators?.errorColor || 'red'}
        sx={{ display: 'inline', marginRight: '10px', fontSize: '24px' }}
      >
        Error
      </Typography>{' '}
      <Typography color={whiteLabelTheme?.indicators?.errorColor || 'red'} sx={{ margin: '10px 0px' }}>
        {parentErrorMessage}
      </Typography>
    </>
  )
}
ParentErrorPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default ParentErrorPage
