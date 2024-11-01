export type EnvVar = keyof typeof envVars

const envVars = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  // env vars starting with NEXT_PUBLIC_ will be made available to client
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
  NEXT_PUBLIC_APP_RPID: process.env.NEXT_PUBLIC_APP_RPID,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  NEXT_PUBLIC_SIGNUP_ENABLED: process.env.NEXT_PUBLIC_SIGNUP_ENABLED,
  NEXT_PUBLIC_EXCHANGES_COINBASE_APP_ENABLED: process.env.NEXT_PUBLIC_EXCHANGES_COINBASE_APP_ENABLED,
  NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
}

export const getBoolEnvVar = (name: EnvVar): boolean => envVars[name] === 'true'

export const getEnvVar = (name: EnvVar): string => {
  return envVars[name] || ''
}

export const getEnvVarOrThrow = (name: EnvVar): string => {
  const value = getEnvVar(name) || ''

  if (!value) {
    throw Error(`env var ${name} not defined`)
  }

  return value
}
