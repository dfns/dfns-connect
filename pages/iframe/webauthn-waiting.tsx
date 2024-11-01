'use client'
import { Box, Button, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useContext } from 'react'
import { Page } from 'utils/types/page'

import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'
import { IframeActiveState } from '@/utils/types/dfnsConnect'

const MotionTypography = motion(Typography)
const MotionButton = motion(Button)
const MotionBox = motion(Box)

const WaitingStatePage: Page = () => {
  const { updateIframeScreen, setIsLoading } = useContext(IframeContext)
  return (
    <Box
      data-testid="webauthn-waiting"
      justifyContent="center"
      alignItems="center"
      display="flex"
      maxWidth="600px"
      minHeight="calc(100vh - 250px)"
      marginX="auto"
    >
      <Box textAlign="center">
        <MotionTypography
          initial={{ opacity: 0, y: '-5px' }}
          animate={{ opacity: 1, y: '0' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          variant="h1"
        >
          Waiting for Passkey Signature
        </MotionTypography>
        <MotionTypography
          initial={{ opacity: 0, y: '-5px' }}
          animate={{ opacity: 1, y: '0' }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
          variant="body1"
          sx={{ marginBottom: '20px' }}
        >
          Your device has been prompted for a signature with your passkey.
        </MotionTypography>
        <MotionBox
          initial={{ opacity: 0, x: '-10px' }}
          animate={{ opacity: 1, x: '0px' }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'easeInOut' }}
          sx={{ paddingRight: '10px', marginRight: '10px' }}
        >
          <Image
            src="/img/assets/dfns-connect/setup-passkey-waiting.svg"
            alt="set up passkey"
            width={200}
            height={200}
          />
        </MotionBox>
        <MotionButton
          initial={{ opacity: 0, y: '5px', scale: 1.1 }}
          animate={{ opacity: 1, y: '0', scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1, ease: 'easeInOut' }}
          variant="contained"
          fullWidth
          sx={{ marginTop: '20px' }}
          onClick={() => {
            setIsLoading(false)
            updateIframeScreen(IframeActiveState.createUserAndWallet)
          }}
        >
          Cancel
        </MotionButton>
      </Box>
    </Box>
  )
}
WaitingStatePage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default WaitingStatePage
