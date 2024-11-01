import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Fade, Stack, TextField, Typography } from '@mui/material'
import { Collapse } from '@mui/material'
import { Box } from '@mui/system'
import Router, { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  CreateUserCredentialOptions,
  createWebAuthnCredential,
  GenerateRecoveryClientData,
  NewUserCredentials,
} from 'utils/api/clients/dfnsApi/httpClient'
import { CredentialKind } from 'utils/api/clients/dfnsApi/types'
import { ApiEndpoint } from 'utils/api/constants'
import { sendApiRequest } from 'utils/api/sendApiRequest'
import { LOCAL_STORAGE_APP_ID } from 'utils/misc'
import { inputLabelWithError } from 'utils/strings'

import { RecoveryCode } from '../RecoveryCode'
import { RegistrationFormSchema as Schema, registrationFormSchema as schema } from './constants'

export const createUserCredentials = async (
  supportedCredentials: CreateUserCredentialOptions,
  username: string,
  existingRecoveryKey?: {
    code: string
    credId: string
    encryptedKey: string
  },
  getRecoveryClientData?: GenerateRecoveryClientData
): Promise<{ credentials: NewUserCredentials; recoveryKey: string; signature?: string }> => {
  return new Promise((resolve, reject) => {
    let newCredentials: NewUserCredentials | undefined = undefined
    let clientData = ''
    let newRecoveryKey = ''
    const serviceWorker = new Worker('/js/worker.js')
    const createCredentials = () => {
      createWebAuthnCredential(supportedCredentials.credentialData.webAuthnClientData)
        .then((response) => {
          newCredentials = response
          clientData = JSON.stringify(supportedCredentials.credentialData.keyOrPasswordClientData)

          serviceWorker.postMessage({
            type: 'generateEncryptedPrivateKeyAndPublicKey',
            username: username,
            clientData: clientData,
          })
        })
        .catch((err) => {
          reject(err)
        })
    }

    serviceWorker.addEventListener('message', (event) => {
      switch (event.data.type) {
        case 'encryptedPrivateKeyAndPublicKey': {
          if (!newCredentials) {
            reject(new Error('Something went wrong!'))
            return
          }

          const { encryptedPrivateKey, attestationData, recoveryKey, credentialId } = event.data
          newCredentials.recoveryFactor = {
            credentialId: credentialId,
            kind: CredentialKind.RecoveryKey,
            signature: {
              attestationData: Buffer.from(attestationData),
              clientData: Buffer.from(clientData),
            },
            encryptedPrivateKey: encryptedPrivateKey,
          }
          newRecoveryKey = JSON.stringify({
            recoveryCode: recoveryKey,
            credentialId,
          })

          if (getRecoveryClientData && existingRecoveryKey) {
            const recoveryClientData = getRecoveryClientData(newCredentials)
            serviceWorker.postMessage({
              type: 'generateSignature',
              username: username,
              message: JSON.stringify(recoveryClientData),
              recoveryKey: existingRecoveryKey.code,
              encryptedPrivateKey: existingRecoveryKey.encryptedKey,
              credentialId: existingRecoveryKey.credId,
            })
          } else {
            resolve({
              credentials: newCredentials,
              recoveryKey: newRecoveryKey,
            })
          }
          break
        }
        case 'recoveryKeyIsValid': {
          createCredentials()
          break
        }
        case 'signature': {
          if (!newCredentials) {
            reject(new Error('Something went wrong!'))
            return
          }
          const { signature } = event.data

          resolve({
            credentials: newCredentials,
            recoveryKey: newRecoveryKey,
            signature: signature,
          })
          break
        }
        case 'error': {
          const { error } = event.data
          reject(error)
          break
        }
      }
    })

    if (existingRecoveryKey) {
      serviceWorker.postMessage({
        type: 'validateRecoveryKey',
        username: username,
        recoveryKey: existingRecoveryKey.code,
        encryptedPrivateKey: existingRecoveryKey.encryptedKey,
        credentialId: existingRecoveryKey.credId,
      })
    } else {
      createCredentials()
    }
  })
}

export const RegistrationForm: React.FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isEmailSentSuccess, setIsEmailSentSuccess] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const registrationCodeRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const { control, formState, handleSubmit, setValue, getValues, watch } = useForm<Schema>({
    mode: 'onChange',
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
  })

  const orgId = watch('orgId')
  const username = watch('username')
  const registrationCode = watch('registrationCode')
  const isOnlyRegistrationCodeMissing = !!orgId && !!username && !registrationCode

  const [recoveryKey, setRecoveryKey] = useState<
    | {
        recoveryCode: string
        username: string
        orgId: string
      }
    | undefined
  >(undefined)

  const onSendNewRegistrationCode = async () => {
    setIsSendingEmail(true)
    setIsEmailSentSuccess(false)
    const username = getValues('username')
    const orgId = getValues('orgId')
    const isMatchExists = await setMatchingAppIdForOrg(orgId)
    if (!isMatchExists) {
      toast.error('Org Id is invalid for Application ID')
      return
    }
    try {
      await sendApiRequest(ApiEndpoint.resendRegistrationCode, {
        body: { username, orgId },
      })
      toast.success(`Registration email sent to ${username}`)
      setIsSendingEmail(false)
      setIsEmailSentSuccess(true)
    } catch (e) {
      toast.error('An error occurred sending the registration email.')
      setIsSendingEmail(false)
      setIsEmailSentSuccess(false)
    }
  }

  const setMatchingAppIdForOrg = useCallback(
    async (orgId: string) => {
      if (executeRecaptcha) {
        const recaptchaResponse = await executeRecaptcha('login')
        const orgsData = await sendApiRequest(ApiEndpoint.createAvailableOrgList, {
          body: {
            username: '-',
            origin: window.location.origin,
            orgId,
            recaptchaResponse,
          },
        })

        if (orgsData.length !== 1) {
          return false
        }

        localStorage.setItem(LOCAL_STORAGE_APP_ID, JSON.stringify(orgsData[0]))
        return true
      } else {
        return false
      }
    },
    [executeRecaptcha]
  )

  const onSubmit = handleSubmit(async ({ username, orgId, registrationCode }) => {
    const isMatchExists = await setMatchingAppIdForOrg(orgId)
    if (!isMatchExists) {
      toast.error('Org Id is invalid for application ID')
      return
    }

    const key = await sendApiRequest(ApiEndpoint.registerUser, {
      body: { username, orgId, registrationCode },
    })

    if (key.recoveryKey) {
      setRecoveryKey({
        recoveryCode: key.recoveryKey,
        username: username,
        orgId: orgId,
      })
    } else {
      const { state } = router.query

      Router.push({
        pathname: '/login',
        query: {
          username: username,
          orgId: orgId,
          registrationSuccess: true,
          state: state,
        },
      })
    }
  })

  useEffect(() => {
    if (typeof router.query['username'] === 'string' && router.query['username']) {
      setValue('username', decodeURIComponent(router.query['username']), {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
    if (typeof router.query['orgId'] === 'string' && router.query['orgId']) {
      setValue('orgId', decodeURIComponent(router.query['orgId']), {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
    if (typeof router.query['code'] === 'string' && router.query['code']) {
      setValue('registrationCode', decodeURIComponent(router.query['code']), {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [router, setValue])

  useEffect(() => {
    if (!isInitialLoad || !isOnlyRegistrationCodeMissing) return
    registrationCodeRef?.current?.focus()
    setIsInitialLoad(false)
  }, [isOnlyRegistrationCodeMissing, registrationCodeRef, isInitialLoad])

  if (recoveryKey) {
    return (
      <RecoveryCode
        recoveryKey={recoveryKey}
        onDone={() =>
          Router.push({
            pathname: '/login',
            query: {
              username: recoveryKey.username,
              orgId: recoveryKey.orgId,
              registrationSuccess: true,
            },
          })
        }
      />
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={1}>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              type="text"
              placeholder="jdoe@acme.co"
              label={inputLabelWithError(schema.fields.username.spec.label, fieldState.error?.message)}
              error={!!fieldState.error}
              InputLabelProps={{
                shrink: !!fieldState.error?.message || undefined,
              }}
              {...field}
            />
          )}
        />
        <Controller
          name="orgId"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              type="text"
              placeholder="xyz-abc-123"
              label={inputLabelWithError(schema.fields.orgId.spec.label, fieldState.error?.message)}
              error={!!fieldState.error}
              InputLabelProps={{
                shrink: !!fieldState.error?.message || undefined,
              }}
              {...field}
            />
          )}
        />
        <Fade in={isOnlyRegistrationCodeMissing} appear={true}>
          <Collapse in={isOnlyRegistrationCodeMissing} timeout="auto">
            <Typography variant="body2" sx={{ my: 1 }}>
              Add the registration code you received by email:
            </Typography>
          </Collapse>
        </Fade>
        <Controller
          name="registrationCode"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              type="text"
              inputRef={registrationCodeRef}
              placeholder="abc3Xy2Z1"
              label={inputLabelWithError(schema.fields.registrationCode.spec.label, fieldState.error?.message)}
              error={!!fieldState.error}
              InputLabelProps={{
                shrink: !!fieldState.error?.message || undefined,
              }}
              {...field}
            />
          )}
        />
        <Box display="flex" justifyContent="end">
          <LoadingButton
            sx={{ ml: 1 }}
            type="submit"
            loading={formState.isSubmitting}
            disabled={!formState.isValid}
            variant="contained"
            size="large"
          >
            Create Account
          </LoadingButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 8,
            ml: 0,
            gap: 1.5,
          }}
        >
          <Typography variant="body1">Registration code not working?</Typography>
          <LoadingButton
            type="button"
            disabled={!orgId || !username || formState.isSubmitting}
            variant="outlined"
            size="small"
            loading={isSendingEmail}
            onClick={onSendNewRegistrationCode}
          >
            Send New Code to my email
          </LoadingButton>
          <Fade in={isEmailSentSuccess} appear={true} timeout={{ appear: 1000, enter: 1000, exit: 500 }}>
            <Collapse in={isEmailSentSuccess}>
              <Typography variant="body2" color="green" sx={{ mt: 1 }}>
                Please check your email inbox for the new code.
              </Typography>
            </Collapse>
          </Fade>
        </Box>
      </Stack>
    </form>
  )
}
