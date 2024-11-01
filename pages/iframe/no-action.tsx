'use client'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useContext } from 'react'
import { Page } from 'utils/types/page'

import { AuthStatus } from '@/components/Iframe/AuthStatus'
import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'

const DefaultPage: Page = () => {
  const { isLoading, error, user } = useContext(IframeContext)
  return (
    <>
      <Box sx={{ marginBottom: '1rem' }}>
        <Typography sx={{ display: 'inline', marginRight: '10px', fontSize: '12px' }}>Dfns</Typography>{' '}
        {!!error && <Typography className="text-red-700">{error.message}</Typography>}
      </Box>
      <Box sx={{ marginBottom: '1rem' }}>{isLoading && <CircularProgress />}</Box>
      <Box sx={{ marginBottom: '1rem' }}>
        <AuthStatus user={user} />
      </Box>
    </>
  )
}
DefaultPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default DefaultPage
