'use client'
import { Box } from '@mui/material'
import { useContext, useState } from 'react'
import { Page } from 'utils/types/page'

import Loader from '@/components/Iframe/Loader'
import { ReceiveEmailVerification } from '@/components/Iframe/Recover/ReceiveEmailVerification'
import { RecoverWithCodes } from '@/components/Iframe/Recover/RecoverWithCodes'
import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'

const RecoverPage: Page = () => {
  const [recoveryStep, setRecoveryStep] = useState<'sendRecoveryCode' | 'recover'>('sendRecoveryCode')
  const [username, setUsername] = useState('')
  const { isLoading } = useContext(IframeContext)
  if (isLoading || !recoveryStep) return <Loader />
  return (
    <Box sx={{ textAlign: 'center', margin: 0, padding: 0 }}>
      {recoveryStep === 'sendRecoveryCode' && (
        <ReceiveEmailVerification
          onSetUsername={setUsername}
          onSuccess={() => {
            setRecoveryStep('recover')
          }}
        />
      )}
      {recoveryStep === 'recover' && <RecoverWithCodes username={username} />}
    </Box>
  )
}

RecoverPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default RecoverPage
