'use client'
import { Icon } from '@iconify/react'
import { Box, Button, Card, CardContent, Checkbox, Container, FormControlLabel, Link, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { Page } from 'utils/types/page'

import { CopyPasteInput } from '@/components/Iframe/CopyPasteInput'
import Loader from '@/components/Iframe/Loader'
import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'
import { useWhiteLabelTheme } from '@/utils/hooks/iframe/useWhiteLabelTheme'
import { IframeActiveState } from '@/utils/types/dfnsConnect'

const RecoveryCodesPage: Page = () => {
  const [isContinueChecked, setIsContinueChecked] = useState(false)
  const { recoveryCodes, isLoading, updateIframeScreen } = useContext(IframeContext)
  const whiteLabelTheme = useWhiteLabelTheme()
  useEffect(() => {
    if (!isLoading && !recoveryCodes) {
      updateIframeScreen(IframeActiveState.createUserAndWallet)
    }
  }, [isLoading, updateIframeScreen, recoveryCodes])

  if (isLoading || !recoveryCodes) return <Loader />
  return (
    <Container sx={{ marginBottom: '32px' }}>
      <Box sx={{ textAlign: 'center', marginBottom: '20px' }} data-testid="recovery-codes">
        <Typography variant="h1">Store your Backup Code</Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, textAlign: 'left' }}>
          If you lose access to your passkeys, you can restore your wallet using your backup ID and secret.
        </Typography>
      </Box>
      <Box
        sx={{
          borderRadius: '20px',
          border: '1px solid #33394D',
          padding: '14px',
          marginTop: '20px',
        }}
      >
        <CopyPasteInput data-testid="recovery-code" label="Recovery Code" defaultValue={recoveryCodes?.recoveryCode} />
        <CopyPasteInput data-testid="recovery-key" label="Recovery Key ID" defaultValue={recoveryCodes?.credentialId} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => {
              window.print()
            }}
            size="small"
            variant="outlined"
            color="secondary"
          >
            <Icon icon="system-uicons:download" style={{ width: '20px', height: '20px' }} />
            Download Backup Codes
          </Button>
        </Box>
      </Box>
      <Card
        sx={{
          marginTop: '0px',
          border: 'none',
          padding: 0,
          backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#FFF',
        }}
      >
        <CardContent>
          <FormControlLabel
            sx={{ alignContent: 'start', alignItems: 'start', marginBottom: '12px' }}
            control={
              <Checkbox checked={isContinueChecked} onChange={() => setIsContinueChecked(() => !isContinueChecked)} />
            }
            label={
              <Typography sx={{ margin: '10px 0px' }} variant="body1">
                I’ve saved them in a{' '}
                <Link href="#secure" target="_blank" color={whiteLabelTheme?.global?.highlightColor || '#685879'}>
                  secure location.
                </Link>{' '}
                Backup code cannot be displayed again.
              </Typography>
            }
          />
          <Button
            onClick={async () => {
              await updateIframeScreen(IframeActiveState.userWallet)
            }}
            disabled={!isContinueChecked}
            size="medium"
            color="primary"
            variant="contained"
            sx={{ width: '100%', marginTop: 0 }}
            data-testid="recovery-saved-continue-btn"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}
RecoveryCodesPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default RecoveryCodesPage
