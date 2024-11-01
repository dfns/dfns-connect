'use client'
import { CredentialInfo } from '@dfns/datamodel/dist/Auth'
import { Icon } from '@iconify/react'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { Page } from 'utils/types/page'

import { Loader } from '@/components/Iframe/Loader'
import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'
import { useWhiteLabelTheme } from '@/utils/hooks/iframe/useWhiteLabelTheme'
import { IframeActiveState } from '@/utils/types/dfnsConnect'

const MotionTypography = motion(Typography)
const MotionBox = motion(Box)
const MotionButton = motion(Button)
const MotionTextField = motion(TextField)

const RecoveryCredentialsListPage: Page = () => {
  const whiteLabelTheme = useWhiteLabelTheme()
  const {
    isLoading,
    isLoggedIn,
    userCredentials,
    doArchiveCredential,
    doCreateAdditionalRecoveryCredential,
    updateIframeScreen,
  } = useContext(IframeContext)
  const [isCreatingNewCredential, setIsCreatingNewCredential] = useState(false)
  const [newCredentialName, setNewCredentialName] = useState('')

  const isDuplicateBackupName =
    !!userCredentials?.items &&
    !!userCredentials?.items.find((i: { name: string }) => i.name.toLowerCase() === newCredentialName.toLowerCase())
  const activeUserCredentials = userCredentials?.items.filter(({ isActive }: { isActive: boolean }) => isActive) || []

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      updateIframeScreen(IframeActiveState.createUserAndWallet)
    }
  }, [isLoading, isLoggedIn, updateIframeScreen])

  if (isLoading || !userCredentials?.items) return <Loader />
  return (
    <>
      {isCreatingNewCredential ? (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <MotionTypography
              initial={{ opacity: 0, y: '-5px' }}
              animate={{ opacity: 1, y: '0' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              variant="h1"
            >
              Name your Backup Code
            </MotionTypography>
            <MotionTypography
              initial={{ opacity: 0, y: '-5px' }}
              animate={{ opacity: 1, y: '0' }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
              sx={{ marginBottom: '32px' }}
            >
              Use a simple name that will be familiar to you.
            </MotionTypography>
          </Box>
          <MotionTextField
            initial={{ opacity: 0, x: '-15px' }}
            animate={{ opacity: 1, x: '0' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            fullWidth
            label="Credential Name"
            placeholder="Credential name..."
            type="text"
            value={newCredentialName}
            onChange={(e) => {
              setNewCredentialName(e.target.value)
            }}
            color="primary"
            variant="outlined"
            sx={{
              marginBottom: '16px',
            }}
          />
          {isDuplicateBackupName && (
            <AnimatePresence>
              <MotionBox
                sx={{ marginBottom: '10px' }}
                initial={{ opacity: 0, y: '3px' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Typography variant="caption" color="#EA2F72">
                  Backup code already added, please add a new one
                </Typography>
              </MotionBox>
            </AnimatePresence>
          )}
          <MotionButton
            initial={{ opacity: 0, y: '-5px', scale: 1.1 }}
            animate={{ opacity: 1, y: '0', scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            disabled={!newCredentialName || isLoading || isDuplicateBackupName}
            variant="contained"
            onClick={async () => {
              try {
                await doCreateAdditionalRecoveryCredential(newCredentialName)
                setIsCreatingNewCredential(false)
              } catch (e) {
                setIsCreatingNewCredential(false)
              }
            }}
            size="small"
            sx={{ width: '100%' }}
          >
            Confirm
          </MotionButton>
          <MotionButton
            initial={{ opacity: 0, y: '-5px', scale: 1.1 }}
            animate={{ opacity: 1, y: '0', scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: 'easeInOut' }}
            variant="contained"
            color="secondary"
            onClick={() => {
              setIsCreatingNewCredential(false)
            }}
            size="small"
            sx={{ width: '100%', marginTop: '20px' }}
          >
            Cancel
          </MotionButton>
        </>
      ) : (
        <Box maxWidth="600px" sx={{ marginBottom: '32px', marginX: 'auto' }}>
          <Box sx={{ textAlign: 'center' }}>
            <MotionTypography
              initial={{ opacity: 0, y: '-5px' }}
              animate={{ opacity: 1, y: '0' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              variant="h1"
              sx={{ marginBottom: '16px' }}
            >
              Backup Codes
            </MotionTypography>
            <MotionTypography
              initial={{ opacity: 0, y: '-5px' }}
              animate={{ opacity: 0.8, y: '0' }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
              sx={{ marginBottom: '32px', textAlign: 'left' }}
              variant="body1"
            >
              Generate additional backup codes to use if you get locked out of your account. GRVT does not have your
              backup secret.
            </MotionTypography>
          </Box>
          <Stack sx={{ border: '1px solid #33394D', borderRadius: '12px', padding: '8px 0', marginBottom: '12px' }}>
            {activeUserCredentials.map((c: CredentialInfo, index: number) => (
              <MotionBox
                initial={{ opacity: 0, x: '-15px' }}
                animate={{ opacity: 1, x: '0' }}
                transition={{ duration: 0.2, delay: 0.1 * index, ease: 'easeInOut' }}
                key={index}
                sx={{
                  padding: '10px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box display="flex" gap={4} sx={{ justifyContent: 'space-between' }}>
                  <Typography
                    sx={{
                      marginTop: '5px',
                      marginBottom: '0px',
                      fontWeight: 500,
                      lineHeight: '1.5rem',
                      fontSize: '12px',
                    }}
                  >
                    {c.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    {activeUserCredentials.length > 1 && (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#EA2F72 !important',
                        }}
                        size="small"
                        onClick={() => {
                          doArchiveCredential(c.credentialUuid, !!c.isActive, 'RecoveryKey')
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    marginTop: '10px',
                    border: '1px solid #33394D',
                    padding: '20px 12px',
                    backgroundColor: '#000',
                    borderRadius: '12px',
                  }}
                >
                  <table>
                    <tbody>
                      {[
                        { label: 'ID', value: c.credentialId },
                        { label: 'Created Time', value: format(new Date(c.dateCreated), 'MM/dd/yyyy hh:mm') },
                      ].map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ textAlign: 'left', verticalAlign: 'top' }}>
                          <td style={{ width: '50px' }}>
                            <Typography sx={{ fontSize: '10px', paddingRight: '10px', opacity: 0.8 }} variant="body2">
                              {row.label}
                            </Typography>
                          </td>
                          <td>
                            <Typography sx={{ fontSize: '10px', wordBreak: 'break-all' }} variant="body2">
                              {row.value}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </MotionBox>
            ))}
          </Stack>
          <MotionButton
            size="medium"
            variant="contained"
            color="primary"
            initial={{ opacity: 0, y: '-5px', scale: 1.1 }}
            animate={{ opacity: 1, y: '0', scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={() => {
              setNewCredentialName('')
              setIsCreatingNewCredential(true)
            }}
            sx={{ width: '100%', alignItems: 'center', display: 'flex' }}
          >
            <Box sx={{ color: whiteLabelTheme?.global?.textColor || '#000', alignItems: 'center', display: 'flex' }}>
              <Icon icon="octicon:plus-24" width="16" height="16" style={{ margin: '5px 10px' }} />
            </Box>
            <Typography color={whiteLabelTheme?.global?.textColor} variant="h4">
              Generate backup code
            </Typography>
          </MotionButton>
        </Box>
      )}
    </>
  )
}
RecoveryCredentialsListPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default RecoveryCredentialsListPage
