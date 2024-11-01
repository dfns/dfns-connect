import Router, { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { getWebAuthnCredential, UserCredentialOptions, UserCredentials } from 'utils/api/clients/dfnsApi/httpClient'
import { ApiEndpoint } from 'utils/api/constants'
import { useSendApiRequest } from 'utils/hooks/useSendApiRequest'
import { getUserIdentity, useUserIdentity } from 'utils/hooks/useUserIdentity'
import { LOCAL_STORAGE_APP_ID, LOCAL_STORAGE_LOGIN_REDIRECT, LOCAL_STORAGE_TOKEN_KEY } from 'utils/misc'

import IdentityProviderContext, { LoginOptions, LogoutOptions } from './identityProviderContext'
import { initialIdentityProviderState, User } from './identityProviderState'
import { reducer } from './reducer'
import { TokenExpirationChecker } from './tokenExpirationChecker'

export class IdpError extends Error {
  constructor(public error: string, public error_description?: string) {
    super(error_description || error)
  }
}

const CODE_RE = /[?&]code=[^&]+/
const STATE_RE = /[?&]state=[^&]+/
const ERROR_RE = /[?&]error=[^&]+/

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) && STATE_RE.test(searchParams)

const normalizeErrorFn =
  (fallbackMessage: string) =>
  (error: Error | { error: string; error_description?: string } | ProgressEvent | unknown): Error => {
    if (error && typeof error === 'object' && 'error' in error) {
      const err = error as { error: string; error_description?: string }
      return new IdpError(err.error, err.error_description)
    }
    if (error instanceof Error) {
      return error
    }
    return new Error(fallbackMessage)
  }

export const loginError = normalizeErrorFn('Login failed')

export const tokenError = normalizeErrorFn('Get access token failed')

export type AppState = {
  returnTo?: string
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface IdentityProviderOptions {
  children?: React.ReactNode

  onRedirectCallback?: (appState: AppState) => void

  skipRedirectCallback?: boolean

  appId: string

  rpId: string

  redirectUri?: string

  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const defaultOnRedirectCallback = (appState: AppState): void => {
  window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname)
}

export const getUserCredentials = async (supportedCredentials: UserCredentialOptions): Promise<UserCredentials> => {
  // TODO: Need to support logging in with other credential types.
  //if (supportedCredentials.supportedCredentialKinds.length > 1) {
  //}

  return getWebAuthnCredential(supportedCredentials.credentialData.webAuthnClientData)
}

export const IdentityProvider = (opts: IdentityProviderOptions): JSX.Element => {
  const { children, skipRedirectCallback, onRedirectCallback = defaultOnRedirectCallback } = opts

  const router = useRouter()

  const [logoutError, setLogoutError] = useState('')

  const [state, dispatch] = useReducer(reducer, initialIdentityProviderState)

  const userIdentity = useUserIdentity()

  const { sendApiRequest } = useSendApiRequest()

  useEffect(() => {
    ;(async (): Promise<void> => {
      try {
        if (hasAuthParams() && !skipRedirectCallback) {
          const { state } = router.query
          const appState =
            typeof state === 'string' ? (JSON.parse(Buffer.from(state, 'base64').toString()) as AppState) : {}
          onRedirectCallback(appState)
        }
        if (userIdentity.username) {
          const user = {
            email: userIdentity.username,
            orgId: userIdentity.orgId,
            userId: userIdentity.employeeId,
            name: userIdentity.username,
          } as User
          dispatch({ type: 'INITIALISED', user })
        } else {
          dispatch({ type: 'INITIALISED' })
        }
      } catch (error) {
        dispatch({ type: 'ERROR', error: loginError(error) })
      }
    })()
  }, [userIdentity, router, onRedirectCallback, skipRedirectCallback])

  const login = useCallback(async (opts: LoginOptions = { username: '', orgId: '' }): Promise<void> => {
    if (!localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)) {
      const state = opts.appState ? Buffer.from(JSON.stringify(opts.appState)).toString('base64') : ''
      Router.push({
        pathname: '/login',
        query: {
          username: opts.username,
          orgId: opts.orgId,
          state: state,
        },
      })
    } else {
      const userInfo = getUserIdentity()
      const user = {
        email: userInfo.username,
        orgId: userInfo.orgId,
        userId: userInfo.employeeId,
        name: userIdentity.username,
      } as User

      dispatch({ type: 'LOGIN_POPUP_COMPLETE', user })

      if (!userInfo.username) {
        await logout({
          error: 'Session expired',
        })
      }
    }
  }, [])

  const logout = useCallback(
    async (opts: LogoutOptions = { appState: undefined }): Promise<void> => {
      await sendApiRequest(ApiEndpoint.logoutUser)
      if (localStorage) {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
        localStorage.removeItem(LOCAL_STORAGE_APP_ID)
      }

      const error = opts.error || logoutError
      if (error) {
        dispatch({ type: 'ERROR', error: new Error(error) })
      }

      dispatch({ type: 'LOGOUT' })
      if (!opts.skipRedirect) {
        const state = opts.appState ? Buffer.from(JSON.stringify(opts.appState)).toString('base64') : ''
        Router.push({
          pathname: '/login',
          query: {
            username: '',
            orgId: '',
            state: state,
          },
        })
      }
    },
    [sendApiRequest, logoutError]
  )

  const loginLocally = useCallback(
    async (opts: LoginOptions = { username: '', orgId: '', appState: undefined }): Promise<void> => {
      await sendApiRequest(ApiEndpoint.loginUser, {
        body: {
          username: opts.username,
          orgId: opts.orgId,
        },
      })

      const userInfo = getUserIdentity()
      const user = {
        email: userInfo.username,
        orgId: userInfo.orgId,
        userId: userInfo.employeeId,
        name: userIdentity.username,
      } as User

      dispatch({ type: 'LOGIN_POPUP_COMPLETE', user })

      if (!userInfo.username) {
        await logout({
          error: 'Session expired',
        })
      } else {
        const appState = opts.appState
          ? opts.appState
          : {
              returnTo: localStorage.getItem(LOCAL_STORAGE_LOGIN_REDIRECT),
            }
        window.location.href = appState.returnTo || window.location.origin
      }
    },
    [sendApiRequest]
  )

  const contextValue = useMemo(() => {
    return {
      ...state,
      loginLocally,
      login,
      logout,
    }
  }, [state, loginLocally, login, logout])

  return (
    <IdentityProviderContext.Provider value={contextValue}>
      <TokenExpirationChecker />
      {children}
    </IdentityProviderContext.Provider>
  )
}
