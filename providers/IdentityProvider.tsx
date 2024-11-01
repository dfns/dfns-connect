import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'
import { IdentityProvider as OriginalIdentityProvider } from 'utils/identity/identityProvider'
import useIdentityProvider from 'utils/identity/useIdentityProvider'
import withAuthenticationRequired from 'utils/identity/withAuthenticationRequired'
import { logIfDev } from 'utils/misc'
import { ROUTES } from 'utils/routes'

import { getEnvVar } from '../utils/env'

export type IdentityProviderOptions = {
  appId: string
  rpId: string
}

const idpConfig: IdentityProviderOptions = {
  appId: getEnvVar('NEXT_PUBLIC_APP_ID'),
  rpId: getEnvVar('NEXT_PUBLIC_APP_RPID'),
}

const Page: React.FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>
}

const ProtectedPage = withAuthenticationRequired(Page)

export const IdentityProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useIdentityProvider()

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    logIfDev('getting access token..')
  }, [isAuthenticated])

  const { route } = useRouter()

  const routeDetails = Object.entries(ROUTES).find(([_, { href }]) => href === route)
  const isPublicRoute = !!routeDetails?.[1]?.isPublic
  const redirectUri =
    typeof window !== 'undefined'
      ? window.location.pathname !== '/'
        ? `${window.location.origin}?redirect=${window.location.pathname}`
        : window.location.origin
      : undefined

  return (
    <OriginalIdentityProvider
      appId={idpConfig.appId}
      rpId={idpConfig.rpId}
      on
      cacheLocation="localstorage"
      redirectUri={redirectUri}
    >
      {isPublicRoute ? <Page>{children}</Page> : <ProtectedPage>{children}</ProtectedPage>}
    </OriginalIdentityProvider>
  )
}

withAuthenticationRequired(IdentityProvider)
