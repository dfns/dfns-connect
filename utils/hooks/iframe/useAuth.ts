import { CredentialKind } from '@dfns/datamodel/dist/Auth'
import { EntityId } from '@dfns/datamodel/dist/Foundations'
import { Wallet } from '@dfns/datamodel/dist/Wallets'
import {
  BaseAuthApi,
  DfnsApiClient,
  DfnsAuthenticator,
  Fido2Attestation,
  LoginResponse,
  UserRegistrationChallenge,
  UserRegistrationResponse,
} from '@dfns/sdk'
import { CreateCredentialChallengeResponse } from '@dfns/sdk/generated/auth'
import { WebAuthnSigner } from '@dfns/sdk-browser'
import { jwtDecode } from 'jwt-decode'
import { useCallback, useEffect, useState } from 'react'

import {
  createCreateCredentialRequestBody,
  createRecoveryCredential,
} from '@/components/RecoveryCredentialAddForm/RecoveryCredentialAddForm'
import { useSignerStore } from '@/store/iframe'
import { KeyClientData } from '@/utils/api/clients/dfnsApi/httpClient'
import { ApiEndpoint } from '@/utils/api/constants'
import { sendApiRequest } from '@/utils/api/sendApiRequest'
import { arrayBufferToBase64UrlString } from '@/utils/base64url'
import { getCredentialName } from '@/utils/webauthn/helpers'

import { LOCAL_STORAGE_APP_ID } from '../../misc'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`
const webauthn = new WebAuthnSigner()

export const useAuth = () => {
  const { getAppEntry, currentIdentifier, updateAppEntry } = useSignerStore()

  const currentApp = getAppEntry(currentIdentifier)
  const appId = currentApp?.appId || ''
  const orgId = currentApp?.orgId || ''
  const userAuthToken = currentApp?.userAuthToken || ''

  const [user, setUser] = useState<string | undefined>(undefined)
  const [error, setError] = useState('')

  const login = async (username: string): Promise<LoginResponse> => {
    try {
      if (!BASE_URL) throw new Error('BASE_URL not set')
      const authApi = new DfnsAuthenticator({
        appId,
        baseUrl: `https://${BASE_URL}`,
        signer: webauthn,
      })
      const userLoginResponse = await authApi.login({ username, orgId })
      const { token } = userLoginResponse
      if (!token) throw new Error('Token not created')
      updateAppEntry(currentIdentifier, { userAuthToken: token })
      const userFromToken = extractUser(token)
      setUser(userFromToken)
      return userLoginResponse
    } catch (e) {
      throw e
    }
  }

  const loginWithToken = useCallback(
    (userAuthToken: string) => {
      updateAppEntry(currentIdentifier, { userAuthToken })
    },
    [updateAppEntry, currentIdentifier]
  )

  const logout = useCallback(() => {
    setUser(undefined)
    updateAppEntry(currentIdentifier, { userAuthToken: '' })
  }, [setUser, updateAppEntry, currentIdentifier])

  const register = async (challenge: UserRegistrationChallenge): Promise<UserRegistrationResponse> => {
    try {
      if (!BASE_URL) throw new Error('BASE_URL not set')
      const attestation = await webauthn.create(challenge)
      const registration = await BaseAuthApi.createUserRegistration(
        { firstFactorCredential: attestation },
        {
          appId,
          baseUrl: `https://${BASE_URL}`,
          authToken: challenge.temporaryAuthenticationToken,
        }
      )
      return registration
    } catch (e) {
      throw e
    }
  }

  const registerUserWithWallet = async (
    challenge: UserRegistrationChallenge,
    wallets: Wallet[],
    userName: string
  ): Promise<{
    walletAdddress: string
    recoveryCodes: { recoveryCode: string; credentialId: string }
    authToken: string
  }> => {
    try {
      if (!BASE_URL) throw new Error('BASE_URL not set')
      const dfnsApi = new DfnsApiClient({
        appId,
        baseUrl: `https://${BASE_URL}`,
        authToken: challenge.temporaryAuthenticationToken,
        signer: webauthn,
      })
      const attestation = await webauthn.create(challenge)

      const credentialName = getCredentialName(attestation)

      const clientData: KeyClientData = {
        type: 'key.create',
        challenge: challenge.challenge,
        origin: window.location.origin,
        crossOrigin: false,
      }
      const { credentials, recoveryKey } = await createRecoveryCredential(clientData, userName)
      if (!credentials?.recoveryFactor) throw new Error('Error creating Recovery Credentials')
      const remappedRecoveryCredential = {
        credentialKind: 'RecoveryKey',
        credentialInfo: {
          credId: credentials.recoveryFactor.credentialId,
          attestationData: arrayBufferToBase64UrlString(credentials.recoveryFactor.signature.attestationData),
          clientData: arrayBufferToBase64UrlString(credentials.recoveryFactor.signature.clientData),
        },
        encryptedPrivateKey: credentials.recoveryFactor.encryptedPrivateKey,
      } as const
      const registration = await dfnsApi.auth.registerEndUser({
        body: {
          firstFactorCredential: {
            ...attestation,
            credentialName,
          },
          wallets,
          recoveryCredential: remappedRecoveryCredential,
        },
      })
      const walletAdddress = registration?.wallets?.[0]?.address || ''
      const decodedRecoveryKey = JSON.parse(recoveryKey)
      return {
        walletAdddress,
        recoveryCodes: decodedRecoveryKey,
        authToken: registration?.authentication?.token,
      }
    } catch (e) {
      throw e
    }
  }

  const sendVerificationCodeToEmail = async ({ username }: { username: string }) => {
    if (!BASE_URL) throw new Error('BASE_URL not set')
    const currentApp = getAppEntry(currentIdentifier)
    const appId = currentApp?.appId || ''
    const orgId = currentApp?.orgId || ''
    const userAuthToken = currentApp?.userAuthToken || ''
    const dfns = new DfnsApiClient({
      appId,
      baseUrl: `https://${BASE_URL}`,
      authToken: userAuthToken,
      signer: webauthn,
    })
    try {
      await dfns.auth.sendRecoveryCode({
        body: { username, orgId },
      })
      return true
    } catch (e) {
      throw e
    }
  }

  type RecoverCredentialsArgs = {
    username: string
    verificationCode: string
    recoveryCredId: string
    recoveryCode: string
  }
  const recoverCredentials = async ({
    username,
    verificationCode,
    recoveryCredId,
    recoveryCode,
  }: RecoverCredentialsArgs) => {
    const currentApp = getAppEntry(currentIdentifier)
    const orgId = currentApp?.orgId || ''
    try {
      // Hack to get recovery working with iframe
      localStorage.setItem(LOCAL_STORAGE_APP_ID, JSON.stringify({ orgId, appId }))

      const key = await sendApiRequest(ApiEndpoint.recoverUser, {
        body: {
          username,
          verificationCode,
          recoveryCode,
          recoveryCredId,
          orgId,
        },
      })
      if (!key?.recoveryKey) throw Error('Recovery Key cannot be retrieved')
      return JSON.parse(key.recoveryKey) as { recoveryCode: string; credentialId: string }
    } catch (e) {
      throw e
    }
  }

  const createRecoveryCodes = async (username: string, credentialName: string) => {
    try {
      if (!process.env.NEXT_PUBLIC_IFRAME_ORIGIN) throw new Error('Missing data for recovery codes')
      const currentApp = getAppEntry(currentIdentifier)
      const userAuthToken = currentApp?.userAuthToken || ''

      const dfns = new DfnsApiClient({
        appId,
        authToken: userAuthToken,
        signer: webauthn,
        baseUrl: `https://${BASE_URL}`,
      })

      const recoverChallenge = await dfns.auth.createCredentialChallenge({ body: { kind: 'RecoveryKey' } })
      if (String(recoverChallenge.kind) !== String(CredentialKind.RecoveryKey))
        throw Error('Mismatch in Challenge kind')
      const clientData: KeyClientData = {
        type: 'key.create',
        // @ts-expect-error ts definition mismatch
        challenge: recoverChallenge.challenge,
        origin: window.location.origin,
        crossOrigin: false,
      }
      const { credentials, recoveryKey } = await createRecoveryCredential(clientData, username)
      const bodies = createCreateCredentialRequestBody(
        credentials,
        recoverChallenge.temporaryAuthenticationToken,
        credentialName
      )

      if (!bodies?.recoveryFactor) throw Error('bodies?.recoveryFacto not set')
      await dfns.auth.createCredential({ body: bodies.recoveryFactor })
      return JSON.parse(recoveryKey)
    } catch (e) {
      throw e
    }
  }

  const listUserCredentials = async (userAuthToken: string) => {
    try {
      const dfnsApi = new DfnsApiClient({
        appId,
        authToken: userAuthToken,
        signer: webauthn,
        baseUrl: `https://${BASE_URL}`,
      })
      const allCredentials = await dfnsApi.auth.listCredentials()
      return allCredentials
    } catch (e) {
      throw e
    }
  }

  const createCredentialSignedChallenge = async ({ credentialKind }: { credentialKind: 'Fido2' | 'RecoveryKey' }) => {
    try {
      const dfnsApi = new DfnsApiClient({
        appId,
        authToken: userAuthToken,
        signer: webauthn,
        baseUrl: `https://${BASE_URL}`,
      })
      const challenge = await dfnsApi.auth.createCredentialChallenge({ body: { kind: credentialKind } })
      // @ts-expect-error sdk type definitions mismatch
      const signedChallenge = await webauthn.create(challenge)
      return { signedChallenge, challenge }
    } catch (e) {
      throw e
    }
  }

  const signCreatedCredential = async ({
    credentialName,
    credentialKind,
    signedChallenge,
    challenge,
  }: {
    credentialName: string
    credentialKind: 'Fido2' | 'RecoveryKey'
    signedChallenge: Fido2Attestation
    challenge: CreateCredentialChallengeResponse
  }) => {
    try {
      const dfnsApi = new DfnsApiClient({
        appId,
        authToken: userAuthToken,
        signer: webauthn,
        baseUrl: `https://${BASE_URL}`,
      })
      const newCredential = await dfnsApi.auth.createCredential({
        body: {
          credentialKind: credentialKind,
          credentialInfo: signedChallenge.credentialInfo,
          credentialName,
          challengeIdentifier: challenge.challengeIdentifier,
        },
      })
      return newCredential
    } catch (e) {
      throw e
    }
  }

  const archiveCredential = async ({
    credentialUuid,
    shouldArchive,
  }: {
    credentialUuid: EntityId
    shouldArchive: boolean
  }) => {
    try {
      const dfnsApi = new DfnsApiClient({
        appId,
        authToken: userAuthToken,
        signer: webauthn,
        baseUrl: `https://${BASE_URL}`,
      })

      if (shouldArchive) {
        await dfnsApi.auth.deactivateCredential({ body: { credentialUuid } })
      } else {
        await dfnsApi.auth.activateCredential({ body: { credentialUuid } })
      }
    } catch (e) {
      throw e
    }
  }

  const validateAuthCookie = useCallback(
    (userAuthToken: string) => {
      const decoded: Record<string, string> = jwtDecode(userAuthToken)
      if (!decoded?.exp || isNaN(Number(decoded?.exp))) return
      const expirationDate = new Date(Number(decoded?.exp) * 1000)
      if (expirationDate < new Date()) logout()
    },
    [logout]
  )

  const setAuthToken = useCallback(
    (token: string) => {
      updateAppEntry(currentIdentifier, { userAuthToken: token })
    },
    [updateAppEntry, currentIdentifier]
  )

  useEffect(() => {
    if (userAuthToken) {
      setUser(extractUser(userAuthToken))
      validateAuthCookie(userAuthToken)
    }
  }, [validateAuthCookie, userAuthToken])

  return {
    user,
    error,
    createRecoveryCodes,
    setAuthToken,
    login,
    loginWithToken,
    listUserCredentials,
    createCredentialSignedChallenge,
    signCreatedCredential,
    archiveCredential,
    logout,
    register,
    registerUserWithWallet,
    setError,
    sendVerificationCodeToEmail,
    recoverCredentials,
  }
}

export const extractUser = (accessToken: string): string => {
  try {
    const decoded: Record<string, string> = jwtDecode(accessToken)
    return decoded['https://custom/username']
  } catch (e) {
    console.error('error decoding jwt:', e)
    return ''
  }
}
