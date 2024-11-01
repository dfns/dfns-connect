'use client'
import { CredentialInfo } from '@dfns/datamodel/dist/Auth'
import { Fido2Attestation } from '@dfns/sdk'
import { ListCredentialsResponse } from '@dfns/sdk/generated/auth'
import { CreateCredentialChallengeResponse } from '@dfns/sdk/generated/auth'
import { Icon } from '@iconify/react'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, Switch, TextField, Typography } from '@mui/material'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Page } from 'utils/types/page'

import { Loader } from '@/components/Iframe/Loader'
import { MainIframeLayout } from '@/layouts/index'
import { IframeContext } from '@/providers/IframeProvider'
import { useWhiteLabelTheme } from '@/utils/hooks/iframe/useWhiteLabelTheme'
import { IframeActiveState } from '@/utils/types/dfnsConnect'
import { getCredentialName } from '@/utils/webauthn/helpers'

const MotionTypography = motion(Typography)
const MotionBox = motion(Box)
const MotionButton = motion(Button)
const MotionLoadingButton = motion(LoadingButton)
const MotionTextField = motion(TextField)

const CredentialsListPage: Page = () => {
  const whiteLabelTheme = useWhiteLabelTheme()
  const {
    isLoading,
    isLoggedIn,
    doSignAdditionalCredentialCreation,
    doAuthorizeAdditionalCredential,
    doArchiveCredential,
    updateIframeScreen,
    userCredentials,
    userInteractionStatus,
  } = useContext(IframeContext)
  const [isCreatingNewCredential, setIsCreatingNewCredential] = useState(false)

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      updateIframeScreen(IframeActiveState.createUserAndWallet)
    }
  }, [isLoading, isLoggedIn, updateIframeScreen])

  return (
    <>
      {isCreatingNewCredential ? (
        <AddDevice
          userCredentials={userCredentials}
          doSignAdditionalCredentialCreation={doSignAdditionalCredentialCreation}
          doAuthorizeAdditionalCredential={doAuthorizeAdditionalCredential}
          userInteractionStatus={userInteractionStatus}
          onDeviceAddedSuccess={() => {
            setIsCreatingNewCredential(false)
          }}
          isLoading={isLoading}
        />
      ) : (
        <>
          <Box maxWidth="600px" sx={{ marginBottom: '32px', marginX: 'auto' }}>
            <Box sx={{ textAlign: 'center' }}>
              <MotionTypography
                initial={{ opacity: 0, y: '-5px' }}
                animate={{ opacity: 1, y: '0' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                variant="h1"
                sx={{ marginBottom: '16px' }}
              >
                Security Key Authentication
              </MotionTypography>
              <MotionTypography
                initial={{ opacity: 0, y: '-5px' }}
                animate={{ opacity: 1, y: '0' }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
                sx={{ marginBottom: '32px', textAlign: 'left' }}
              >
                Any of the devices you register can be used to access your funds. For added safety, add more than one
                device.
              </MotionTypography>
            </Box>
            <Stack sx={{ border: '1px solid #33394D', borderRadius: '12px', padding: '15px' }}>
              {!!userCredentials &&
                userCredentials?.items.length > 0 &&
                userCredentials.items.map((c: CredentialInfo, index: number) => (
                  <Box key={index}>
                    <Typography sx={{ padding: '10px 0', display: 'block' }} variant="caption">
                      {format(new Date(c.dateCreated), 'MM/dd/yyyy hh:mm')}
                    </Typography>
                    <MotionBox
                      initial={{ opacity: 0, x: '-15px' }}
                      animate={{ opacity: 1, x: '0' }}
                      transition={{ duration: 0.2, delay: 0.1 * index, ease: 'easeInOut' }}
                      key={index}
                      sx={{
                        border: '1px solid #33394D',
                        backgroundColor: '#000',
                        borderRadius: '4px',
                        padding: '15px 15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="body1">{c.name}</Typography>
                      <Box sx={{ display: 'flex', gap: '20px' }}>
                        <Typography variant="caption" sx={{ marginTop: '3px' }}>
                          {c.isActive ? 'Active' : 'Disabled'}
                        </Typography>
                        {userCredentials.items.length > 1 && (
                          <Switch
                            disabled={userCredentials.items.length === 1}
                            sx={{
                              width: 42,
                              height: 27,
                              padding: 0,
                              '& .MuiSwitch-switchBase': {
                                padding: 0,
                                margin: 2,
                                transitionDuration: '300ms',
                                '&.Mui-checked': {
                                  transform: 'translateX(16px)',
                                  color: '#fff',
                                  '& + .MuiSwitch-track': {
                                    backgroundColor: whiteLabelTheme?.primaryButton?.backgroundColor || '#F8F8FA',
                                    opacity: 1,
                                    border: 0,
                                  },
                                  '&.Mui-disabled + .MuiSwitch-track': {
                                    opacity: 0.5,
                                  },
                                },
                                '&.Mui-focusVisible .MuiSwitch-thumb': {
                                  color: '#33cf4d',
                                  border: '6px solid #fff',
                                },
                                '&.Mui-disabled .MuiSwitch-thumb': {
                                  color: '#AAA',
                                },
                                '&.Mui-disabled + .MuiSwitch-track': {
                                  opacity: 0.7,
                                },
                              },
                              '& .MuiSwitch-thumb': {
                                boxSizing: 'border-box',
                                width: 20,
                                height: 20,
                              },
                              '& .MuiSwitch-track': {
                                borderRadius: 26 / 2,
                                backgroundColor: '#AAA',
                                opacity: 1,
                                transition: 'all 1s ease',
                              },
                            }}
                            checked={!!c.isActive}
                            onChange={() => {
                              doArchiveCredential(c.credentialUuid, !!c.isActive, 'Fido2')
                            }}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        )}
                      </Box>
                    </MotionBox>
                  </Box>
                ))}
            </Stack>
          </Box>
          <MotionButton
            variant="contained"
            color="primary"
            size="small"
            initial={{ opacity: 0, y: '-5px', scale: 1.1 }}
            animate={{ opacity: 1, y: '0', scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={() => {
              setIsCreatingNewCredential(true)
            }}
            sx={{ width: '100%', textAlign: 'left', marginTop: '20px' }}
          >
            <Box sx={{ color: whiteLabelTheme?.global?.textColor || '#000', alignItems: 'center', display: 'flex' }}>
              <Icon icon="octicon:plus-24" width="16" height="16" style={{ margin: '5px 10px' }} />
            </Box>
            <Typography color={whiteLabelTheme?.global?.textColor} variant="h4">
              Add Device
            </Typography>
          </MotionButton>
        </>
      )}
    </>
  )
}

const NumberCircleWithHeading = ({ number, heading }: { number: string; heading: string }) => (
  <Box sx={{ display: 'flex' }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '1px solid #fff',
      }}
    >
      <Typography variant="body1">{number}</Typography>
    </Box>{' '}
    <MotionTypography
      initial={{ opacity: 0, y: '-5px' }}
      animate={{ opacity: 1, y: '0' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      variant="caption"
      sx={{ marginBottom: '16px', marginLeft: '10px', marginTop: '3px', display: 'inline' }}
    >
      {heading}
    </MotionTypography>
  </Box>
)
interface AddDeviceProps {
  userCredentials: ListCredentialsResponse
  userInteractionStatus: string
  doSignAdditionalCredentialCreation: (
    credentialKind: 'Fido2' | 'RecoveryKey'
  ) => Promise<{ signedChallenge: Fido2Attestation; challenge: CreateCredentialChallengeResponse } | undefined>
  doAuthorizeAdditionalCredential: (
    credentialName: string,
    credentialKind: 'Fido2' | 'RecoveryKey',
    challenge: CreateCredentialChallengeResponse,
    signedChallenge: Fido2Attestation
  ) => Promise<void>
  onDeviceAddedSuccess: () => void
  isLoading: boolean
}
const AddDevice = ({
  userCredentials,
  userInteractionStatus,
  doSignAdditionalCredentialCreation,
  doAuthorizeAdditionalCredential,
  onDeviceAddedSuccess,
  isLoading,
}: AddDeviceProps) => {
  const [isAddingDevice, setIsAddingDevice] = useState(false)
  const [isAuthorisingNewDevice, setIsAuthorisingNewDevice] = useState(false)
  const [addDeviceError, setAddDeviceError] = useState('')

  const [challenge, setChallenge] = useState<CreateCredentialChallengeResponse | null>()
  const [signedChallenge, setSignedChallenge] = useState<Fido2Attestation | null>()
  const [newCredentialName, setNewCredentialName] = useState('')
  const [credentialAddedSuccess, setCredentialAddedSuccess] = useState(false)

  const isDuplicateDeviceName = !!userCredentials?.items.find(
    (i: { name: string }) => i.name.toLowerCase() === newCredentialName.toLowerCase()
  )
  const isStep1Done = !!challenge && !!newCredentialName
  const isStep2Done = !!challenge && !!signedChallenge

  const getUniqueName = useCallback(
    (desiredName: string) => {
      console.log({ userCredentials })

      let baseName = desiredName
      let version = 1
      const versionMatch = desiredName.match(/^(.*?)-(\d+)$/)
      if (versionMatch) {
        baseName = versionMatch[1]
        version = parseInt(versionMatch[2], 10)
      }

      let newName = desiredName

      while (userCredentials.items.find(({ name }: { name: string }) => name === newName)) {
        version++
        newName = `${baseName}-${version}`
      }

      return newName
    },
    [userCredentials]
  )

  const signAddingNewDevice = useCallback(async () => {
    setNewCredentialName('')
    setChallenge(null)
    setSignedChallenge(null)
    try {
      setIsAddingDevice(true)
      const response = await doSignAdditionalCredentialCreation('Fido2')
      if (!response) throw new Error('Error signing additional credentails')
      const derivedDeviceName = getCredentialName(response.signedChallenge)
      setNewCredentialName(getUniqueName(derivedDeviceName ?? 'New Device'))
      setChallenge(response.challenge)
      setSignedChallenge(response.signedChallenge)
      setIsAddingDevice(false)
    } catch (e) {
      console.log('error', e)
      setChallenge(null)
      setSignedChallenge(null)
      setIsAddingDevice(false)
      setAddDeviceError('Error signing new device')
      toast.error('Error signing new device')
    }
  }, [doSignAdditionalCredentialCreation, getUniqueName])

  const authorizeNewDevice = useCallback(async () => {
    setIsAuthorisingNewDevice(true)
    setAddDeviceError('')
    try {
      if (!challenge || !signedChallenge) throw new Error('Challenge not set')
      const response = await doAuthorizeAdditionalCredential(newCredentialName, 'Fido2', challenge, signedChallenge)
      console.log({ response })
      if (userInteractionStatus !== 'error') {
        setCredentialAddedSuccess(true)
        setIsAuthorisingNewDevice(false)
        setTimeout(() => {
          if (onDeviceAddedSuccess) onDeviceAddedSuccess()
        }, 1200)
      } else {
        setCredentialAddedSuccess(false)
        setIsAuthorisingNewDevice(false)
        setIsAddingDevice(false)
        setAddDeviceError('Error validating with existing device')
        toast.error('Error validating with existing device')
      }
    } catch (e) {
      console.log({ e })
      setIsAuthorisingNewDevice(false)
    }
  }, [
    challenge,
    doAuthorizeAdditionalCredential,
    newCredentialName,
    onDeviceAddedSuccess,
    signedChallenge,
    userInteractionStatus,
  ])

  if (isLoading)
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Loader />
      </Box>
    )

  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <MotionTypography
          initial={{ opacity: 0, y: '-5px' }}
          animate={{ opacity: 1, y: '0' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          variant="h1"
        >
          Add device - step {isStep1Done && '1'} {isStep2Done && '2'}
        </MotionTypography>
      </Box>
      <NumberCircleWithHeading number="1" heading="Sign authorization to add your new device" />{' '}
      {isStep1Done ? (
        <MotionBox
          initial={{ opacity: 0, y: '-5px', scale: 1.1 }}
          animate={{ opacity: 1, y: '0', scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#7FA631',
          }}
          gap={2}
        >
          <Icon icon="ph:check-circle-thin" />
          <Typography variant="body1" color="#7FA631">
            Authorized
          </Typography>
        </MotionBox>
      ) : (
        <MotionLoadingButton
          initial={{ opacity: 0, y: '-5px', scale: 1.1 }}
          animate={{ opacity: 1, y: '0', scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          variant="contained"
          loading={isAddingDevice && isStep1Done}
          onClick={signAddingNewDevice}
          size="medium"
          disabled={isStep1Done}
          sx={{ width: '100%', marginBottom: '20px' }}
        >
          {isAddingDevice ? (
            <Typography sx={{ opacity: 0.8 }}>Waiting for passkey signature</Typography>
          ) : (
            <Typography>Confirm</Typography>
          )}
        </MotionLoadingButton>
      )}
      {isDuplicateDeviceName && isStep2Done && (
        <AnimatePresence>
          <MotionBox
            sx={{ marginBottom: '10px' }}
            initial={{ opacity: 0, y: '3px' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Typography variant="caption" color="#EA2F72">
              Device name already added, please add a new device name
            </Typography>
          </MotionBox>
        </AnimatePresence>
      )}
      <NumberCircleWithHeading number="2" heading="Add a device name" />
      <MotionTextField
        initial={{ opacity: 0, x: '-15px' }}
        animate={{ opacity: 1, x: '0' }}
        disabled={!isStep1Done}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        fullWidth
        label="Device Name"
        placeholder="Please input the device name"
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
      <NumberCircleWithHeading number="3" heading="Validate with your existing device" />{' '}
      {!credentialAddedSuccess && (
        <MotionLoadingButton
          initial={{ opacity: 0, y: '-5px', scale: 1.1 }}
          animate={{ opacity: 1, y: '0', scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          disabled={!isStep2Done || isAuthorisingNewDevice}
          variant="contained"
          loading={isAuthorisingNewDevice && isStep2Done}
          onClick={authorizeNewDevice}
          size="medium"
          sx={{ width: '100%' }}
        >
          {isAuthorisingNewDevice ? (
            <Typography sx={{ opacity: 0.8 }}>Waiting for passkey signature</Typography>
          ) : (
            <Typography>Confirm</Typography>
          )}
        </MotionLoadingButton>
      )}
      {isAuthorisingNewDevice && credentialAddedSuccess && !addDeviceError && (
        <MotionBox
          initial={{ opacity: 0, y: '-5px', scale: 1.1 }}
          animate={{ opacity: 1, y: '0', scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#7FA631',
          }}
          gap={2}
        >
          <Icon icon="ph:check-circle-thin" />
          <Typography variant="body1" color="#7FA631">
            Verified
          </Typography>
        </MotionBox>
      )}
      {addDeviceError && (
        <MotionBox
          initial={{ opacity: 0, y: '-5px', scale: 1.1 }}
          animate={{ opacity: 1, y: '0', scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            textAlign: 'center',
            marginBottom: '20px',
            marginTop: '20px',
            color: '#EA2F72',
          }}
          gap={2}
        >
          <Icon icon="codicon:error" />
          <Typography variant="body2" color="#EA2F72">
            {addDeviceError}
          </Typography>
        </MotionBox>
      )}
    </>
  )
}

CredentialsListPage.getLayout = (page) => <MainIframeLayout>{page}</MainIframeLayout>

export default CredentialsListPage
