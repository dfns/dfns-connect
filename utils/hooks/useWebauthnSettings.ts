import { useCallback, useState } from 'react'
import { LOCAL_STORAGE_WEBAUTHN_SETTINGS } from 'utils/misc'

export const useWebauthnSettings = () => {
  const [settings, setStateSettings] = useState(() => getWebauthNSettings())

  const setWebautNSetting = useCallback(<K extends keyof WebauthNSettings>(key: K, value: WebauthNSettings[K]) => {
    const settings = getWebauthNSettings()
    settings[key] = value
    localStorage.setItem(LOCAL_STORAGE_WEBAUTHN_SETTINGS, JSON.stringify(settings))
    setStateSettings(settings)
  }, [])

  return {
    webauthNSettings: settings,
    setWebautNSetting,
  }
}

export const getWebauthNSettings = (): WebauthNSettings => {
  try {
    const settings = localStorage.getItem(LOCAL_STORAGE_WEBAUTHN_SETTINGS) || ''

    if (!settings) {
      return {}
    }

    const parsedSettings = JSON.parse(settings)
    return parsedSettings
  } catch (e) {
    return {}
  }
}

export type WebauthNSettings = {
  userVerification?: UserVerificationRequirement
}
