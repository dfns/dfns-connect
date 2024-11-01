'use client'
import { Box, IconButton, TextField, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useContext, useEffect } from 'react'
import { useCopyToClipboard } from 'utils/hooks/useCopyToClipboard'
import { Page } from 'utils/types/page'

import Loader from '@/components/Iframe/Loader'
import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'
import { useWhiteLabelTheme } from '@/utils/hooks/iframe/useWhiteLabelTheme'

const MotionBox = motion(Box)
const MotionTypography = motion(Typography)
const MotionTextField = motion(TextField)

const UserWalletPage: Page = () => {
  const copy = useCopyToClipboard()
  const whiteLabelTheme = useWhiteLabelTheme()
  const { doListWallets, lastEvent, isLoading, userWallets } = useContext(IframeContext)

  useEffect(() => {
    if (isLoading || userWallets) return
    const verifyUserWalletExists = async () => {
      await doListWallets(lastEvent)
    }
    verifyUserWalletExists()
  }, [isLoading, userWallets, lastEvent, doListWallets])

  if (isLoading || !userWallets) return <Loader />
  return (
    <>
      <Box sx={{ textAlign: 'center' }} data-testid="user-wallet">
        <MotionTypography
          initial={{ opacity: 0, y: '-5px' }}
          animate={{ opacity: 1, y: '0px' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          sx={{ marginTop: '20px', marginBottom: '20px' }}
          variant="h1"
        >
          Your Wallet is all set
        </MotionTypography>
        <MotionBox
          initial={{ opacity: 0, x: '-10px' }}
          animate={{ opacity: 1, x: '0px' }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'easeInOut' }}
          sx={{ paddingRight: '10px', marginRight: '10px' }}
        >
          <Image src="/img/assets/dfns-connect/wallet-main.svg" alt="set up passkey" width={361} height={239} />
        </MotionBox>
        <Box sx={{ textAlign: 'left', marginBottom: '10px' }}>
          <MotionTypography
            initial={{ opacity: 0, y: '-5px' }}
            animate={{ opacity: 0.8, y: '0px' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            sx={{ marginBottom: '12px', textAlign: 'left' }}
            variant="caption"
          >
            Your Wallet Address
          </MotionTypography>
        </Box>
      </Box>
      <MotionTextField
        initial={{ opacity: 0, y: '-5px' }}
        animate={{ opacity: 1, y: '0px' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        fullWidth
        inputProps={{ readOnly: true }}
        type="text"
        defaultValue={userWallets?.items?.[0]?.address}
        color="primary"
        variant="outlined"
        sx={{
          textTransform: 'uppercase',
          marginBottom: '16px',
          '& .MuiInputBase-input': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }}
        InputProps={{
          endAdornment: (
            <IconButton
              sx={{
                backgroundColor: whiteLabelTheme?.global?.backgroundColor
                  ? whiteLabelTheme?.global?.backgroundColor
                  : '#F8F8FA',
                borderRadius: '8px',
                marginLeft: '4px',
              }}
              onClick={() => {
                copy(userWallets?.items?.[0]?.address)
              }}
            >
              <Image src="/img/assets/dfns-connect/copy-paste-icon.svg" alt="copy" width={24} height={24} />
            </IconButton>
          ),
        }}
      />
    </>
  )
}
UserWalletPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default UserWalletPage
