import { ComponentType, FC,useEffect } from 'react'
import { errorHandler } from 'utils/errors'

import useIdentityProvider from './useIdentityProvider'

const defaultOnRedirecting = (): JSX.Element => <></>

const defaultReturnTo = (): string =>
  `${window.location.pathname}${window.location.search}`

const withAuthenticationRequired = <P extends object>(
  Component: ComponentType<P>
): FC<P> => {
  return function WithAuthenticationRequired(props: P): JSX.Element {
    const { isAuthenticated, isLoading, error, login } = useIdentityProvider()

    useEffect(() => {
      (async (): Promise<void> => {
        if (isLoading || isAuthenticated) {
          return
        }

        const opts = {
          appState: {
            returnTo: defaultReturnTo(),
          },
          username: '',
          orgId: '',
        }

        await login(opts)
      })()
    }, [
      isLoading,
      isAuthenticated,
      login,
      error,
    ])

    return isAuthenticated ? <Component {...props} /> : defaultOnRedirecting()
  }
}

export default withAuthenticationRequired
