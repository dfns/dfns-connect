import { DfnsError, Fido2Attestation, UserRegistrationResponse } from '@dfns/sdk'
import { ListCredentialsResponse } from '@dfns/sdk/generated/auth'
import { CreateCredentialChallengeResponse } from '@dfns/sdk/generated/auth'
import { GenerateSignatureResponse, ListWalletsResponse } from '@dfns/sdk/generated/wallets'
import { GenerateSignatureBody } from '@dfns/sdk/generated/wallets/types'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useSignerStore } from '@/store/iframe'
import { extractUser, useAuth } from '@/utils/hooks/iframe/useAuth'
import { useWallet } from '@/utils/hooks/iframe/useWallet'
import {
  IframeActiveState,
  IframeActiveStateRoutes,
  MessageActions,
  MessageActionsResponses,
  MessageParentActions,
  MessageParentActionsResponses,
  MessageResponsePayload,
  UserInteractionTypes,
} from '@/utils/types/dfnsConnect'

export type TimeoutRef = ReturnType<typeof setTimeout> | number

export const useWindowMesssages = () => {
  const { createWallet, listUserWallets, createWalletSignature } = useWallet()
  const {
    login,
    loginWithToken,
    createCredentialSignedChallenge,
    signCreatedCredential,
    listUserCredentials,
    createRecoveryCodes,
    archiveCredential,
    register,
    registerUserWithWallet,
    sendVerificationCodeToEmail,
    recoverCredentials,
    logout,
    error,
    user,
  } = useAuth()
  const router = useRouter()
  const [isParentReady, setIsParentReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userInteractionType, setUserInteractionType] = useState('')
  const [userInteractionStatus, setUserInteractionStatus] = useState('')
  const [eventPayload, setEventPayload] = useState<GenerateSignatureBody | null>(null)
  const [userWallets, setUserWallets] = useState<ListWalletsResponse | null>(null)
  const [parentErrorMessage, setParentErrorMessage] = useState('')
  const [lastEvent, setLastEvent] = useState<MessageEvent | null>()
  const [createUserCredentialChallenge, setCreateUserCredentialChallenge] = useState<UserRegistrationResponse | null>(
    null
  )
  const [recoveryCodes, setRecoveryCodes] = useState<{ recoveryCode: string; credentialId: string } | null>()
  const [userCredentials, setUserCredentials] = useState<ListCredentialsResponse | null>()
  const timerId = useRef<TimeoutRef>()

  const { addAppEntry, setIdentifier, getAppEntry, updateAppEntry, currentIdentifier } = useSignerStore()
  const currentAppEntry = getAppEntry(currentIdentifier)
  const isLoggedIn = !!currentAppEntry?.userAuthToken
  const isShowErrors = currentAppEntry?.isShowErrors

  const getUpdatedAuthTokenFromStore = useCallback(() => {
    const currentApp = getAppEntry(currentIdentifier)
    return currentApp?.userAuthToken
  }, [getAppEntry, currentIdentifier])

  const debouncedRouterPush = useCallback(
    (route: string) => {
      clearTimeout(timerId.current)
      return new Promise((resolve, reject) => {
        timerId.current = setTimeout(() => {
          router
            .push(route)
            .then((success) => {
              if (success) {
                resolve(true)
              } else {
                console.error('failed to navigate')
                reject()
              }
            })
            .catch((error) => reject(error))
        }, 100)
      })
    },
    [router]
  )

  const updateIframeScreen = useCallback(
    async (requestedScreen: IframeActiveState) => {
      if (requestedScreen && requestedScreen in IframeActiveStateRoutes) {
        const routeKey = requestedScreen as keyof typeof IframeActiveStateRoutes
        const route = IframeActiveStateRoutes[routeKey]
        if (!lastEvent) return
        sendMessageToOrigin(lastEvent, {
          actionResponse: MessageActionsResponses.updateIframeScreenStateSuccess,
        })
        await debouncedRouterPush(`/iframe/${route}`)
      }
    },
    [lastEvent, debouncedRouterPush]
  )

  const isAuthorizedAction = useCallback(
    (event: MessageEvent, userAuthToken: string) => {
      if (!userAuthToken) {
        sendMessageToOrigin(event, {
          parentAction: MessageParentActionsResponses.error,
          errorMessage: `${event.data.action} requires user to be loggedin`,
        })
        updateIframeScreen(IframeActiveState.createUserAndWallet)
        setIsLoading(false)
        return false
      }
      return true
    },
    [updateIframeScreen]
  )

  type ErrorScreenProps = {
    message: string
    e: DfnsError
    returnScreen?: IframeActiveState
  }
  const showErrorScreen = useCallback(
    async ({ message, e, returnScreen }: ErrorScreenProps) => {
      setIsLoading(false)
      await sendMessageToParent({
        parentAction: MessageParentActions.handleError,
        parentActionResponse: MessageParentActionsResponses.handleErrorSuccess,
        errorMessage: message || '',
        errorObject: e?.message || '',
      })
      setParentErrorMessage(message)
      if (isShowErrors) {
        await updateIframeScreen(IframeActiveState.parentErrorMessage)
      }
      if (returnScreen) {
        await updateIframeScreen(returnScreen)
      }
    },
    [updateIframeScreen, setIsLoading, isShowErrors]
  )

  const doIsWalletExists = useCallback(
    async (event: MessageEvent) => {
      try {
        const userAuthToken = getUpdatedAuthTokenFromStore()
        if (!userAuthToken) return false
        const userWallets = await listUserWallets(userAuthToken)
        setUserWallets(userWallets)
        return userWallets
      } catch (e) {
        sendMessageToOrigin(event, {
          parentAction: MessageParentActionsResponses.error,
          errorMessage: 'Error IsWalletExists',
        })
      }
    },
    [listUserWallets, getUpdatedAuthTokenFromStore]
  )

  const doCreateWallet = useCallback(
    async (event: MessageEvent) => {
      try {
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''

        setIsLoading(true)

        const userName = event?.data?.userName || ''
        if (!userName) throw new Error('Create Wallet Error - userName not set')
        const networkId = event?.data?.networkId || ''
        if (!networkId) throw new Error('Create Wallet Error - networkId not set')
        const walletName = event?.data?.walletName || ''
        if (!walletName) throw new Error('Create Wallet Error - walletName not set')
        const isUserWalletExists = await doIsWalletExists(event)
        if (isUserWalletExists) {
          sendMessageToOrigin(event, {
            actionResponse: MessageActionsResponses.createWalletSuccess,
          })
          await updateIframeScreen(IframeActiveState.userWallet)
          setIsLoading(false)
        }
        const createdWallet = await createWallet(networkId, walletName, userAuthToken)
        setUserWallets({ items: [createdWallet] })
        if (!createdWallet) throw new Error('Create Wallet Error - wallet not created successfully')
        sendMessageToOrigin(event, {
          actionResponse: MessageActionsResponses.createWalletSuccess,
          createdWallet,
        })
        await updateIframeScreen(IframeActiveState.userWallet)
        setIsLoading(false)
      } catch (e) {
        showErrorScreen({ message: 'Create Wallet Error', e: e as DfnsError })
      }
    },
    [setIsLoading, doIsWalletExists, showErrorScreen, updateIframeScreen, createWallet, getUpdatedAuthTokenFromStore]
  )

  const doListWallets = useCallback(
    async (event: MessageEvent) => {
      setIsLoading(true)
      try {
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''
        if (!isAuthorizedAction(event, userAuthToken)) return
        const userWallets = await listUserWallets(userAuthToken)
        setUserWallets(userWallets)
        if (event) {
          sendMessageToOrigin(event, {
            actionResponse: MessageActionsResponses.walletsList,
            userWallets,
          })
        }
        await updateIframeScreen(
          userWallets && userWallets.items?.length > 0
            ? IframeActiveState.userWallet
            : IframeActiveState.createUserAndWallet
        )
        setIsLoading(false)
      } catch (e) {
        showErrorScreen({ message: 'List Wallets Error', e: e as DfnsError })
      }
    },
    [
      setIsLoading,
      updateIframeScreen,
      isAuthorizedAction,
      showErrorScreen,
      listUserWallets,
      getUpdatedAuthTokenFromStore,
    ]
  )

  const listOrCreateWallet = useCallback(
    async (event: MessageEvent) => {
      const userAuthToken = getUpdatedAuthTokenFromStore()
      if (!userAuthToken) {
        await updateIframeScreen(IframeActiveState.createUserAndWallet)
        return
      }
      const isUserWalletExists = await doIsWalletExists(event)
      if (event.data.action === MessageActions.listWallets && !isUserWalletExists) {
        await updateIframeScreen(IframeActiveState.createUserAndWallet)
        return
      }
      if (!isUserWalletExists) {
        await doCreateWallet(event)
      } else {
        doListWallets(event)
        await updateIframeScreen(IframeActiveState.userWallet)
      }
    },
    [getUpdatedAuthTokenFromStore, doCreateWallet, doListWallets, updateIframeScreen, doIsWalletExists]
  )

  const showUserTransactionToSign = useCallback(
    async (event: MessageEvent) => {
      try {
        setIsLoading(true)
        setEventPayload(null)
        setUserInteractionStatus('')
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''
        if (!isAuthorizedAction(event, userAuthToken)) {
          return
        }
        const transactionPayload = event?.data?.transactionPayload
        if (transactionPayload.kind !== 'Eip712') throw new Error('Only Eip712 signing accepted.')
        setEventPayload(transactionPayload)
        setUserInteractionType(UserInteractionTypes.sign)
        await updateIframeScreen(IframeActiveState.signTransaction)
        setIsLoading(false)
      } catch (e) {
        showErrorScreen({ message: 'Show User Transaction Error', e: e as DfnsError })
      }
    },
    [updateIframeScreen, showErrorScreen, isAuthorizedAction, getUpdatedAuthTokenFromStore]
  )

  const doCreateWalletSignature = useCallback(async () => {
    try {
      setIsLoading(true)
      const userAuthToken = getUpdatedAuthTokenFromStore() || ''
      const userWallets = await listUserWallets(userAuthToken)
      const walletId = userWallets?.items?.[0].id
      if (!walletId) throw new Error('No Wallet available.')
      if (!eventPayload) throw new Error('No transaction data.')
      await updateIframeScreen(IframeActiveState.transactionWaiting)
      const signedTransaction = await createWalletSignature(userAuthToken, walletId, eventPayload)
      sendMessageToParent({
        parentAction: MessageParentActions.handleSignedTransaction,
        signedTransaction,
      })
      setUserInteractionStatus('success')
      await updateIframeScreen(IframeActiveState.signTransaction)
      setIsLoading(false)
    } catch (e) {
      console.log('doCreateWalletSignature error', e)
      showErrorScreen({ message: 'Transaction Error', e: e as DfnsError })
    }
  }, [
    eventPayload,
    updateIframeScreen,
    listUserWallets,
    createWalletSignature,
    showErrorScreen,
    getUpdatedAuthTokenFromStore,
  ])

  const doListUserCredentials = useCallback(
    async (event: MessageEvent) => {
      try {
        setIsLoading(true)
        setUserCredentials({ items: [] })
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''
        if (!isAuthorizedAction(event, userAuthToken)) {
          return
        }
        const credentials = await listUserCredentials(userAuthToken)
        const nonRecoveryCredentials = credentials?.items?.filter((c) => c.kind === 'Fido2')
        setUserCredentials({ items: nonRecoveryCredentials })
        await updateIframeScreen(IframeActiveState.credentialsList)
        setIsLoading(false)
        return credentials
      } catch (e) {
        showErrorScreen({ message: 'Credentials list Error', e: e as DfnsError })
      }
    },
    [listUserCredentials, isAuthorizedAction, showErrorScreen, updateIframeScreen, getUpdatedAuthTokenFromStore]
  )

  const doListUserRecoveryCredentials = useCallback(
    async (event: MessageEvent) => {
      try {
        setIsLoading(true)
        setUserCredentials({ items: [] })
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''
        if (!isAuthorizedAction(event, userAuthToken)) {
          return
        }
        const credentials = await listUserCredentials(userAuthToken)
        const recoveryCredentials = credentials?.items?.filter((c) => c.kind === 'RecoveryKey')
        setUserCredentials({ items: recoveryCredentials })
        await updateIframeScreen(IframeActiveState.recoveryCredentialsList)
        setIsLoading(false)
        return credentials
      } catch (e) {
        showErrorScreen({ message: 'Recovery Credentials list Error', e: e as DfnsError })
      }
    },
    [listUserCredentials, isAuthorizedAction, showErrorScreen, updateIframeScreen, getUpdatedAuthTokenFromStore]
  )

  const doLogin = useCallback(
    async (event: MessageEvent) => {
      try {
        setIsLoading(true)
        await logout()
        const userName = event?.data?.userName
        if (!userName) throw new Error('Login: username not set.')
        await updateIframeScreen(IframeActiveState.webauthnWaiting)
        await login(userName)
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''
        if (!userAuthToken) throw new Error('error login')
        const IframeState = event?.data?.showScreen ? event.data.showScreen : IframeActiveState.createUserAndWallet
        if (IframeState === IframeActiveState.createUserAndWallet || IframeState === IframeActiveState.userWallet) {
          await listOrCreateWallet(event)
        } else if (IframeState === IframeActiveState.credentialsList) {
          await doListUserCredentials(event)
        } else {
          await updateIframeScreen(IframeState)
        }
        sendMessageToOrigin(event, {
          actionResponse: MessageActionsResponses.loginSuccess,
        })
        setIsLoading(false)
      } catch (e) {
        showErrorScreen({
          message: 'Login Error',
          e: e as DfnsError,
          returnScreen: IframeActiveState.createUserAndWallet,
        })
      }
    },
    [
      login,
      logout,
      doListUserCredentials,
      getUpdatedAuthTokenFromStore,
      setIsLoading,
      showErrorScreen,
      listOrCreateWallet,
      updateIframeScreen,
    ]
  )

  const doLoginWithToken = useCallback(
    async (event: MessageEvent) => {
      try {
        setIsLoading(true)
        const token = event.data.token
        loginWithToken(token)
        sendMessageToOrigin(event, {
          actionResponse: MessageActionsResponses.loginWithTokenSuccess,
        })
        const IframeState = event?.data?.showScreen ? event.data.showScreen : IframeActiveState.createUserAndWallet
        await updateIframeScreen(IframeState)
        setIsLoading(false)
      } catch (e) {
        showErrorScreen({ message: 'Login with Token Error', e: e as DfnsError })
      }
    },
    [loginWithToken, setIsLoading, showErrorScreen, updateIframeScreen]
  )

  const doSignRegisterInit = useCallback(
    async (event: MessageEvent) => {
      try {
        setIsLoading(true)
        logout()
        const userName = event?.data?.userName || ''
        if (!userName) throw new Error('Register Init Error - userName not set')
        const challenge = event?.data?.challenge || ''
        if (!challenge) throw new Error('Register Init Error - challenge not set')
        const signedRegisterInitChallenge = await register(challenge)
        setCreateUserCredentialChallenge(challenge)
        await sendMessageToOrigin(event, {
          actionResponse: MessageActionsResponses.signRegisterInitSuccess,
          signedRegisterInitChallenge,
        })
        setIsLoading(false)
      } catch (e) {
        showErrorScreen({ message: 'Register Init Error', e: e as DfnsError })
      }
    },
    [setIsLoading, register, logout, showErrorScreen]
  )

  type doRecoverCredentialsArgs = {
    username: string
    verificationCode: string
    recoveryCredId: string
    recoveryCode: string
  }
  const doRecoverCredentials = useCallback(
    async ({ username, verificationCode, recoveryCredId, recoveryCode }: doRecoverCredentialsArgs) => {
      try {
        await updateIframeScreen(IframeActiveState.webauthnWaiting)
        const codes = await recoverCredentials({ username, verificationCode, recoveryCredId, recoveryCode })
        setRecoveryCodes(codes)
        await updateIframeScreen(IframeActiveState.recoveryCodes)
      } catch (e) {
        showErrorScreen({ message: 'Recovery Codes Error', e: e as DfnsError })
      }
    },
    [recoverCredentials, updateIframeScreen, showErrorScreen]
  )

  const doGetRecoveryCodes = useCallback(
    async (challenge: UserRegistrationResponse) => {
      try {
        setIsLoading(true)

        // @ts-expect-error type mismatch
        const codes = await createRecoveryCodes(challenge.user.name)
        setRecoveryCodes(codes)
        setCreateUserCredentialChallenge(null)

        setIsLoading(false)
      } catch (e) {
        showErrorScreen({ message: 'Recovery Codes Error', e: e as DfnsError })
      }
    },
    [createRecoveryCodes, showErrorScreen]
  )

  const doLogout = useCallback(
    async (event: MessageEvent) => {
      try {
        setIsLoading(false)
        setUserWallets(null)
        setParentErrorMessage('')
        setCreateUserCredentialChallenge(null)
        setRecoveryCodes(null)
        setUserCredentials(null)

        logout()

        await updateIframeScreen(
          event?.data?.showScreen ? event.data.showScreen : IframeActiveState.createUserAndWallet
        )
        sendMessageToOrigin(event, {
          parentAction: MessageParentActionsResponses.userLogoutSuccess,
        })
      } catch (e) {
        showErrorScreen({ message: 'Logout Error', e: e as DfnsError })
      }
    },
    [logout, showErrorScreen, setIsLoading, updateIframeScreen]
  )

  const doCreateUserAndWallet = useCallback(
    async (event: MessageEvent) => {
      doLogout(event)
      setIsLoading(true)
      try {
        const challenge = event?.data?.challenge || ''
        if (!challenge) throw new Error('Create User Error - challenge not set')
        const wallets = event?.data?.wallets || []
        if (wallets.length <= 0) throw new Error('Create User Error - network not set')
        const userName = event?.data?.challenge?.user?.name || ''
        if (!userName) throw new Error('Create User Error - userName not set')

        setCreateUserCredentialChallenge(challenge)
        await updateIframeScreen(IframeActiveState.createPasskeyWaiting)
        const { recoveryCodes, authToken, walletAdddress } = await registerUserWithWallet(challenge, wallets, userName)
        if (authToken) {
          loginWithToken(authToken)
        }
        setRecoveryCodes(recoveryCodes)
        await updateIframeScreen(event?.data?.showScreen ? event.data.showScreen : IframeActiveState.recoveryCodes)
        setIsLoading(false)
        return walletAdddress
      } catch (e) {
        showErrorScreen({
          message: 'Create End User Error',
          e: e as DfnsError,
          returnScreen: IframeActiveState.createUserAndWallet,
        })
      }
    },
    [setIsLoading, doLogout, loginWithToken, updateIframeScreen, registerUserWithWallet, showErrorScreen]
  )

  const doSignAdditionalCredentialCreation = useCallback(
    async (credentialKind: 'Fido2' | 'RecoveryKey') => {
      try {
        setIsLoading(true)
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''
        if (!userAuthToken) throw new Error('user must log in.')
        const signedChallenge = await createCredentialSignedChallenge({ credentialKind })
        setIsLoading(false)
        return signedChallenge
      } catch (e) {
        setUserInteractionStatus('error')
        showErrorScreen({ message: 'Credentials Create Signed Challenge Error', e: e as DfnsError })
      }
    },
    [createCredentialSignedChallenge, getUpdatedAuthTokenFromStore, showErrorScreen]
  )

  const doAuthorizeAdditionalCredential = useCallback(
    async (
      credentialName: string,
      credentialKind: 'Fido2' | 'RecoveryKey',
      challenge: CreateCredentialChallengeResponse,
      signedChallenge: Fido2Attestation
    ) => {
      try {
        setIsLoading(true)
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''
        if (!userAuthToken) throw new Error('user must log in.')
        console.log('signing new device1')
        const response = await signCreatedCredential({ credentialName, credentialKind, signedChallenge, challenge })
        console.log('signing new device2', { response })
        const credentials = await listUserCredentials(userAuthToken)
        const credentialsOfSameKind = credentials.items.filter((c) => c.kind === credentialKind)
        setUserCredentials({ items: credentialsOfSameKind })
        setIsLoading(false)
      } catch (e) {
        setUserInteractionStatus('error')
        showErrorScreen({ message: 'Credentials list Error', e: e as DfnsError })
      }
    },
    [signCreatedCredential, listUserCredentials, getUpdatedAuthTokenFromStore, showErrorScreen]
  )

  const doCreateAdditionalRecoveryCredential = useCallback(
    async (credentialName: string) => {
      try {
        setIsLoading(true)
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''
        if (!userAuthToken) throw new Error('user must log in.')
        const username = extractUser(userAuthToken)
        const res = await createRecoveryCodes(username, credentialName)
        setRecoveryCodes({ recoveryCode: res.recoveryCode, credentialId: res.credentialId })
        await updateIframeScreen(IframeActiveState.recoveryCodes)
        const credentials = await listUserCredentials(userAuthToken)
        const credentialsOfSameKind = credentials.items.filter((c) => c.kind === 'RecoveryKey')
        setUserCredentials({ items: credentialsOfSameKind })
        setIsLoading(false)
      } catch (e) {
        setUserInteractionStatus('error')
        showErrorScreen({ message: 'Credentials list Error', e: e as DfnsError })
      }
    },
    [createRecoveryCodes, listUserCredentials, getUpdatedAuthTokenFromStore, showErrorScreen, updateIframeScreen]
  )

  const doArchiveCredential = useCallback(
    async (credentialUuid: string, shouldArchive: boolean, credentialKind: 'Fido2' | 'RecoveryKey') => {
      try {
        setIsLoading(true)
        const userAuthToken = getUpdatedAuthTokenFromStore() || ''
        if (!userAuthToken) throw new Error('user must log in.')
        await archiveCredential({ credentialUuid, shouldArchive })
        const credentials = await listUserCredentials(userAuthToken)
        if (!!credentials) {
          const credentialsOfSameKind = credentials.items.filter((c) => c.kind === credentialKind)
          setUserCredentials({ items: credentialsOfSameKind })
        }
        setIsLoading(false)
      } catch (e) {
        showErrorScreen({
          message: 'Credentials list Error',
          e: e as DfnsError,
          returnScreen: IframeActiveState.credentialsList,
        })
      }
    },
    [archiveCredential, showErrorScreen, listUserCredentials, getUpdatedAuthTokenFromStore]
  )

  const handleWindowMessages = useCallback(
    async (event: MessageEvent) => {
      const origin = event.origin
      if (!validateOrigin(origin)) {
        return
      }

      const action = event?.data?.action || ''
      if (!Object.values(MessageActions).includes(action)) {
        return
      }

      try {
        if (!event.data.appId) throw new Error('App id not set')
        const appId = event?.data?.appId
        const orgId = event?.data?.orgId
        const theme = event?.data?.theme
        const isShowErrors = event?.data?.isShowErrors || false
        const hostname = window.location.hostname
        const port = window.location.port
        const uniqueIdentifier = `${hostname}:${port}_${appId}`
        if (appId) {
          setIdentifier(uniqueIdentifier)
          const exists = getAppEntry(uniqueIdentifier)
          !!exists
            ? updateAppEntry(uniqueIdentifier, { appId, orgId, theme, isShowErrors })
            : addAppEntry({ uniqueIdentifier, appId, orgId, theme, isShowErrors })
        }
      } catch (e) {
        showErrorScreen({ message: 'Error initializing Dfns', e: e as DfnsError })
        return
      }

      const userAuthToken = getUpdatedAuthTokenFromStore() || ''
      setLastEvent(event)
      switch (action) {
        case MessageActions.iframeReady:
          sendMessageToOrigin(event, {
            actionResponse: MessageActionsResponses.iframeReadySuccess,
          })
          return
        case MessageActions.getAuthToken:
          setIsParentReady(true)
          sendMessageToOrigin(event, {
            actionResponse: MessageActionsResponses.authenticated,
            userAuthToken,
          })
          return
        case MessageActions.updateIframeScreenState:
          const showScreen = event?.data?.showScreen
          const isWalletScreen = [IframeActiveState.createUserAndWallet, IframeActiveState.userWallet].includes(
            showScreen
          )
          if (!userAuthToken && isWalletScreen) {
            await updateIframeScreen(showScreen ? showScreen : IframeActiveState.createUserAndWallet)
            setIsLoading(false)
          } else if (showScreen && showScreen in IframeActiveState) {
            if (isWalletScreen) {
              await listOrCreateWallet(event)
            } else if ([IframeActiveState.credentialsList].includes(showScreen)) {
              await doListUserCredentials(event)
            } else {
              await updateIframeScreen(showScreen ? showScreen : IframeActiveState.createUserAndWallet)
              setIsLoading(false)
            }
          }
          return
        case MessageActions.login:
          doLogin(event)
          return
        case MessageActions.loginWithToken:
          doLoginWithToken(event)
          return
        case MessageActions.signRegisterInit:
          doSignRegisterInit(event)
          return
        case MessageActions.createUserAndWallet:
          const walletAddress = await doCreateUserAndWallet(event)
          sendMessageToOrigin(event, {
            actionResponse: MessageActionsResponses.createUserAndWalletSuccess,
            userWalletAddress: walletAddress || '',
            isUserCreatedSuccess: !!walletAddress,
          })
          return
        case MessageActions.logout:
          doLogout(event)
          return
        case MessageActions.createWallet:
        case MessageActions.listWallets:
          if (!isAuthorizedAction(event, userAuthToken)) return
          await listOrCreateWallet(event)
          return
        case MessageActions.userWalletExists:
          if (!isAuthorizedAction(event, userAuthToken)) return
          const isWalletExists = await doIsWalletExists(event)
          sendMessageToOrigin(event, {
            parentAction: MessageParentActionsResponses.isWalletExistsSuccess,
            isWalletExists: !!isWalletExists,
          })
          return
        case MessageActions.getCurrentUserInfo:
          let userWalletAddress
          if (!!userAuthToken || userWallets?.items?.length === 0) {
            try {
              const getUserWallet = await listUserWallets(userAuthToken)
              userWalletAddress = getUserWallet?.items?.[0]?.address || ''
              sendMessageToOrigin(event, {
                actionResponse: MessageActionsResponses.getCurrentUserInfoSuccess,
                userWalletAddress,
                isUserLoggedin: !!userAuthToken,
              })
              return
            } catch {}
          }
          sendMessageToOrigin(event, {
            actionResponse: MessageActionsResponses.getCurrentUserInfoSuccess,
            userWalletAddress: '',
            isUserLoggedin: false,
          })

          doLogout(event)

          return
        case MessageActions.signWalletTransaction:
          if (!isAuthorizedAction(event, userAuthToken)) {
            return
          }
          showUserTransactionToSign(event)
          return
        case MessageActions.listUserCredentials:
          if (!isAuthorizedAction(event, userAuthToken)) return
          doListUserCredentials(event)
          return
        case MessageActions.listUserRecoveryCredentials:
          if (!isAuthorizedAction(event, userAuthToken)) return
          doListUserRecoveryCredentials(event)
          return
        default:
          return
      }
    },
    [
      userWallets,
      doIsWalletExists,
      showErrorScreen,
      listUserWallets,
      doLogin,
      getAppEntry,
      updateAppEntry,
      doSignRegisterInit,
      isAuthorizedAction,
      doListUserCredentials,
      doListUserRecoveryCredentials,
      showUserTransactionToSign,
      doLogout,
      listOrCreateWallet,
      doLoginWithToken,
      doCreateUserAndWallet,
      updateIframeScreen,
      addAppEntry,
      setIdentifier,
      getUpdatedAuthTokenFromStore,
    ]
  )

  useEffect(() => {
    getUpdatedAuthTokenFromStore()
  }, [getUpdatedAuthTokenFromStore])

  useEffect(() => {
    window.addEventListener('message', handleWindowMessages, false)
    return () => window.removeEventListener('message', handleWindowMessages)
  }, [handleWindowMessages])

  useEffect(() => {
    return () => clearTimeout(timerId.current)
  }, [])

  return {
    isLoggedIn,
    createWallet,
    listUserWallets,
    doListWallets,
    doIsWalletExists,
    createWalletSignature,
    doCreateWalletSignature,
    doGetRecoveryCodes,
    doListUserCredentials,
    doSignAdditionalCredentialCreation,
    doAuthorizeAdditionalCredential,
    doCreateAdditionalRecoveryCredential,
    doArchiveCredential,
    doRecoverCredentials,
    login,
    register,
    doLogout,
    logout,
    setEventPayload,
    sendMessageToOrigin,
    sendMessageToParent,
    setIsLoading,
    updateIframeScreen,
    setRecoveryCodes,
    getUpdatedAuthTokenFromStore,
    setUserInteractionStatus,
    sendVerificationCodeToEmail,
    recoverCredentials,
    userInteractionStatus,
    parentErrorMessage,
    createUserCredentialChallenge,
    isLoading,
    error,
    user,
    lastEvent,
    isParentReady,
    userInteractionType,
    userCredentials,
    recoveryCodes,
    eventPayload,
    userWallets,
  }
}

async function sendMessageToOrigin(event: MessageEvent, payload: MessageResponsePayload) {
  try {
    const { source, origin } = event
    if (!source || !origin) {
      return
    }
    source.postMessage(payload, origin as WindowPostMessageOptions)
  } catch (e) {
    console.error(e)
  }
}

interface EssentialPayload {
  parentAction?: MessageParentActions
  parentActionResponse?: MessageParentActionsResponses
  errorMessage?: string
  errorObject?: string
  signedTransaction?: GenerateSignatureResponse
}
export interface IframeParentMessagePayload extends EssentialPayload {}
export type MessageResponse = {
  actionResponse: MessageActionsResponses
}
export async function sendMessageToParent(payload: IframeParentMessagePayload): Promise<MessageResponse> {
  return new Promise((resolve, reject) => {
    const messageHandler = (event: MessageEvent) => {
      const { origin } = event
      if (!validateOrigin(origin)) {
        return
      }
      const received = event?.data?.parentActionResponse || ''
      const expected = payload.parentActionResponse || ''
      if (
        !received ||
        !expected ||
        !Object.values(MessageParentActionsResponses).includes(received) ||
        expected !== received
      ) {
        return
      }
      window.removeEventListener('message', messageHandler, false)
      resolve(event.data as MessageResponse)
    }
    window.addEventListener('message', messageHandler, false)
    try {
      window.parent.postMessage(payload, '*')
    } catch (error) {
      window.removeEventListener('message', messageHandler, false)
      reject(error)
    }
  })
}

function validateOrigin(url: string) {
  const ACCEPTED_REQUEST_URLS = process.env.NEXT_PUBLIC_IFRAME_ALLOWED_ORIGINS?.split(',') || []
  return ACCEPTED_REQUEST_URLS.includes(url)
}
