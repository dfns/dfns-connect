import { AvailableOrg } from '@dfns/datamodel/dist/Auth'
import { IncomingMessage } from 'http'
import * as https from 'https'
import { arrayBufferToBase64UrlString, base64url, base64UrlStringToBuffer } from 'utils/base64url'
import { LOCAL_STORAGE_APP_ID, LOCAL_STORAGE_TOKEN_KEY } from 'utils/misc'
import { uuid } from 'utils/uuid'

import { getWebauthNSettings } from '@/utils/hooks/useWebauthnSettings'

import { CredentialKind } from './types'

export enum RiskKind {
  NoAuth,
  AuthRequired,
  UserActionSignatureRequired,
}

export enum ApiKind {
  Customer,
  Staff,
}

export type HttpBody = Record<string, unknown>

interface HttpClient {
  get<ResponseType>(url: string, body: HttpBody, risk?: RiskKind, apiKind?: ApiKind): Promise<ResponseType>

  post<ResponseType>(url: string, body: HttpBody, risk?: RiskKind, apiKind?: ApiKind): Promise<ResponseType>

  put<ResponseType>(url: string, body: HttpBody, risk?: RiskKind, apiKind?: ApiKind): Promise<ResponseType>

  delete<ResponseType>(url: string, body: HttpBody, risk?: RiskKind, apiKind?: ApiKind): Promise<ResponseType>
}

const getEnvVariable = (name: string, defaultValue?: string): string => {
  const value = process.env[name]

  if (typeof value === 'string' && value.length > 2) {
    return value
  } else {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`getEnvVariable: Unable to find environment variable ${name}`)
  }
}

export enum CredentialFactor {
  first = 'first',
  second = 'second',
  either = 'either',
}

export type AllowCredential = {
  type: PubKeyCredType.PublicKey
  id: string
  transports?: CredentialTransports
}

export type CreateUserLoginChallengeResponse = {
  supportedCredentialKinds: {
    kind: CredentialKind
    factor: CredentialFactor
    requiresSecondFactor: boolean
  }[]
  challenge: string
  challengeIdentifier: string
  externalAuthenticationUrl: string
  allowCredentials: {
    webauthn: AllowCredential[]
    key: AllowCredential[]
  }
  userVerification: UserVerificationRequirement
}

export type UserCredentialOptions = {
  supportedCredentialKinds: {
    kind: CredentialKind
    factor: CredentialFactor
    requiresSecondFactor: boolean
  }[]
  humanReadableChallenge: string
  externalAuthenticationUrl: string
  credentialData: {
    webAuthnClientData: WebAuthnChallenge
    keyOrPasswordClientData: KeyClientData
    allowedKeys: string[]
  }
}

export type CreateUserCredentialOptions = {
  supportedCredentialKinds: {
    firstFactor: CredentialKind[]
    secondFactor: CredentialKind[]
  }
  credentialData: {
    webAuthnClientData: WebAuthnChallenge
    keyOrPasswordClientData: KeyClientData
  }
}

export type ChallengeInfo = {
  challenge: string
  challengeIdentifier: string
  authenticationCode?: string
}

export type AuthenticationOptionsPassword = ChallengeInfo & {
  kind: CredentialKind.Password
}

export type AuthenticationOptionsKeyBase = ChallengeInfo & {
  allowCredentials: {
    type: PubKeyCredType
    id: string
    transports: string[]
  }[]
}

export type AuthenticationOptionsFido2 = AuthenticationOptionsKeyBase & {
  kind: CredentialKind.Fido2
}

export type AuthenticationOptionsKey = AuthenticationOptionsKeyBase & {
  kind: CredentialKind.Key
}

export enum PubKeyCredType {
  PublicKey = 'public-key',
}

type SignMessage = (message: Buffer, humanReadableMessage: string, keyId: string) => Promise<Buffer>

export type ConfirmUserActionInput =
  | AuthenticateUserPasswordInput
  | AuthenticateUserFido2Input
  | AuthenticateUserKeyInput

export declare type AuthenticateUserInput =
  | AuthenticateUserPasswordInput
  | AuthenticateUserFido2Input
  | AuthenticateUserKeyInput

export type AuthenticateUserPasswordInput = {
  kind: CredentialKind.Password
  password: string
}

export type AuthenticateUserFido2Input = {
  kind: CredentialKind.Fido2
  credentialAssertion: {
    credId: string
    clientData: string
    authenticatorData: string
    signature: string
    userHandle?: string
  }
}

export type AuthenticateUserKeyInput = {
  kind: CredentialKind.Key
  credentialAssertion: {
    credId: string
    clientData: string
    signature: string
  }
}

export type AuthenticateUserInitInput = {
  username: string
  orgId: string
}

export type AuthenticationResponse = {
  token: string
}

export type CredentialSignature = {
  authenticatorData: ArrayBuffer
  clientDataJson: ArrayBuffer
  signature: ArrayBuffer
  userHandle?: ArrayBuffer
}

export type UserCredentials = {
  firstFactor: {
    kind: CredentialKind.Fido2 | CredentialKind.Key | CredentialKind.Password
    credentialId: string
    signature: CredentialSignature
  }
  secondFactor?:
    | {
        kind: CredentialKind.Totp
        credentialId: string
        otpCode: string
      }
    | {
        kind: CredentialKind.Fido2 | CredentialKind.Key
        credentialId: string
        signature: CredentialSignature
      }
}

export type NewCredentialSignature = {
  clientData: ArrayBuffer
  attestationData: ArrayBuffer
}

export type NewUserCredentials = {
  firstFactor?: {
    kind: CredentialKind.Fido2 | CredentialKind.Key | CredentialKind.Password
    credentialId: string
    signature: NewCredentialSignature
  }
  secondFactor?:
    | {
        kind: CredentialKind.Totp
        credentialId: string
        otpCode: string
      }
    | {
        kind: CredentialKind.Fido2 | CredentialKind.Key
        credentialId: string
        signature: NewCredentialSignature
      }
  recoveryFactor?: {
    kind: CredentialKind.RecoveryKey
    credentialId: string
    signature: NewCredentialSignature
    encryptedPrivateKey?: string
  }
}

export type AuthenticateUserTotpInput = {
  kind: CredentialKind.Totp
  otpCode: string
}

export type AuthenticateUserFirstFactorInput =
  | AuthenticateUserPasswordInput
  | AuthenticateUserFido2Input
  | AuthenticateUserKeyInput

export type AuthenticateUserSecondFactorInput =
  | AuthenticateUserTotpInput
  | AuthenticateUserFido2Input
  | AuthenticateUserKeyInput

export type CreateUserLoginInput = {
  challengeIdentifier: string
  firstFactor: AuthenticateUserFirstFactorInput
  secondFactor?: AuthenticateUserSecondFactorInput
}

export type RecoverUserInput = {
  kind: CredentialKind.RecoveryKey
  credentialAssertion: {
    credId: string
    clientData: string
    signature: string
  }
}

export type GetUserCredentials = (supportedCredentials: UserCredentialOptions) => Promise<UserCredentials>
export type GenerateRecoveryClientData = (credentials: NewUserCredentials) => {
  type: 'key.get'
  challenge: string
  origin: string
  crossOrigin: boolean
}

export type CreateUserCredentials = (
  supportedCredentials: CreateUserCredentialOptions,
  username: string,
  recoveryKey?: {
    code: string
    credId: string
    encryptedKey: string
  },
  getRecoveryClientData?: GenerateRecoveryClientData
) => Promise<{
  credentials: NewUserCredentials
  recoveryKey: string
  signature?: string
}>

const noSignFnProvided = (message: Buffer) => {
  throw `Signature Function is not set. Unable to sign ${message.toString('ascii')}`
}

const noGetUserCredentialsFnProvided = () => {
  throw 'Get User Credentials Function is not set.'
}

const noCreateUserCredentialsFnProvided = () => {
  throw 'Create User Credentials Function is not set.'
}

export enum WebAuthnChallengeKind {
  Create = 'create',
  Get = 'get',
}

export type WebAuthnCreateCredentialChallenge = {
  kind: WebAuthnChallengeKind.Create
  creationOptions: CredentialCreationOptions
}

export type WebAuthnGetCredentialChallenge = {
  kind: WebAuthnChallengeKind.Get
  requestOptions: CredentialRequestOptions
}

export type WebAuthnChallenge = WebAuthnGetCredentialChallenge | WebAuthnCreateCredentialChallenge

export type KeyClientData = {
  type: 'key.get' | 'key.create'
  challenge: string
  origin: string
  crossOrigin?: boolean
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type UserActionSignatureInput = {
  userActionHttpMethod: string
  userActionHttpPath: string
  userActionPayload: string
  userActionServerKind?: string
}

export type UserActionResponse = {
  userAction: string
}

export type InitUserRegistrationInput = {
  username: string
  registrationCode: string
  orgId: string
}

export type CredentialTransports = 'usb' | 'nfc' | 'ble' | 'internal'

export type InitUserRecoveryInput = {
  username: string
  verificationCode: string
  credentialId: string
  orgId: string
}

export type UserRecoveryChallenge = CreateUserRegistrationChallengeResponse & {
  allowedRecoveryCredentials: {
    id: string
    encryptedRecoveryKey: string
  }[]
}

export type CreateUserRegistrationChallengeResponse = {
  rp: {
    id: string
    name: string
  }
  user: {
    id: string
    displayName: string
    name: string
  }
  temporaryAuthenticationToken: string
  challenge: string
  pubKeyCredParams: { type: 'public-key'; alg: number }[]
  excludeCredentials: { type: 'public-key'; id: string; transports: CredentialTransports[] }[]
  authenticatorSelection: {
    authenticatorAttachment?: 'platform' | 'cross-platform'
    residentKey: 'discouraged' | 'preferred' | 'required'
    requireResidentKey: boolean
    userVerification: 'required' | 'preferred' | 'discouraged'
  }
  attestation: Attestation
  otpUrl: string
  supportedCredentialKinds: {
    firstFactor: CredentialKind[]
    secondFactor: CredentialKind[]
  }
}

export type UserRegistrationBase = {
  rp: {
    id: string
    name: string
  }
  user: {
    id: string
    displayName: string
    name: string
  }
  temporaryAuthenticationToken: string
}

export type PublicKeyOptions = UserRegistrationBase & {
  kind: CredentialKind.Key
  challenge: string
  pubKeyCredParams: { type: PubKeyCredType; alg: number }[]
  attestation: Attestation
}

export type CreateUserResult = PublicKeyOptions | Error

export enum Attestation {
  None = 'none',
  Indirect = 'indirect',
  Direct = 'direct',
  Enterprise = 'enterprise',
}

export type Fido2Options = UserRegistrationBase & {
  kind: CredentialKind.Fido2
  challenge: string
  pubKeyCredParams: { type: 'public-key'; alg: number }[]
  excludeCredentials: { type: 'public-key'; id: string; transports: CredentialTransports[] }[]
  authenticatorSelection: {
    authenticatorAttachment?: 'platform' | 'cross-platform'
    residentKey: 'discouraged' | 'preferred' | 'required'
    requireResidentKey: boolean
    userVerification: 'required' | 'preferred' | 'discouraged'
  }
  attestation: 'none' | 'indirect' | 'direct' | 'enterprise'
}

export type PasswordRegistration = UserRegistrationBase & {
  kind: CredentialKind.Password
  otpUrl: string
}

export type CredentialAsssertion = {
  credId: string
  clientData: string
  attestationData: string
}

export type RegistrationConfirmationFido2 = {
  credentialKind: CredentialKind.Fido2
  credentialInfo: CredentialAsssertion
}

export type RegistrationConfirmationPublicKey = {
  credentialKind: CredentialKind.Key
  credentialInfo: CredentialAsssertion
}

export type RegistrationConfirmationPassword = {
  credentialKind: CredentialKind.Password
  credentialInfo: {
    password: string
  }
}

export type RegistrationConfirmationTotp = {
  credentialKind: CredentialKind.Totp
  credentialInfo: {
    otpCode: string
  }
}

export type RegistrationConfirmationRecoveryKey = {
  credentialKind: CredentialKind.RecoveryKey
  credentialInfo: CredentialAsssertion
  encryptedPrivateKey?: string
}

export type RegistrationFirstFactor =
  | RegistrationConfirmationPassword
  | RegistrationConfirmationPublicKey
  | RegistrationConfirmationFido2

export type RegistrationSecondFactor =
  | RegistrationConfirmationPublicKey
  | RegistrationConfirmationFido2
  | RegistrationConfirmationTotp

export type RegistrationRecoveryFactor = RegistrationConfirmationRecoveryKey

export type ConfirmRegistrationInput = {
  firstFactorCredential: RegistrationFirstFactor
  secondFactorCredential?: RegistrationSecondFactor
  recoveryCredential?: RegistrationRecoveryFactor
}

export type CreateUserRecoveryInput = {
  recovery: RecoverUserInput
  newCredentials: ConfirmRegistrationInput
}

export type UserCreationInfo = {
  credential: {
    uuid: string
    kind: CredentialKind
    name: string
  }
  user: {
    id: string
    username: string
    orgId: string
  }
}

const signWebAuthnChallenge = async (challenge: WebAuthnChallenge): Promise<PublicKeyCredential> => {
  let response: Credential | null = null
  if (challenge.kind === WebAuthnChallengeKind.Create) {
    response = await navigator.credentials.create(challenge.creationOptions)
  } else {
    response = await navigator.credentials.get(challenge.requestOptions)
  }
  if (response === null) {
    throw 'Failed to get sign WebAuthn challenge.'
  }
  return response as PublicKeyCredential
}

export const getWebAuthnCredential = async (challenge: WebAuthnChallenge): Promise<UserCredentials> => {
  const credential = await signWebAuthnChallenge(challenge)
  const signedChallenge = credential.response as AuthenticatorAssertionResponse
  return {
    firstFactor: {
      kind: CredentialKind.Fido2,
      credentialId: credential.id,
      signature: {
        authenticatorData: signedChallenge.authenticatorData,
        clientDataJson: signedChallenge.clientDataJSON,
        signature: signedChallenge.signature,
        userHandle: signedChallenge.userHandle || new Uint8Array(Buffer.from('')),
      },
    },
  }
}

export const createWebAuthnCredential = async (challenge: WebAuthnChallenge): Promise<NewUserCredentials> => {
  const credential = await signWebAuthnChallenge(challenge)
  const signedChallenge = credential.response as AuthenticatorAttestationResponse
  return {
    firstFactor: {
      kind: CredentialKind.Fido2,
      credentialId: credential.id,
      signature: {
        attestationData: signedChallenge.attestationObject,
        clientData: signedChallenge.clientDataJSON,
      },
    },
  }
}

class HttpClientBase {
  isAuthV2 = true
  baseUrl = ''
  appSecret = ''
  appId = ''
  appOrigin = ''
  appRelyingPartyId = ''
  authToken = ''
  signChallengeWithKeyFn: SignMessage = noSignFnProvided
  apiSignatureFn: SignMessage
  getUserCredentials: GetUserCredentials = noGetUserCredentialsFnProvided
  createUserCredentials: CreateUserCredentials = noCreateUserCredentialsFnProvided

  constructor(
    appId: string,
    baseUrl: string,
    appOrigin: string,
    appRelyingPartyId: string,
    getUserCredentials: GetUserCredentials,
    createUserCredentials: CreateUserCredentials,
    appSecret = '',
    apiSignatureFn: SignMessage = noSignFnProvided
  ) {
    this.baseUrl = baseUrl || getEnvVariable('DFNS_BASE_URL')
    this.appSecret = appSecret || getEnvVariable('DFNS_APP_SECRET', '')
    this.appId = appId || getEnvVariable('DFNS_APP_ID')
    this.appOrigin = appOrigin || getEnvVariable('DFNS_APP_ORIGIN', '')
    this.appRelyingPartyId = appRelyingPartyId || getEnvVariable('DFNS_APP_RPID')
    this.apiSignatureFn = apiSignatureFn
    this.getUserCredentials = getUserCredentials
    this.createUserCredentials = createUserCredentials
  }

  async authAsServiceAccount(serviceAccount: string, signatureFn = noSignFnProvided) {
    this.authToken = serviceAccount
    this.signChallengeWithKeyFn = signatureFn

    // TODO: We should verify the token is valid by hitting an endpoint on the server

    return true
  }

  async authAsPesron(username: string, orgId: string): Promise<void> {
    await this.login(username, orgId)
  }

  async logoutUser(): Promise<void> {
    let token: string | null = this.authToken
    if (!this.authToken) {
      const authToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
      token = authToken
    }

    if (!token) {
      return
    }

    this.authToken = ''
    this.request<{ message: string }>(ApiKind.Customer, 'PUT', '/auth/logout', '', '', token).catch(() => {
      // do nothing
    })
  }

  async registerUser(username: string, orgId: string, registrationCode: string): Promise<{ recoveryKey?: string }> {
    return await this.register(username, orgId, registrationCode)
  }

  async recoverUser(
    username: string,
    verificationCode: string,
    recoveryCode: string,
    recoveryCredId: string,
    orgId: string
  ): Promise<{ recoveryKey?: string }> {
    return await this.recover(username, verificationCode, recoveryCode, recoveryCredId, orgId)
  }

  generateNonce(): string {
    return base64url(
      Buffer.from(
        JSON.stringify({
          date: new Date().toISOString(),
          uuid: uuid(),
        })
      )
    )
  }

  private async login(username: string, orgId: string): Promise<void> {
    const createLoginChallengeRequest: AuthenticateUserInitInput = {
      username: username,
      orgId: orgId,
    }

    const loginChallenge: CreateUserLoginChallengeResponse = await this.request<CreateUserLoginChallengeResponse>(
      ApiKind.Customer,
      'POST',
      '/auth/login/init',
      JSON.stringify(createLoginChallengeRequest)
    )

    const loginCredentials: CreateUserLoginInput = await this.sign(loginChallenge)

    const loginResponse: AuthenticationResponse = await this.request<AuthenticationResponse>(
      ApiKind.Customer,
      'POST',
      '/auth/login',
      JSON.stringify(loginCredentials)
    )

    if (localStorage) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, loginResponse.token)
    }

    this.authToken = loginResponse.token
  }

  private async recover(
    username: string,
    verificationCode: string,
    recoveryCode: string,
    recoveryCredId: string,
    orgId: string
  ): Promise<{ recoveryKey?: string }> {
    const createUserRecoveryChallenge: InitUserRecoveryInput = {
      username: username,
      verificationCode: verificationCode,
      credentialId: recoveryCredId,
      orgId,
    }

    const recoveryChallenge: UserRecoveryChallenge = await this.request<UserRecoveryChallenge>(
      ApiKind.Customer,
      'POST',
      '/auth/recover/user/init',
      JSON.stringify(createUserRecoveryChallenge)
    )

    const { input, recoveryKey } = await this.createCredential(recoveryChallenge, recoveryCode, recoveryCredId)

    await this.request<UserCreationInfo>(ApiKind.Customer, 'POST', '/auth/recover/user', JSON.stringify(input))

    this.authToken = ''
    return {
      recoveryKey: recoveryKey,
    }
  }

  private async register(username: string, orgId: string, registrationCode: string): Promise<{ recoveryKey?: string }> {
    const createRegisterUserChallenge: InitUserRegistrationInput = {
      username: username,
      orgId: orgId,
      registrationCode: registrationCode,
    }

    const registerChallenge: CreateUserRegistrationChallengeResponse =
      await this.request<CreateUserRegistrationChallengeResponse>(
        ApiKind.Customer,
        'POST',
        '/auth/registration/init',
        JSON.stringify(createRegisterUserChallenge)
      )

    const {
      input: { newCredentials },
      recoveryKey,
    } = await this.createCredential({
      ...registerChallenge,
      allowedRecoveryCredentials: [],
    })

    await this.request<UserCreationInfo>(ApiKind.Customer, 'POST', '/auth/registration', JSON.stringify(newCredentials))

    this.authToken = ''
    return {
      recoveryKey: recoveryKey,
    }
  }

  private async computeUserActionSignature(
    apiKind: ApiKind,
    method: string,
    resource: string,
    body: string
  ): Promise<string> {
    const createUserActionChallenge: UserActionSignatureInput = {
      userActionHttpMethod: method,
      userActionHttpPath: resource,
      userActionPayload: body || '',
      userActionServerKind: apiKind === ApiKind.Staff ? 'Staff' : 'Api',
    }

    const userActionChallenge: CreateUserLoginChallengeResponse = await this.request<CreateUserLoginChallengeResponse>(
      ApiKind.Customer,
      'POST',
      '/auth/action/init',
      JSON.stringify(createUserActionChallenge)
    )

    const signingCredentials: CreateUserLoginInput = await this.sign(userActionChallenge)

    const userActionResponse: UserActionResponse = await this.request<UserActionResponse>(
      ApiKind.Customer,
      'POST',
      '/auth/action',
      JSON.stringify(signingCredentials)
    )

    return userActionResponse.userAction
  }

  /*
    Flow:
      1. Get Credentials (create challenge) from server
      2. Favor WebAuthn creds:
        2a. If WebAuthn is a supported type, use it
          2a1. If the user cancels/fails the WebAuthn prompt, display the login options page (password first, then links to use other options)
        2b. If not, display the login options page (password first, then links to use other options)

    SDK has a login widget:
      * When requesting login / signing widget is displayed:
        * The widget uses the SDK to pull the challenge/credential list
        * The widget displays the login choices to the user, with passwordless being the preferred option (or the last used method)
        * The widget has a display for password, SAML, SSO, key type logins, and uses the browser for WebAuthn based login

    * So... The SDK should allow the UI to handle the credential choice and gathering.
    * The SDK gets the credential list from the server, and then sends that list to the UI Widget / App
    * The UI Widget (eventually) / App should handle the prompts and credential gathering, and send the credentials to the UI to parse
    * The UI Widget / App should take the raw credential response, parse it, and verify the credentials with the server
    *   What about SSO / SAML?
    *     The UI would get a link, the user would click the link, the user would be redirected to the SSO login page, login, and be sent back to the UI
    *       The UI would receive the callback, and send the response to the SDK to parse/validate
  */
  private async sign(challenge: CreateUserLoginChallengeResponse): Promise<CreateUserLoginInput> {
    const settings = getWebauthNSettings()

    const userCredentialOptions: UserCredentialOptions = {
      supportedCredentialKinds: challenge.supportedCredentialKinds,
      externalAuthenticationUrl: challenge.externalAuthenticationUrl,
      humanReadableChallenge: challenge.challenge, // TODO: Get human readable challenge
      credentialData: {
        webAuthnClientData: {
          kind: WebAuthnChallengeKind.Get,
          requestOptions: {
            // mediation: 'required', // setting mediation blocks bitwarden
            publicKey: {
              challenge: Buffer.from(challenge.challenge),
              allowCredentials: challenge.allowCredentials.webauthn.map((cred) => ({
                id: base64UrlStringToBuffer(cred.id),
                type: 'public-key',
                transports: [],
              })),
              rpId: this.appRelyingPartyId,
              userVerification:
                settings.userVerification !== undefined ? settings.userVerification : challenge.userVerification,
              timeout: 60000,
            },
          },
        },
        keyOrPasswordClientData: {
          type: 'key.get',
          challenge: challenge.challenge,
          origin: this.appOrigin,
          crossOrigin: false,
        },
        allowedKeys: challenge.allowCredentials.key.map((cred) => cred.id),
      },
    }

    // TODO: Add a helper function to sign the challenge with a password
    //  This would grab the user's secret key, and encrypted private key from local storage,
    //    combine it with the supplied password, decrypt the private key, sign the challenge,
    //    and return it to the caller.
    //  If the private key is missing, it will be downloaded from the server.
    //  On error it would throw and error:
    //    Missing secret key: new Error("Device has not been setup.")
    //    Private key not found on server: new Error("No password configured for the user.")
    //    Failed to fetch private key: new Error("Internal server error.")
    //    Incorrect password: new Error("Provided password is not valid.")
    let credentials: UserCredentials
    if (this.signChallengeWithKeyFn !== noSignFnProvided) {
      const signature = await this.signChallengeWithKeyFn(
        Buffer.from(JSON.stringify(userCredentialOptions.credentialData.keyOrPasswordClientData)),
        userCredentialOptions.humanReadableChallenge,
        userCredentialOptions.credentialData.allowedKeys[0]
      )
      credentials = {
        firstFactor: {
          kind: CredentialKind.Key,
          credentialId: userCredentialOptions.credentialData.allowedKeys[0],
          signature: {
            authenticatorData: new Uint8Array(Buffer.from('')),
            signature: new Uint8Array(signature),
            clientDataJson: new Uint8Array(
              Buffer.from(JSON.stringify(userCredentialOptions.credentialData.keyOrPasswordClientData))
            ),
          },
        },
      }
    } else {
      credentials = await this.getUserCredentials(userCredentialOptions)
    }

    let firstFactor: AuthenticateUserFirstFactorInput
    if (credentials.firstFactor.kind === CredentialKind.Fido2) {
      firstFactor = {
        kind: CredentialKind.Fido2,
        credentialAssertion: {
          authenticatorData: arrayBufferToBase64UrlString(credentials.firstFactor.signature.authenticatorData),
          clientData: arrayBufferToBase64UrlString(credentials.firstFactor.signature.clientDataJson),
          credId: credentials.firstFactor.credentialId,
          signature: arrayBufferToBase64UrlString(credentials.firstFactor.signature.signature),
          userHandle: credentials.firstFactor.signature.userHandle?.byteLength
            ? arrayBufferToBase64UrlString(credentials.firstFactor.signature.userHandle)
            : undefined,
        },
      }
    } else if (credentials.firstFactor.kind === CredentialKind.Key) {
      firstFactor = {
        kind: CredentialKind.Key,
        credentialAssertion: {
          clientData: arrayBufferToBase64UrlString(credentials.firstFactor.signature.clientDataJson),
          credId: credentials.firstFactor.credentialId,
          signature: arrayBufferToBase64UrlString(credentials.firstFactor.signature.signature),
        },
      }
    } else {
      firstFactor = {
        kind: CredentialKind.Password,
        password: '', // TODO: Set the password... Or really set the signature based on the password
      }
    }

    let secondFactor: AuthenticateUserSecondFactorInput | undefined = undefined
    if (credentials.secondFactor) {
      if (credentials.secondFactor.kind === CredentialKind.Fido2) {
        secondFactor = {
          kind: CredentialKind.Fido2,
          credentialAssertion: {
            authenticatorData: arrayBufferToBase64UrlString(credentials.secondFactor.signature.authenticatorData),
            clientData: arrayBufferToBase64UrlString(credentials.secondFactor.signature.clientDataJson),
            credId: credentials.secondFactor.credentialId,
            signature: arrayBufferToBase64UrlString(credentials.secondFactor.signature.signature),
            userHandle: credentials.secondFactor.signature.userHandle?.byteLength
              ? arrayBufferToBase64UrlString(credentials.secondFactor.signature.userHandle)
              : undefined,
          },
        }
      } else if (credentials.secondFactor.kind === CredentialKind.Key) {
        secondFactor = {
          kind: CredentialKind.Key,
          credentialAssertion: {
            clientData: arrayBufferToBase64UrlString(credentials.secondFactor.signature.clientDataJson),
            credId: credentials.secondFactor.credentialId,
            signature: arrayBufferToBase64UrlString(credentials.secondFactor.signature.signature),
          },
        }
      } else if (credentials.secondFactor.kind === CredentialKind.Totp) {
        secondFactor = {
          kind: CredentialKind.Totp,
          otpCode: credentials.secondFactor.otpCode,
          // TODO: Add Cred Id
        }
      }
    }

    return {
      challengeIdentifier: challenge.challengeIdentifier,
      firstFactor: firstFactor,
      secondFactor: secondFactor,
    }
  }

  private convertNewUserCredentialsToConfirmRegistrationInput(
    credentials: NewUserCredentials
  ): ConfirmRegistrationInput {
    let firstFactor: RegistrationFirstFactor
    if (!credentials.firstFactor) {
      throw new Error('Missing first factor credential.')
    }
    if (credentials.firstFactor.kind === CredentialKind.Fido2) {
      firstFactor = {
        credentialKind: CredentialKind.Fido2,
        credentialInfo: {
          attestationData: arrayBufferToBase64UrlString(credentials.firstFactor.signature.attestationData),
          clientData: arrayBufferToBase64UrlString(credentials.firstFactor.signature.clientData),
          credId: credentials.firstFactor.credentialId,
        },
      }
    } else if (credentials.firstFactor.kind === CredentialKind.Key) {
      firstFactor = {
        credentialKind: CredentialKind.Key,
        credentialInfo: {
          attestationData: arrayBufferToBase64UrlString(credentials.firstFactor.signature.attestationData),
          clientData: arrayBufferToBase64UrlString(credentials.firstFactor.signature.clientData),
          credId: credentials.firstFactor.credentialId,
        },
      }
    } else {
      firstFactor = {
        credentialKind: CredentialKind.Password,
        credentialInfo: {
          password: '', // TODO: Set the password... Or really set the signature based on the password
        },
      }
    }

    let secondFactor: RegistrationSecondFactor | undefined = undefined
    if (credentials.secondFactor) {
      if (credentials.secondFactor.kind === CredentialKind.Fido2) {
        secondFactor = {
          credentialKind: CredentialKind.Fido2,
          credentialInfo: {
            attestationData: arrayBufferToBase64UrlString(credentials.secondFactor.signature.attestationData),
            clientData: arrayBufferToBase64UrlString(credentials.secondFactor.signature.clientData),
            credId: credentials.secondFactor.credentialId,
          },
        }
      } else if (credentials.secondFactor.kind === CredentialKind.Key) {
        secondFactor = {
          credentialKind: CredentialKind.Key,
          credentialInfo: {
            attestationData: arrayBufferToBase64UrlString(credentials.secondFactor.signature.attestationData),
            clientData: arrayBufferToBase64UrlString(credentials.secondFactor.signature.clientData),
            credId: credentials.secondFactor.credentialId,
          },
        }
      } else if (credentials.secondFactor.kind === CredentialKind.Totp) {
        secondFactor = {
          credentialKind: CredentialKind.Totp,
          credentialInfo: {
            otpCode: credentials.secondFactor.otpCode,
          },
          // TODO: Add Cred Id
        }
      }
    }

    let recoveryFactor: RegistrationRecoveryFactor | undefined = undefined
    if (credentials.recoveryFactor) {
      recoveryFactor = {
        credentialKind: CredentialKind.RecoveryKey,
        credentialInfo: {
          attestationData: arrayBufferToBase64UrlString(credentials.recoveryFactor.signature.attestationData),
          clientData: arrayBufferToBase64UrlString(credentials.recoveryFactor.signature.clientData),
          credId: credentials.recoveryFactor.credentialId,
        },
        encryptedPrivateKey: credentials.recoveryFactor.encryptedPrivateKey,
      }
    }

    return {
      firstFactorCredential: firstFactor,
      secondFactorCredential: secondFactor,
      recoveryCredential: recoveryFactor,
    }
  }

  private async createCredential(
    challenge: UserRecoveryChallenge,
    recoveryCode = '',
    recoveryCredId = ''
  ): Promise<{ input: CreateUserRecoveryInput; recoveryKey?: string }> {
    const userCredentialOptions: CreateUserCredentialOptions = {
      supportedCredentialKinds: challenge.supportedCredentialKinds,
      credentialData: {
        keyOrPasswordClientData: {
          type: 'key.create',
          challenge: challenge.challenge,
          origin: this.appOrigin,
          crossOrigin: false,
        },
        webAuthnClientData: {
          kind: WebAuthnChallengeKind.Create,
          creationOptions: {
            publicKey: {
              challenge: Buffer.from(challenge.challenge),
              pubKeyCredParams: challenge.pubKeyCredParams.map((cred) => ({
                alg: cred.alg,
                type: cred.type,
              })),
              rp: {
                name: challenge.rp.name,
                id: challenge.rp.id,
              },
              user: {
                displayName: challenge.user.displayName,
                id: Buffer.from(challenge.user.id),
                name: challenge.user.name,
              },
              attestation: 'direct',
              excludeCredentials: challenge.excludeCredentials.map((cred) => ({
                id: base64UrlStringToBuffer(cred.id),
                type: cred.type,
                transports: [],
              })),
              authenticatorSelection: challenge.authenticatorSelection,
              timeout: 60000,
            },
          },
        },
      },
    }

    const createRecoveryClientData: GenerateRecoveryClientData = (credentials: NewUserCredentials) => {
      return {
        type: 'key.get',
        challenge: base64url(JSON.stringify(this.convertNewUserCredentialsToConfirmRegistrationInput(credentials))),
        origin: this.appOrigin,
        crossOrigin: false,
      }
    }

    const encryptedRecoveryKey =
      challenge.allowedRecoveryCredentials.length === 1
        ? {
            encryptedKey: challenge.allowedRecoveryCredentials[0].encryptedRecoveryKey,
            code: recoveryCode,
            credId: recoveryCredId,
          }
        : undefined
    const { credentials, recoveryKey, signature } = await this.createUserCredentials(
      userCredentialOptions,
      challenge.user.name,
      encryptedRecoveryKey,
      createRecoveryClientData
    )

    const registrationCredentials = this.convertNewUserCredentialsToConfirmRegistrationInput(credentials)

    this.authToken = challenge.temporaryAuthenticationToken

    if (encryptedRecoveryKey && !signature) {
      throw new Error('Missing signature using existing recovery key.')
    }

    const recoveryAssertion: RecoverUserInput =
      encryptedRecoveryKey && signature
        ? {
            kind: CredentialKind.RecoveryKey,
            credentialAssertion: {
              clientData: base64url(JSON.stringify(createRecoveryClientData(credentials))),
              credId: encryptedRecoveryKey.credId,
              signature: signature,
            },
          }
        : {
            kind: CredentialKind.RecoveryKey,
            credentialAssertion: {
              clientData: '',
              credId: '',
              signature: '',
            },
          }

    return {
      input: {
        recovery: recoveryAssertion,
        newCredentials: registrationCredentials,
      },
      recoveryKey: recoveryKey,
    }
  }

  private async computeApiSignature(
    request: WithRequired<https.RequestOptions, 'headers'>,
    body: string
  ): Promise<string> {
    const requestPayload = {
      'h-accept': request.headers['Accept'] || '',
      'h-accept-encoding': request.headers['Accept-Encoding'] || '',
      'h-authorization': request.headers['Authorization'] || '',
      'h-connection': request.headers['Connection'] || '',
      'h-content-length': request.headers['Content-Length']?.toString() || '',
      'h-content-type': request.headers['Content-Type'] || '',
      'h-host': request.headers['Host'] || '',
      'h-user-agent': request.headers['User-Agent'] || '',
      'h-x-dfns-clientid': request.headers['X-DFNS-CLIENTID'] || '',
      'h-x-dfns-clientsecret': request.headers['X-DFNS-CLIENTSECRET'] || '',
      'h-x-dfns-nonce': request.headers['X-DFNS-NONCE'] || '',
      'h-x-dfns-useraction': request.headers['X-DFNS-USERACTION'] || '',
      'r-authority': request.hostname,
      'r-body': base64url(Buffer.from(body)),
      'r-method': request.method?.toLowerCase() || 'get',
      'r-path': request.path,
      'r-scheme': 'https',
    }

    const requestSigningHeader = {
      alg: 'RS256',
      typ: 'JWT',
    }

    const requestToSign = Buffer.from(
      base64url(Buffer.from(JSON.stringify(requestSigningHeader))) +
        '.' +
        base64url(Buffer.from(JSON.stringify(requestPayload)))
    )

    const signature = await this.apiSignatureFn(requestToSign, '', '')
    return base64url(signature)
  }

  private getAppId() {
    let appId
    try {
      const org = localStorage.getItem(LOCAL_STORAGE_APP_ID)
      if (org) {
        appId = (JSON.parse(org) as AvailableOrg).appId
      }
    } catch {
      appId = ''
    }

    return appId || this.appId
  }

  async request<ResponseType>(
    apiKind: ApiKind,
    method: string,
    resource: string,
    body: string,
    userActionSignature = '',
    authToken?: string
  ): Promise<ResponseType> {
    const appId = this.getAppId()
    const token = authToken || this.authToken

    const target = (apiKind === ApiKind.Staff ? 'staff-' : '') + this.baseUrl
    const options: WithRequired<https.RequestOptions, 'headers'> = {
      hostname: target,
      port: 443,
      path: resource,
      method: method,
      headers: {
        Accept: 'application/json',
        Authorization: token ? 'Bearer ' + token : '',
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'application/json',
        Host: target,
        'User-Agent': 'DFNS NodeJs SDK',
        'X-DFNS-APPID': appId,
        'X-DFNS-APPSECRET': this.appSecret,
        'X-DFNS-NONCE': this.generateNonce(),
        'X-DFNS-APISIGNATURE': '',
        'X-DFNS-USERACTION': userActionSignature,
      },
    }

    if (this.isAuthV2 && this.apiSignatureFn !== noSignFnProvided) {
      options.headers['X-DFNS-APISIGNATURE'] = await this.computeApiSignature(options, body)
    }

    return new Promise((resolve, reject) => {
      let result = ''

      const handleRequest = (response: IncomingMessage) => {
        const { statusCode } = response

        response.setEncoding('utf-8')
        response.on('data', (chunk) => {
          result += chunk
        })

        const isStatus2xx = statusCode && statusCode >= 200 && statusCode < 300

        response.on('end', () => {
          if (!isStatus2xx) {
            let errorMessage = response.statusMessage
            if (!errorMessage && result) {
              try {
                errorMessage = JSON.parse(result).error.message
              } catch {
                errorMessage = 'Unknown error'
              }
            }
            reject({
              statusCode: response.statusCode,
              message: errorMessage,
            })
          } else {
            try {
              if (result === '') {
                resolve({} as ResponseType)
              } else {
                resolve(JSON.parse(result) as ResponseType)
              }
            } catch (error) {
              reject(error)
            }
          }
        })
      }

      const request = https.request(options, handleRequest)

      request.on('error', (e) => {
        reject(e)
      })

      if (body !== '') {
        request.write(body)
      }

      request.end()
    })
  }

  async apiRequest<ResponseType>(
    risk: RiskKind,
    apiKind: ApiKind,
    method: string,
    resource: string,
    body: string
  ): Promise<ResponseType> {
    let userActionSignature = ''
    if (risk !== RiskKind.NoAuth) {
      if (!this.authToken) {
        const authToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
        if (!authToken) {
          throw 'No authentication token set. Please, call authAsServiceAccount or authAsPesron before calling other functions.'
        }
        this.authToken = authToken
      }

      if (this.isAuthV2 && risk === RiskKind.UserActionSignatureRequired) {
        userActionSignature = await this.computeUserActionSignature(apiKind, method, resource, body)
      }
    }

    return await this.request<ResponseType>(apiKind, method, resource, body, userActionSignature)
  }
}

const toJson = (obj?: HttpBody): string => {
  return obj ? JSON.stringify(obj) : ''
}

class ServerSideHttpClient extends HttpClientBase implements HttpClient {
  async get<ResponseType>(
    resource: string,
    body?: HttpBody,
    _risk = undefined,
    apiKind = ApiKind.Customer
  ): Promise<ResponseType> {
    return this.request<ResponseType>(apiKind, 'GET', resource, toJson(body))
  }

  async post<ResponseType>(
    resource: string,
    body?: HttpBody,
    _risk = undefined,
    apiKind = ApiKind.Customer
  ): Promise<ResponseType> {
    return this.request<ResponseType>(apiKind, 'POST', resource, toJson(body))
  }

  async put<ResponseType>(
    resource: string,
    body?: HttpBody,
    _risk = undefined,
    apiKind = ApiKind.Customer
  ): Promise<ResponseType> {
    return this.request<ResponseType>(apiKind, 'PUT', resource, toJson(body))
  }

  async delete<ResponseType>(
    resource: string,
    body?: HttpBody,
    _risk = undefined,
    apiKind = ApiKind.Customer
  ): Promise<ResponseType> {
    return this.request<ResponseType>(apiKind, 'DELETE', resource, toJson(body))
  }
}

class ClientSideHttpClient extends HttpClientBase implements HttpClient {
  async get<ResponseType>(
    resource: string,
    body?: HttpBody,
    risk = RiskKind.AuthRequired,
    apiKind = ApiKind.Customer
  ): Promise<ResponseType> {
    return this.apiRequest<ResponseType>(risk, apiKind, 'GET', resource, toJson(body))
  }

  async post<ResponseType>(
    resource: string,
    body?: HttpBody,
    risk = RiskKind.AuthRequired,
    apiKind = ApiKind.Customer
  ): Promise<ResponseType> {
    return this.apiRequest<ResponseType>(risk, apiKind, 'POST', resource, toJson(body))
  }

  async put<ResponseType>(
    resource: string,
    body?: HttpBody,
    risk = RiskKind.AuthRequired,
    apiKind = ApiKind.Customer
  ): Promise<ResponseType> {
    return this.apiRequest<ResponseType>(risk, apiKind, 'PUT', resource, toJson(body))
  }

  async delete<ResponseType>(
    resource: string,
    body?: HttpBody,
    risk = RiskKind.AuthRequired,
    apiKind = ApiKind.Customer
  ): Promise<ResponseType> {
    return this.apiRequest<ResponseType>(risk, apiKind, 'DELETE', resource, toJson(body))
  }
}

export { ClientSideHttpClient, type HttpClient, ServerSideHttpClient }
