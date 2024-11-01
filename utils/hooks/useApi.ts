import useSWR, { SWRConfiguration } from 'swr'
import { errorHandler } from 'utils/errors'

import { ApiEndpoint, ApiRequestParams, ApiRequestResult } from '../api/constants'
import { sendApiRequest } from '../api/sendApiRequest'

interface Options<A extends ApiEndpoint = ApiEndpoint> {
  params?: Record<string, string | number | boolean>
  skip?: boolean
  showSuccessToast: boolean
  showErrorToast: boolean
  successMessage: string
  errorMessage?: string
  swr?: SWRConfiguration<ApiRequestResult<A>>
}

const defaultOptions: Options = {
  params: undefined,
  showSuccessToast: false,
  showErrorToast: true,
  successMessage: 'Success !',
  errorMessage: 'An error occured',
}

const getErrorCode = (error: any): number => {
  if (!error) {
    return 200
  }

  if (error.response && error.response.status) {
    return error.response.status
  }

  if (error.statusCode) {
    return error.statusCode
  }

  return 501
}

const fetcher = <A extends ApiEndpoint>({ endpoint, params }: { endpoint: A; params?: ApiRequestParams<A> }) =>
  sendApiRequest(endpoint, { params, skipErrorHandler: true })

export const useApiData = <A extends ApiEndpoint>(endpoint: A, options?: Partial<Options<A>>) => {
  const finalOptions = { ...(defaultOptions as Options<A>), ...options }
  const { params, skip } = finalOptions
  const swrKey = skip ? null : { endpoint, params }

  const results = useSWR<ApiRequestResult<A>>(swrKey, fetcher, {
    onError: errorHandler(finalOptions),
    shouldRetryOnError: false,
    ...options?.swr,
  })

  return {
    ...results,
    isLoading: !skip && !results.data && !results.error,
    isUnauthorized: getErrorCode(results.error) === 403,
    authenticationError: getErrorCode(results.error) === 401,
  }
}
