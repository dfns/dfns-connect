export declare class User {
  email?: string
  orgId?: string
  userId?: string
  name?: string
  picture?: string
  [key: string]: unknown
}

export interface IdentityProviderState<TUser extends User = User> {
  error?: Error
  isAuthenticated: boolean
  isLoading: boolean
  user?: TUser
}

export const initialIdentityProviderState: IdentityProviderState = {
  isAuthenticated: false,
  isLoading: true,
}
