import { createContext } from 'react'

import { AppState } from './identityProvider'
import { IdentityProviderState, initialIdentityProviderState, User } from './identityProviderState'

export interface RedirectLoginResult<TAppState = AppState> {
  appState?: TAppState
}

export interface LoginOptions<TAppState = AppState> {
  appState?: TAppState
  username: string
  orgId: string
}

export interface LogoutOptions<TAppState = AppState> {
  appState?: TAppState
  skipRedirect?: boolean
  error?: string
}

export interface IdentityProviderContextInterface<TUser extends User = User>
  extends IdentityProviderState<TUser> {
  loginLocally: (options?: LoginOptions) => Promise<void>
  login: (options?: LoginOptions) => Promise<void>
  logout: (options?: LogoutOptions) => Promise<void>
}

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <IdentityProvider>.')
}

const initialContext = {
  ...initialIdentityProviderState,
  loginLocally: stub,
  login: stub,
  logout: stub,
}

const IdentityProviderContext = createContext<IdentityProviderContextInterface>(initialContext)

export default IdentityProviderContext
