export const buildPathWithQueryParams = (path: string, params: any): string => {
  let finalPath = path
  const queryParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params || {})) {
    if (
      value !== null &&
      value !== undefined &&
      (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
    ) {
      queryParams.append(key, value.toString())
    }
  }

  const queryStr = queryParams.toString()

  if (queryStr) {
    finalPath = finalPath + '?' + queryStr
  }

  return finalPath
}
