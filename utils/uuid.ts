import crypto from 'crypto'

export const uuid = () : string => {
  const randomBytes = crypto.randomBytes(16).toString('hex')
  return randomBytes.substring(0, 8) + '-' +
  randomBytes.substring(8, 12) + '-' +
  randomBytes.substring(12, 16) + '-' +
  randomBytes.substring(16, 20) + '-' +
  randomBytes.substring(20, 32)
}
