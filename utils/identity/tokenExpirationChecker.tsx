import React, { useEffect, useState } from 'react'
import { errorHandler } from 'utils/errors'
import { getUserIdentity, useUserIdentity } from 'utils/hooks/useUserIdentity'

import useIdentityProvider from './useIdentityProvider'

export interface TokenExpirationCheckerOptions {
  children?: React.ReactNode

  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const TokenExpirationChecker = (opts: TokenExpirationCheckerOptions): JSX.Element => {
  const {
    children,
  } = opts

  const { logout } = useIdentityProvider()

  const userIdentity = useUserIdentity()

  const [isAuthenticated, setIsAuthenticated] = useState(!!userIdentity.username)
  const [error, setError] = useState('')

  useEffect(() => {
    const interval = setInterval(async () => {
      const userInfo = getUserIdentity()
      if (!userInfo.username) {
        setIsAuthenticated(false)
        if (isAuthenticated) {
          await logout()
          setError('Session expired')
        }
      } else {
        setIsAuthenticated(true)
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [isAuthenticated, logout, setIsAuthenticated, userIdentity])

  if (error) {
    errorHandler()(new Error(error))
    setError('')
  }

  return (
    <div>
      {children}
    </div>
  )
}
