'use client'

import { DfnsApiClient } from '@dfns/sdk'
import { WebAuthnSigner } from '@dfns/sdk-browser'
import { DfnsDashboardApiClient } from '@dfns/sdk-dashboard'
import { DfnsStaffApiClient } from '@dfns/sdk-staff'

import { LOCAL_STORAGE_APP_ID, LOCAL_STORAGE_TOKEN_KEY } from '../misc'

export const useDfnsApiClient = () => {
  const authToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
  const orgApps = localStorage.getItem(LOCAL_STORAGE_APP_ID)
  const appId = orgApps ? JSON.parse(orgApps).appId : ''
  const dfnsApiClient = new DfnsApiClient({
    appId: appId,
    authToken: authToken || '',
    baseUrl: `https://${process.env.NEXT_PUBLIC_API_URL}`,
    signer: new WebAuthnSigner(),
  })
  return { dfnsApiClient }
}

export const useDfnsDashboardApiClient = () => {
  const authToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
  const orgApps = localStorage.getItem(LOCAL_STORAGE_APP_ID)
  const appId = orgApps ? JSON.parse(orgApps).appId : ''
  const dfnsDashboardApiClient = new DfnsDashboardApiClient({
    appId: appId,
    authToken: authToken || '',
    baseUrl: `https://${process.env.NEXT_PUBLIC_API_URL}`,
    signer: new WebAuthnSigner(),
  })
  return { dfnsDashboardApiClient }
}

export const useDfnsStaffApiClient = () => {
  const authToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
  const orgApps = localStorage.getItem(LOCAL_STORAGE_APP_ID)
  const appId = orgApps ? JSON.parse(orgApps).appId : ''

  const dfnsStaffApiClient = new DfnsStaffApiClient({
    appId: appId,
    authToken: authToken || '',
    baseUrl: `https://staff-${process.env.NEXT_PUBLIC_API_URL}`,
    signer: new WebAuthnSigner(),
    baseAuthUrl: `https://${process.env.NEXT_PUBLIC_API_URL}`,
    userActionServerKind: 'Staff',
  })

  return { dfnsStaffApiClient }
}
