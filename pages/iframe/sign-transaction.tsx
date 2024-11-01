'use client'
import { Box, Button, Card, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useContext, useEffect, useRef } from 'react'
import { Page } from 'utils/types/page'

import { Eip712Preview } from '@/components/Iframe/Eip712Preview'
import Loader from '@/components/Iframe/Loader'
import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'
import { useWhiteLabelTheme } from '@/utils/hooks/iframe/useWhiteLabelTheme'
import { IframeActiveState, UserInteractionTypes } from '@/utils/types/dfnsConnect'

const MotionTypography = motion(Typography)
const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionButton = motion(Button)

const SignTransactionPage: Page = () => {
  const whiteLabelTheme = useWhiteLabelTheme()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const {
    isLoading,
    isLoggedIn,
    userInteractionStatus,
    setUserInteractionStatus,
    userInteractionType,
    eventPayload,
    updateIframeScreen,
    doCreateWalletSignature,
  } = useContext(IframeContext)

  useEffect(() => {
    if (!scrollRef?.current || !eventPayload) return
    scrollRef.current.scrollTop = 0
  }, [scrollRef, eventPayload])

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      updateIframeScreen(IframeActiveState.createUserAndWallet)
    }
  }, [isLoading, isLoggedIn, updateIframeScreen])

  if (isLoading || !isLoggedIn)
    return (
      <Box
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection="column"
        maxWidth="600px"
        marginBottom="1rem"
        sx={{
          backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#F8F8FA',
          padding: '20px',
          minHeight: '100vh',
          marginX: 'auto',
        }}
      >
        <Loader />
      </Box>
    )
  if (userInteractionStatus === 'error')
    return (
      <Box sx={{ padding: '20px', minHeight: '70vh' }}>
        <Typography variant="h1">Error in signing.</Typography>
      </Box>
    )
  if (userInteractionStatus === 'rejected')
    return (
      <Box
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection="column"
        maxWidth="600px"
        marginBottom="1rem"
        sx={{
          backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#F8F8FA',
          padding: '0px',
          minHeight: '70vh',
          marginX: 'auto',
        }}
      >
        <MotionTypography
          initial={{ opacity: 0, x: '-5px' }}
          animate={{ opacity: 1, x: '0' }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          variant="h1"
        >
          Transaction rejected
        </MotionTypography>
        <MotionBox
          initial={{ opacity: 0, x: '-10px' }}
          animate={{ opacity: 1, x: '0px' }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'easeInOut' }}
          sx={{ paddingRight: '10px', marginRight: '10px' }}
        >
          <Image
            src="/img/assets/dfns-connect/transaction-rejected.svg"
            alt="set up passkey"
            width={361}
            height={346}
          />
        </MotionBox>
        <MotionButton
          initial={{ opacity: 0, y: '5px', scale: 1.1 }}
          animate={{ opacity: 1, y: '0', scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1, ease: 'easeInOut' }}
          sx={{ width: '100%' }}
          variant="contained"
          size="medium"
          onClick={() => setUserInteractionStatus('')}
        >
          Retry
        </MotionButton>
      </Box>
    )
  if (userInteractionStatus === 'success')
    return (
      <Box
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection="column"
        maxWidth="600px"
        marginBottom="1rem"
        sx={{
          backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#F8F8FA',
          padding: '0px',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography data-testid="transaction-signed-success" variant="h1">
          Transaction signed successfully
        </Typography>
        <MotionBox
          initial={{ opacity: 0, x: '-10px' }}
          animate={{ opacity: 1, x: '0px' }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'easeInOut' }}
          sx={{ paddingRight: '10px', marginRight: '10px' }}
        >
          <Image src="/img/assets/dfns-connect/wallet-main.svg" alt="set up passkey" width={361} height={239} />
        </MotionBox>
      </Box>
    )
  if (!eventPayload)
    return (
      <Box
        sx={{
          backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#F8F8FA',
          padding: '20px',
          minHeight: '100vh',
          marginX: 'auto',
        }}
      >
        <Typography>Error in transaction payload.</Typography>
      </Box>
    )
  return (
    <Box
      sx={{
        backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#F8F8FA',
        marginBottom: 0,
        padding: '0px',
      }}
    >
      {!!eventPayload && userInteractionType === UserInteractionTypes.sign && (
        <>
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <MotionTypography
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              variant="h1"
            >
              Sign Request
            </MotionTypography>
          </Box>

          <MotionCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            sx={{
              padding: 0,
              margin: 0,
              backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#F8F8FA',
              border: '1px solid #33394D',
            }}
          >
            <Box
              ref={scrollRef}
              sx={{
                padding: 10,
                margin: 0,
                height: 'calc(100vh - 200px)',
                overflowY: 'scroll',
                backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#F8F8FA',
              }}
            >
              <Eip712Preview payload={eventPayload} />
            </Box>
          </MotionCard>
          <MotionButton
            initial={{ opacity: 0, y: '-3px', scale: 1.1 }}
            animate={{ opacity: 1, y: '0px', scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            sx={{ width: '100%', marginTop: '20px' }}
            variant="contained"
            size="medium"
            onClick={() => doCreateWalletSignature()}
            data-testid="sign-transaction-btn"
          >
            Sign
          </MotionButton>
        </>
      )}
    </Box>
  )
}
SignTransactionPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default SignTransactionPage
