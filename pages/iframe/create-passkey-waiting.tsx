'use client'
import { Box, Button, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useContext } from 'react'
import { Page } from 'utils/types/page'

import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'
import { IframeActiveState } from '@/utils/types/dfnsConnect'

const MotionBox = motion(Box)

const CreatePasskeyPage: Page = () => {
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
      <Box textAlign="center">
        <Typography variant="h1">Set up your Passkey</Typography>
        <Typography variant="body1">
          Register your passkey when prompted by your browser to complete your GRVT Wallet setup.
        </Typography>
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
          onClick={() => {
            setIsLoading(false)
            updateIframeScreen(IframeActiveState.createUserAndWallet)
          }}
        >
          Retry
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ marginTop: '20px' }}
          onClick={() => {
            updateIframeScreen(IframeActiveState.createUserAndWallet)
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  )
}
CreatePasskeyPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default CreatePasskeyPage
