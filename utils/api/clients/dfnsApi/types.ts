import { ApiKeyStatus as ServiceAccountStatus, ApiKeyValue as ServiceAccountValue } from '@dfns/datamodel/dist/ApiKeys'
import {
  ApplicationKind,
  PermissionAssignmentInfo,
  RegistrationConfirmationRecoveryKey,
} from '@dfns/datamodel/dist/Auth'
import { IsoDatetime } from '@dfns/datamodel/dist/Foundations'
import { OrgStatus } from '@dfns/datamodel/dist/Orgs'
import { GetPolicyResponse, ListApprovalsResponse } from '@dfns/sdk/generated/policies'

export enum ChangeRequestStatus {
  Applied = 'Applied',
  Failed = 'Failed',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export type ChangeRequest = {
  id: string
  orgId: string
  requester: {
    userId: string
    tokenId: string
    appId: string
  }
  kind: string
  operationKind: string
  status: ChangeRequestStatus
  entityId: string
  body: Record<string, unknown>
  dateCreated: Date
  dateResolved: Date
}

export type ListApiResponse<A> = {
  items: A[]
  nextPageToken?: string
}

export type GetApiResponse<A> = A

export type PostApiResponse<A> = A

export type PutApiResponse<A> = A

export type DeleteApiResponse<A> = A

export type LoginUserResponse = void

export type CreateUserResponse = UserInfo

export type CreateUserAndOrgResponse = { id: string }

export type RegisterUserResponse = { recoveryKey?: string }

export type LogoutUserResponse = void

export type LoginUserInput = {
  username: string
  orgId: string
}

export type SendRecoveryEmailInput = {
  username: string
  orgId: string
}

export type RecoverUserInput = {
  username: string
  verificationCode: string
  recoveryCode: string
  recoveryCredId: string
  orgId: string
}

export type ResendEmailInput = {
  username: string
  orgId: string
}

export type ActivateCredentialInput = {
  credentialUuid: string
}

export type CreateUserCredentialChallengeInput = {
  kind: CredentialKind
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

export type CreateUserCredentialInputBase =
  | RegistrationConfirmationTotp
  | RegistrationConfirmationPassword
  | RegistrationConfirmationPublicKey
  | RegistrationConfirmationFido2
  | RegistrationConfirmationRecoveryKey

export type CreateUserCredentialInput = CreateUserCredentialInputBase & {
  challengeIdentifier: string
  credentialName: string
}

export type RegisterUserInput = {
  username: string
  orgId: string
  registrationCode: string
}

export type CreateUserAndOrgInput = {
  adminUser: {
    email: string
  }
  termsAndConditionsAccepted: boolean
  privacyPolicyAccepted: boolean
  recaptchaResponse: string
}

export enum CredentialKind {
  Fido2 = 'Fido2',
  Key = 'Key',
  Password = 'Password',
  Totp = 'Totp',
  RecoveryKey = 'RecoveryKey',
}

export type CreateUserInput = {
  email: string
  kind: UserKind.Employee | UserKind.Staff | UserKind.User
  publicKey: string
  externalId?: string
}

export enum AccessTokenKind {
  ServiceAccount = 'ServiceAccount',
  Pat = 'Pat',
}

export type AccessTokenInfoWithPublicKey = {
  tokenId: string
  kind: AccessTokenKind
  orgId: string
  name: string
  linkedUserId: string
  linkedAppId: string
  publicKey: string
  dateCreated: IsoDatetime
  isActive: boolean
  accessToken?: string
  credId: string
  permissionAssignments: PermissionAssignmentInfo[]
}

export type ServiceAccountRecordWithPublicKey = {
  id: string
  status: ServiceAccountStatus
  externalId?: string
  orgId: string
  dateCreated: IsoDatetime
  name?: string
  authorId: string
  scopes: string[]
  permissions: string[]
  publicKey: string
  credId: string
  userId?: string
  token?: string
  isActive?: boolean
}

export type CredentialInfo = {
  credentialId: string
  credentialUuid: string
  dateCreated: IsoDatetime
  isActive: boolean
  kind: CredentialKind
  name: string
  publicKey?: string
  relyingPartyId: string
  origin: string
}

export type CreateAppInput = {
  name: string
  kind: ApplicationKind
  expectedRpId: string
  expectedOrigin: string
  publicKey: string
  permissionId: string
  externalId?: string
}

export type ActivateApplicationInput = {
  appId: string
}

export type ActivateUserInput = {
  userId: string
}

export type CreateServiceAccountWithPublicKeyInput = {
  externalId?: string
  name: string
  publicKey: string
  permissionId: string
}

export enum UserKind {
  User = 'EndUser',
  Employee = 'CustomerEmployee',
  Staff = 'DfnsStaff',
  Pat = 'Pat',
  App = 'Application',
  ServiceAccount = 'ServiceAccount',
}

export type CreateAccessTokenInput = {
  name: string
  publicKey: string
  permissionId?: string
  daysValid?: number
  externalId?: string
}

export type CreateApplicationInputBase = {
  name: string
  relyingPartyId: string
  origin: string
  permissionId?: string
  externalId?: string
}

export type CreateClientSideAppInput = CreateApplicationInputBase & {
  kind: ApplicationKind.ClientSideApplication
}

export type CreateServerSideAppInput = CreateApplicationInputBase & {
  kind: ApplicationKind.ServerSideApplication
  publicKey: string
  daysValid?: number
}

export type CreateApplicationInput = CreateServerSideAppInput | CreateClientSideAppInput

export type CreateApplicationResult = {
  appId: string
  apiToken?: string
}

export type UserInfo = {
  userId: string
  username: string
  kind: UserAuthKind
  credentialUuid: string
  orgId: string
  permissions: string[]
  scopes?: string[]
  isActive: boolean
  isServiceAccount: boolean
  isRegistered: boolean
  adminPermissionId?: string
  permissionAssignments?: PermissionAssignmentInfo[]
  recaptchaResponse?: string
}

export enum UserAuthKind {
  EndUser = 'EndUser',
  Employee = 'CustomerEmployee',
  Staff = 'DfnsStaff',
}

export type AppInfo = {
  appId: string
  kind: ApplicationKind
  credentialUuid: string
  orgId: string
  tokenHash?: string
  permissions: string[]
  scopes: string[]
  expectedRpId: string
  expectedOrigin: string
  name?: string
  isActive?: boolean
  publicKey: string
  credId: string
}

export type AppInfoWithPublicKey = {
  appId: string
  kind: ApplicationKind
  orgId: string
  expectedRpId: string
  name: string
  isActive: boolean
  expectedOrigin: string
  permissionAssignments: PermissionAssignmentInfo[]
  accessTokens: AccessTokenInfoWithPublicKey[]
}

export type ApplicationWithToken = {
  appId: string
  kind: ApplicationKind
  orgId: string
  permissions: string[]
  scopes: string[]
  expectedRpId: string
  expectedOrigin: string
  name: string
  isActive: boolean
  token: ServiceAccountValue
  publicKey: string
}

export type UserAccessTokenInformation = {
  userInfo: UserInfo
  accessTokens: AccessTokenInfoWithPublicKey[]
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

export enum PubKeyCredType {
  PublicKey = 'public-key',
}

export type PublicKeyOptions = UserRegistrationBase & {
  kind: CredentialKind.Key | CredentialKind.RecoveryKey
  challenge: string
  pubKeyCredParams: { type: PubKeyCredType; alg: number }[]
  attestation: Attestation
}

export enum Attestation {
  None = 'none',
  Indirect = 'indirect',
  Direct = 'direct',
  Enterprise = 'enterprise',
}

export type CredentialTransports = 'usb' | 'nfc' | 'ble' | 'internal'

export type Fido2Options = UserRegistrationBase & {
  kind: CredentialKind.Fido2
  challenge: string
  pubKeyCredParams: { type: 'public-key'; alg: number }[]
  excludeCredentials: {
    type: 'public-key'
    id: string
    transports: CredentialTransports[]
  }[]
  authenticatorSelection: {
    authenticatorAttachment?: 'platform' | 'cross-platform'
    residentKey: 'discouraged' | 'preferred' | 'required'
    requireResidentKey: boolean
    userVerification: 'required' | 'preferred' | 'discouraged'
  }
  attestation: 'none' | 'indirect' | 'direct' | 'enterprise'
}

export type CreatePasswordCredentialResponse = UserRegistrationBase & {
  kind: CredentialKind.Password
}

export type CreateTotpCredentialResponse = UserRegistrationBase & {
  kind: CredentialKind.Totp
  otpUrl: string
}

export type CreateUserCredentialChallengeResponse =
  | Fido2Options
  | PublicKeyOptions
  | CreateTotpCredentialResponse
  | CreatePasswordCredentialResponse

export enum OrgTier {
  Trial = 'Trial',
  Starter = 'Starter',
  Basic = 'Basic',
  Pro = 'Pro',
  Enterprise = 'Enterprise',
}

export type Org = {
  id: string
  name: string
  country: string
  dateCreated: Date
  dateUpdated: Date
  dateOnboarded: Date
  status: OrgStatus
  tier: OrgTier
  idAnonymized: string
}

export enum ClusterStatus {
  Unknown = 'Unknown',
  Provisioning = 'Provisioning',
  Provisioned = 'Provisioned',
}

export type ClusterHealth = {
  id: string
  clusterId: string
  timestamp: number
  timeProvisionStarted?: number
  status: ClusterStatus
  signers: SignerHealth[]
}

export enum SignerStatus {
  Unreachable = 'Unreachable',
  Alive = 'Alive',
}

export type SignerHealth = SignersHealthUnreachable | SignersHealthAlive

export type SignersHealthUnreachable = {
  status: SignerStatus.Unreachable
  index: number
}

export type SignersHealthAlive = {
  status: SignerStatus.Alive
  index: number
  identityKey: string
  provisionChecksum: string
  pregeneratedPrimes: number
  encryptionPublicKey: string
}

export type SigningCluster = {
  id: string
  loadBalanced: boolean
  signersCount: number
  dateCreated: string
  orgs: string[]
  lastHealths: ClusterHealth[]
}

export type CreateClusterBody = {
  loadBalanced: boolean
}

export type UpdateClusterBody = {
  loadBalanced: boolean
}

export type Permission = {
  id: string
  name: string
  operations: string[]
  resourceId?: string
  status: 'Active'
  predicateIds?: string[]
  isImmutable: boolean
  dateCreated?: string
  dateUpdated?: string
  isArchived: boolean
  changeRequest?: ChangeRequest
}

export type PermissionAssignment = {
  id: string
  permissionId: string
  identityId: string
  isImmutable: boolean
  dateCreated: string
  dateUpdated: string
  changeRequest?: ChangeRequest
}

export enum ActivityKind {
  PermissionsAssign = 'Permissions:Assign',
  PermissionsModify = 'Permissions:Modify',
  PoliciesModify = 'Policies:Modify',
  WalletsSign = 'Wallets:Sign',
  WalletsIncomingTransaction = 'Wallets:IncomingTransaction',
}

export enum PolicyAction {
  RequestApproval = 'RequestApproval',
  Block = 'Block',
  NoAction = 'NoAction',
}

export enum ApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Denied = 'Denied',
  Expired = 'Expired',
}

export type PolicyEvaluationResult = {
  policyId: string
  triggered: boolean
  reason: string
}

export enum DecisionStatus {
  Approved = 'Approved',
  Denied = 'Denied',
}

export type PolicyApproval = ListApprovalsResponse['items'][number]

export enum PolicyRuleKind {
  AlwaysTrigger = 'AlwaysTrigger',
  TransactionAmountLimit = 'TransactionAmountLimit',
  TransactionAmountVelocity = 'TransactionAmountVelocity',
  TransactionCountVelocity = 'TransactionCountVelocity',
  TransactionRecipientWhitelist = 'TransactionRecipientWhitelist',
  ChainalysisTransactionPrescreening = 'ChainalysisTransactionPrescreening',
  ChainalysisTransactionScreening = 'ChainalysisTransactionScreening',
}

export enum FilterKey {
  userId = 'userId',
  walletId = 'walletId',
  policyId = 'policyId',
  permissionId = 'permissionId',
  walletTags = 'walletTags',
}

export type Policy = GetPolicyResponse

export type CreatePermissionInput = {
  name: string
  operations: string[]
}

export type UpdatePermissionInput = {
  name?: string
  operations?: string[]
}

export type ArchivePermissionInput = {
  isArchived: boolean
}

export type CreatePermissionAssignmentInput = { permissionId: string; identityId: string }

export type CreateOrgInput = {
  name: string
  country: string
  userEmail: string
  dateOnboarded?: string
  clusterId?: string
  tier: string
}

export type UpdateOrgInput = {
  orgId: string
  name?: string
  country?: string
  dateOnboarded?: string
  status?: 'Decommissioned' | 'Enabled'
}

export type CreateAvailableOrgListInput = {
  username: string
  orgId?: string
  permissions?: string[]
  origin: string
  recaptchaResponse: string
}
