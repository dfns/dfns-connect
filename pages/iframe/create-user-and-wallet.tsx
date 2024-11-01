'use client'
import { Box, Button, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useContext } from 'react'
import { Page } from 'utils/types/page'

import { Loader } from '@/components/Iframe/Loader'
import { WalletFeatureBanner } from '@/components/Iframe/WalletFeatureBanner'
import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'
import { MessageParentActions, MessageParentActionsResponses } from '@/utils/types/dfnsConnect'

const MotionTypography = motion(Typography)
const MotionButton = motion(Button)

const CreateUserAndWalletPage: Page = () => {
  const { isLoading, setIsLoading, sendMessageToParent } = useContext(IframeContext)

  if (isLoading) return <Loader />
  return (
    <Box
      justifyContent="space-between"
      alignItems="center"
      display="flex"
      flexDirection="column"
      maxWidth="600px"
      minHeight="calc(100vh - 150px)"
      marginX="auto"
    >
      <MotionTypography
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        variant="h1"
        sx={{ marginBottom: '32px' }}
      >
        Create a Wallet
      </MotionTypography>
      <WalletFeatureBanner
        image="create-wallet-face.svg"
        heading="Biometric"
        subHeading="Biometric Crypto Wallet without passwords"
      />
      <WalletFeatureBanner
        image="create-wallet-lock.svg"
        heading="Security"
        subHeading="Next-generation self custodial account security"
        animationDelay={0.2}
      />
      <MotionButton
        initial={{ opacity: 0, y: '10px' }}
        animate={{ opacity: 1, y: '0px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true)
          await sendMessageToParent({
            parentAction: MessageParentActions.initUserRegister,
            parentActionResponse: MessageParentActionsResponses.initUserRegisterSuccess,
          })
        }}
        size="medium"
        variant="contained"
        sx={{ width: '100%', marginTop: '30px' }}
      >
        <Image
          src={'/img/assets/dfns-connect/create-wallet-phone-light.svg'}
          alt="biometric"
          width={24}
          height={24}
          style={{ marginRight: '15px' }}
        />{' '}
        Continue with my device
      </MotionButton>
    </Box>
  )
}

CreateUserAndWalletPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default CreateUserAndWalletPage
