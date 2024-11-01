'use client'
import { Box, Typography } from '@mui/material'
import { Page } from 'utils/types/page'

import { LoginButton } from '@/components/Iframe/LoginButton'
import { MainIframeLayout } from '@/layouts/index'
import { IframeActiveState } from '@/utils/types/dfnsConnect'

const DefaultPage: Page = () => {
  return (
    <Box
      sx={{ marginX: 'auto' }}
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      maxWidth="600px"
      minHeight="calc(100vh - 250px)"
      marginBottom="1rem"
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1">Please login first</Typography>
        <Typography>Your request could not be completed because you are not logged in.</Typography>
      </Box>
      <LoginButton showScreen={IframeActiveState.createUserAndWallet} />
    </Box>
  )
}
DefaultPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default DefaultPage
