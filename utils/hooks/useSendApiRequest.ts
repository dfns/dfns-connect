import { useCallback, useState } from 'react'
import { sendApiRequest } from 'utils/api/sendApiRequest'

export const useSendApiRequest = () => {
  const [isLoading, setIsLoading] = useState(false)

  const sendApiRequestWrapped = useCallback<typeof sendApiRequest>(
    (...args) => {
      setIsLoading(true)
      const resp = sendApiRequest(...args).finally(() => setIsLoading(false))
      return resp
    },
    []
  )

  return { sendApiRequest: sendApiRequestWrapped, isLoading }
}
