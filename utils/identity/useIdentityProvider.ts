import { useContext } from 'react'

import IdentityProviderContext, { IdentityProviderContextInterface } from './identityProviderContext'
import { User } from './identityProviderState'

const useIdentityProvider = <TUser extends User = User>(): IdentityProviderContextInterface<TUser> =>
  useContext(IdentityProviderContext) as IdentityProviderContextInterface<TUser>

export default useIdentityProvider  
