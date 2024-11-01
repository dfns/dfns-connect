export const LOCAL_STORAGE_TOKEN_KEY = 'dfns_api_token'
export const LOCAL_STORAGE_LOGIN_REDIRECT = 'dfns_login_redirect'
export const LOCAL_STORAGE_APP_ID = 'dfns_app_id'
export const LOCAL_STORAGE_WEBAUTHN_SETTINGS = 'dfns_webauthn_settings'

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const logIfDev: typeof console.log = (...params) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...params)
  }
}
