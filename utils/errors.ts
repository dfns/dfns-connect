import _get from 'lodash/get'
import toast from 'react-hot-toast'

import { logIfDev } from './misc'

interface Options {
  showErrorToast?: boolean
  errorMessage?: string
}

const errorMessagePaths = [
  'response.data.error.message',
  'response.data.error',
  'response.data.message',
  'error.message',
  'error',
  'message',
]

export const getErrorMessage = (error: any): string | undefined => {
  if (!error) return
  for (const path of errorMessagePaths) {
    const message = _get(error, path)
    if (typeof message === 'string') {
      return message
    }
  }
}

export const errorHandler =
  ({ showErrorToast = true, errorMessage }: Options = { showErrorToast: true }) =>
  (error: any) => {
    logIfDev('error', error)

    if (!showErrorToast) return

    const errorToast = getErrorMessage(error) || errorMessage || 'We experienced an issue'

    toast.error(errorToast, { id: 'error_message' })
  }
