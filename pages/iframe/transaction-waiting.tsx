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
const MotionBox = motion(Box)

const WaitingTransactionStatePage: Page = () => {
  const { updateIframeScreen, setIsLoading } = useContext(IframeContext)
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      display="flex"
      maxWidth="600px"
      minHeight="calc(100vh - 250px)"
      marginX="auto"
    >
      <MotionBox
        initial={{ opacity: 0, x: '-20px' }}
        animate={{ opacity: 1, x: '0' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        textAlign="center"
      >
        <MotionTypography
          initial={{ opacity: 0, x: '-5px' }}
          animate={{ opacity: 1, x: '0' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          variant="h1"
        >
          Waiting for Passkey Transaction Signature
        </MotionTypography>
        <MotionTypography
          initial={{ opacity: 0, x: '-5px' }}
          animate={{ opacity: 1, x: '0' }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
          variant="body1"
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
        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: '20px' }}
          onClick={() => {
            updateIframeScreen(IframeActiveState.userWallet)
            setIsLoading(false)
          }}
        >
          Cancel
        </Button>
      </MotionBox>
    </Box>
  )
}
WaitingTransactionStatePage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default WaitingTransactionStatePage
