import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Stack, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NewUserCredentials } from 'utils/api/clients/dfnsApi/httpClient'
import { KeyClientData } from 'utils/api/clients/dfnsApi/httpClient'
import { CreateUserCredentialInput, CredentialKind } from 'utils/api/clients/dfnsApi/types'
import { ApiEndpoint } from 'utils/api/constants'
import { sendApiRequest } from 'utils/api/sendApiRequest'
import { arrayBufferToBase64UrlString } from 'utils/base64url'
import { useUserIdentity } from 'utils/hooks/useUserIdentity'
import { inputLabelWithError } from 'utils/strings'

import { RecoveryCode } from '../RecoveryCode'
import { CredentialFormSchema as Schema, credentialFormSchema as schema } from './constants'

type CreateUserCredentialRequestBodies = {
  recoveryFactor?: CreateUserCredentialInput
}

export const createRecoveryCredential = async (
  clientData: KeyClientData,
  username: string
): Promise<{ credentials: NewUserCredentials; recoveryKey: string }> => {
  return new Promise((resolve, reject) => {
    const serviceWorker = new Worker('/js/worker.js')

    serviceWorker.addEventListener('message', (event) => {
      switch (event.data.type) {
        case 'encryptedPrivateKeyAndPublicKey': {
          const { encryptedPrivateKey, attestationData, recoveryKey, credentialId } = event.data
          const credentials: NewUserCredentials = {
            recoveryFactor: {
              credentialId: credentialId,
              kind: CredentialKind.RecoveryKey,
              signature: {
                attestationData: Buffer.from(attestationData),
                clientData: Buffer.from(JSON.stringify(clientData)),
              },
              encryptedPrivateKey: encryptedPrivateKey,
            },
          }
          const newRecoveryKey = JSON.stringify({
            recoveryCode: recoveryKey,
            credentialId,
          })
          resolve({
            credentials,
            recoveryKey: newRecoveryKey,
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

    serviceWorker.postMessage({
      type: 'generateEncryptedPrivateKeyAndPublicKey',
      username: username,
      clientData: JSON.stringify(clientData),
    })
  })
}

export const createCreateCredentialRequestBody = (
  credential: NewUserCredentials,
  challengeIdentifier: string,
  credentialName: string
): CreateUserCredentialRequestBodies => {
  const result: CreateUserCredentialRequestBodies = {}
  if (credential.recoveryFactor) {
    if (credential.recoveryFactor.kind === CredentialKind.RecoveryKey) {
      result.recoveryFactor = {
        challengeIdentifier: challengeIdentifier,
        credentialName: credentialName,
        credentialKind: CredentialKind.RecoveryKey,
        credentialInfo: {
          attestationData: arrayBufferToBase64UrlString(credential.recoveryFactor.signature.attestationData),
          clientData: arrayBufferToBase64UrlString(credential.recoveryFactor.signature.clientData),
          credId: credential.recoveryFactor.credentialId,
        },
        encryptedPrivateKey: credential.recoveryFactor.encryptedPrivateKey,
      } as CreateUserCredentialInput
    }
  }

  return result
}

export const RecoveryCredentialAddForm: React.FC = () => {
  const userIdentity = useUserIdentity()
  const { back } = useRouter()

  const [recoveryKey, setRecoveryKey] = useState<
    | {
        recoveryCode: string
        username: string
        orgId: string
      }
    | undefined
  >(undefined)

  const { control, formState, handleSubmit } = useForm<Schema>({
    mode: 'onChange',
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
  })

  const onSubmit = handleSubmit(async ({ name }) => {
    const challenge = await sendApiRequest(ApiEndpoint.createUserCredentialChallenge, {
      body: {
        kind: CredentialKind.RecoveryKey,
      },
    })

    if (String(challenge.kind) === String(CredentialKind.RecoveryKey)) {
      const clientData: KeyClientData = {
        type: 'key.create',
        // @ts-expect-error type definition mismatch, but works
        challenge: challenge.challenge,
        origin: window.location.origin,
        crossOrigin: false,
      }
      const username = userIdentity.username
      const { credentials, recoveryKey } = await createRecoveryCredential(clientData, username)
      const bodies = createCreateCredentialRequestBody(credentials, challenge.temporaryAuthenticationToken, name)
      if (bodies.recoveryFactor) {
        await sendApiRequest(ApiEndpoint.createUserCredential, {
          body: bodies.recoveryFactor,
        })
      }
      setRecoveryKey({
        recoveryCode: recoveryKey,
        username: username,
        orgId: userIdentity.orgId,
      })
    } else {
      throw new Error('Not supported.')
    }
  })

  if (recoveryKey) {
    return <RecoveryCode recoveryKey={recoveryKey} onDone={() => back()} />
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={1}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              type="text"
              placeholder="My Recovery Credential"
              label={inputLabelWithError(schema.fields.name.spec.label, fieldState.error?.message)}
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
            type="submit"
            loading={formState.isSubmitting}
            disabled={!formState.isValid}
            variant="contained"
            size="large"
          >
            Create Credential
          </LoadingButton>
        </Box>
      </Stack>
    </form>
  )
}
