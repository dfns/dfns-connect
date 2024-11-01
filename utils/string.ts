export const isValidHttpUrl = (val: string) => {
  let url

  try {
    url = new URL(val)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
