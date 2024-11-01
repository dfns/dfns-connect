import { useRouter } from 'next/router'
import React, { PropsWithChildren, useEffect } from 'react'
import { logIfDev } from 'utils/misc'

export const RedirectionHandler: React.FC<PropsWithChildren> = ({ children }) => {
  const { query, replace } = useRouter()

  const redirect = query?.redirect as string | undefined

  useEffect(() => {
    if (redirect) {
      logIfDev(`will redirect to ${redirect}`)
      replace(redirect)
    }
  }, [redirect, replace])

  return <>{children}</>
}
