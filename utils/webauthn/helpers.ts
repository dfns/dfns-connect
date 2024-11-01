import { Fido2Attestation } from '@dfns/sdk'
import { fromBase64Url } from '@dfns/sdk/utils'
import { convertAAGUIDToString, decodeAttestationObject, parseAuthenticatorData } from '@simplewebauthn/server/helpers'
import { UAParser } from 'ua-parser-js'

import * as aaguids from '@/utils/webauthn/aaguid.json'

export const getCredentialName = (attestation: Fido2Attestation) => {
  let keyName

  try {
    const attData = fromBase64Url(attestation.credentialInfo.attestationData)
    const decodedAttestationObject = decodeAttestationObject(attData)
    const authData = decodedAttestationObject.get('authData')

    const parsedAuthData = parseAuthenticatorData(authData)

    let providerName
    if (parsedAuthData.aaguid) {
      const aaguid = convertAAGUIDToString(parsedAuthData.aaguid)
      const aaguidsParsed = JSON.parse(JSON.stringify(aaguids))
      providerName = aaguidsParsed[aaguid]?.name || 'Unknown'
    }

    const parser = new UAParser()
    const device = parser.getResult()
    if (providerName) {
      keyName = `${providerName}-${device.browser.name}`
    } else {
      keyName = device.browser.name
    }
  } catch (e) {
    console.error(e)
  }

  return keyName
}
