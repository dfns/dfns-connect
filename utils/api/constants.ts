import { ApiKeyRecord as ServiceAccountRecord } from '@dfns/datamodel/dist/ApiKeys'
import { AvailableOrg, UserAccessTokenInformation, UserAuthKind } from '@dfns/datamodel/dist/Auth'
import {
  BlockchainEvent,
  BroadcastTransactionBody,
  BroadcastTransactionSuccess,
  CreateWalletBody,
  GenerateSignatureBody,
  PaginatedSignatureList,
  PaginatedTransactionList,
  PaginatedTransferList,
  SignatureRequest,
  TransferAssetBody,
  TransferRequest,
  Wallet,
  WalletAssets,
  WalletNfts,
} from '@dfns/datamodel/dist/Wallets' // TODO: replace with definitions from @dfns/sdk

import {
  ActivateApplicationInput,
  ActivateCredentialInput,
  ActivateUserInput,
  AppInfoWithPublicKey,
  ArchivePermissionInput,
  CreateAppInput,
  CreateAvailableOrgListInput,
  CreateClusterBody,
  CreateOrgInput,
  CreatePermissionAssignmentInput,
  CreatePermissionInput,
  CreateServiceAccountWithPublicKeyInput,
  CreateUserAndOrgInput,
  CreateUserCredentialChallengeInput,
  CreateUserCredentialChallengeResponse,
  CreateUserCredentialInput,
  CreateUserInput,
  CreateUserResponse,
  CredentialInfo,
  DecisionStatus,
  ListApiResponse,
  LoginUserInput,
  LoginUserResponse,
  LogoutUserResponse,
  Org,
  Permission,
  PermissionAssignment,
  Policy,
  PolicyApproval,
  RecoverUserInput,
  RegisterUserInput,
  RegisterUserResponse,
  ResendEmailInput,
  SendRecoveryEmailInput,
  ServiceAccountRecordWithPublicKey,
  SigningCluster,
  UpdateClusterBody,
  UpdateOrgInput,
  UpdatePermissionInput,
  UserInfo,
} from './clients/dfnsApi/types'

export enum ApiEndpoint {
  signMessage = 'signMessage',
  listActivePersonalAccessTokens = 'listActivePersonalAccessTokens',
  createPersonalAccessToken = 'createPersonalAccessToken',
  revokePersonalAccessTokens = 'revokePersonalAccessTokens',
  listActiveServiceAccounts = 'listActiveServiceAccounts',
  listServiceAccounts = 'listServiceAccounts',
  activateServiceAccount = 'activateServiceAccount',
  deactivateServiceAccount = 'deactivateServiceAccount',
  activatePersonalAccessToken = 'activatePersonalAccessToken',
  deactivatePersonalAccessToken = 'deactivatePersonalAccessToken',
  listServiceAccountScopes = 'listServiceAccountScopes',
  loginUser = 'loginUser',
  registerUser = 'registerUser',
  logoutUser = 'logoutUser',
  listUsers = 'listUsers',
  listApplications = 'listApplications',
  createUser = 'createUser',
  getUser = 'getUser',
  createApplication = 'createApplication',
  getApplication = 'getApplication',
  deactivateApplication = 'deactivateApplication',
  activateApplication = 'activateApplication',
  deactivateUser = 'deactivateUser',
  activateUser = 'activateUser',
  createServiceAccount = 'createServiceAccount',
  getServiceAccount = 'getServiceAccount',
  resendRegistrationCode = 'resendRegistrationCode',
  activateCredential = 'activateCredential',
  deactivateCredential = 'deactivateCredential',
  listUserCredentials = 'listUserCredentials',
  createUserCredential = 'createUserCredential',
  createUserCredentialChallenge = 'createUserCredentialChallenge',
  createOrg = 'createOrg',
  listOrgs = 'listOrgs',
  updateOrg = 'updateOrg',
  createAvailableOrgList = 'createAvailableOrgList',
  createPermissionAssignment = 'createPermissionAssignment',
  deletePermissionAssignment = 'deletePermissionAssignment',
  sendUserRecoveryVerificationEmail = 'sendUserRecoveryVerificationEmail',
  recoverUser = 'recoverUser',
  listWallets = 'listWallets',
  getWallet = 'getWallet',
  getWalletAssets = 'getWalletAssets',
  getWalletNfts = 'getWalletNfts',
  getWalletHistory = 'getWalletHistory',
  listWalletTransferRequests = 'listWalletTransferRequests',
  listWalletTransactionRequests = 'listWalletTransactionRequests',
  listWalletSignatureRequests = 'listWalletSignatureRequests',
  createWallet = 'createWallet',
  walletAssetTransfer = 'walletAssetTransfer',
  generateWalletSignature = 'generateWalletSignature',
  broadcastWalletTransaction = 'broadcastWalletTransaction',
  getWalletSignature = 'getWalletSignature',
  listPermissions = 'listPermissions',
  getPermission = 'getPermission',
  createPermission = 'createPermission',
  updatePermission = 'updatePermission',
  archivePermission = 'archivePermission',
  staffListClusters = 'staffListClusters',
  staffGetCluster = 'staffGetCluster',
  staffCreateCluster = 'staffCreateCluster',
  staffUpdateCluster = 'staffUpdateCluster',
  listPolicyApprovals = 'listPolicyApprovals',
  createApprovalDecision = 'createApprovalDecision',
  listPolicies = 'listPolicies',
  getPolicy = 'getPolicy',
  createPolicy = 'createPolicy',
  archivePolicy = 'archivePolicy',
  updatePolicy = 'updatePolicy',
  createUserAndOrg = 'createUserAndOrg',
}

export type ApiScope = { value: string; description: string }

// TODO: remove these 2 types once definitions are from SDK
export type ExtendedBlockchainEvent = BlockchainEvent & {
  tos?: string[]
  froms?: string[]
  metadata: {
    asset: {
      decimals: number
      symbol: string
    }
  }
}
export type PaginatedEventHistory = {
  items: ExtendedBlockchainEvent[]
}

export type ApiRequestResult<A extends ApiEndpoint> = A extends ApiEndpoint.listActivePersonalAccessTokens
  ? ServiceAccountRecordWithPublicKey[]
  : A extends ApiEndpoint.createPersonalAccessToken
  ? ServiceAccountRecordWithPublicKey
  : A extends ApiEndpoint.revokePersonalAccessTokens
  ? ServiceAccountRecord
  : A extends ApiEndpoint.listActiveServiceAccounts
  ? ServiceAccountRecord
  : A extends ApiEndpoint.listServiceAccounts
  ? ServiceAccountRecordWithPublicKey[]
  : A extends ApiEndpoint.activateServiceAccount
  ? ServiceAccountRecordWithPublicKey
  : A extends ApiEndpoint.deactivateServiceAccount
  ? ServiceAccountRecordWithPublicKey
  : A extends ApiEndpoint.activatePersonalAccessToken
  ? ServiceAccountRecordWithPublicKey
  : A extends ApiEndpoint.deactivatePersonalAccessToken
  ? ServiceAccountRecordWithPublicKey
  : A extends ApiEndpoint.listServiceAccountScopes
  ? ApiScope[]
  : A extends ApiEndpoint.loginUser
  ? LoginUserResponse
  : A extends ApiEndpoint.registerUser
  ? RegisterUserResponse
  : A extends ApiEndpoint.logoutUser
  ? LogoutUserResponse
  : A extends ApiEndpoint.listUsers
  ? UserInfo[]
  : A extends ApiEndpoint.listApplications
  ? AppInfoWithPublicKey[]
  : A extends ApiEndpoint.createUser
  ? CreateUserResponse
  : A extends ApiEndpoint.getUser
  ? UserInfo
  : A extends ApiEndpoint.createApplication
  ? AppInfoWithPublicKey
  : A extends ApiEndpoint.getApplication
  ? AppInfoWithPublicKey
  : A extends ApiEndpoint.createServiceAccount
  ? ServiceAccountRecordWithPublicKey
  : A extends ApiEndpoint.getServiceAccount
  ? UserAccessTokenInformation
  : A extends ApiEndpoint.deactivateApplication
  ? void
  : A extends ApiEndpoint.activateApplication
  ? void
  : A extends ApiEndpoint.deactivateUser
  ? void
  : A extends ApiEndpoint.activateUser
  ? void
  : A extends ApiEndpoint.resendRegistrationCode
  ? void
  : A extends ApiEndpoint.activateCredential
  ? void
  : A extends ApiEndpoint.deactivateCredential
  ? void
  : A extends ApiEndpoint.listUserCredentials
  ? CredentialInfo[]
  : A extends ApiEndpoint.createUserCredential
  ? CredentialInfo
  : A extends ApiEndpoint.createUserCredentialChallenge
  ? CreateUserCredentialChallengeResponse
  : A extends ApiEndpoint.createOrg
  ? Org
  : A extends ApiEndpoint.listOrgs
  ? Org[]
  : A extends ApiEndpoint.updateOrg
  ? Org
  : A extends ApiEndpoint.createAvailableOrgList
  ? AvailableOrg[]
  : A extends ApiEndpoint.createPermissionAssignment
  ? PermissionAssignment
  : A extends ApiEndpoint.deletePermissionAssignment
  ? PermissionAssignment
  : A extends ApiEndpoint.sendUserRecoveryVerificationEmail
  ? void
  : A extends ApiEndpoint.recoverUser
  ? RegisterUserResponse
  : A extends ApiEndpoint.listWallets
  ? ListApiResponse<Wallet>
  : A extends ApiEndpoint.getWallet
  ? Wallet
  : A extends ApiEndpoint.getWalletAssets
  ? WalletAssets
  : A extends ApiEndpoint.getWalletNfts
  ? WalletNfts
  : A extends ApiEndpoint.getWalletHistory
  ? PaginatedEventHistory
  : A extends ApiEndpoint.listWalletTransferRequests
  ? PaginatedTransferList
  : A extends ApiEndpoint.listWalletTransactionRequests
  ? PaginatedTransactionList
  : A extends ApiEndpoint.listWalletSignatureRequests
  ? PaginatedSignatureList
  : A extends ApiEndpoint.createWallet
  ? Wallet
  : A extends ApiEndpoint.walletAssetTransfer
  ? TransferRequest
  : A extends ApiEndpoint.generateWalletSignature
  ? SignatureRequest
  : A extends ApiEndpoint.broadcastWalletTransaction
  ? BroadcastTransactionSuccess
  : A extends ApiEndpoint.getWalletSignature
  ? SignatureRequest
  : A extends ApiEndpoint.createPermission
  ? Permission
  : A extends ApiEndpoint.updatePermission
  ? Permission
  : A extends ApiEndpoint.getPermission
  ? Permission
  : A extends ApiEndpoint.listPermissions
  ? Permission[]
  : A extends ApiEndpoint.archivePermission
  ? Permission
  : A extends ApiEndpoint.staffListClusters
  ? SigningCluster[]
  : A extends ApiEndpoint.staffGetCluster
  ? SigningCluster
  : A extends ApiEndpoint.staffCreateCluster
  ? SigningCluster
  : A extends ApiEndpoint.staffUpdateCluster
  ? SigningCluster
  : A extends ApiEndpoint.listPolicyApprovals
  ? ListApiResponse<PolicyApproval>
  : A extends ApiEndpoint.createApprovalDecision
  ? PolicyApproval
  : A extends ApiEndpoint.listPolicies
  ? ListApiResponse<Policy>
  : A extends ApiEndpoint.getPolicy
  ? Policy
  : A extends ApiEndpoint.archivePolicy
  ? Policy
  : A extends ApiEndpoint.createPolicy
  ? Policy
  : A extends ApiEndpoint.updatePolicy
  ? Policy
  : A extends ApiEndpoint.createUserAndOrg
  ? { id: string }
  : never

export type ApiRequestParams<A extends ApiEndpoint> = A extends ApiEndpoint.signMessage
  ? { publicKeyId: string }
  : A extends
      | ApiEndpoint.activateServiceAccount
      | ApiEndpoint.deactivateServiceAccount
      | ApiEndpoint.activatePersonalAccessToken
      | ApiEndpoint.deactivatePersonalAccessToken
  ? { serviceAccountId: string }
  : A extends ApiEndpoint.createPermissionAssignment
  ? { permissionId: string }
  : A extends ApiEndpoint.deletePermissionAssignment
  ? { permissionId: string; assignmentId: string }
  : A extends ApiEndpoint.getWallet
  ? { walletId: string }
  : A extends ApiEndpoint.listWallets
  ? { limit?: number; paginationToken?: string }
  : A extends ApiEndpoint.getWalletAssets
  ? { walletId: string }
  : A extends ApiEndpoint.getWalletNfts
  ? { walletId: string }
  : A extends ApiEndpoint.getWalletHistory
  ? { walletId: string }
  : A extends ApiEndpoint.listWalletTransferRequests
  ? { walletId: string }
  : A extends ApiEndpoint.listWalletTransactionRequests
  ? { walletId: string }
  : A extends ApiEndpoint.listWalletSignatureRequests
  ? { walletId: string }
  : A extends ApiEndpoint.walletAssetTransfer
  ? { walletId: string }
  : A extends ApiEndpoint.generateWalletSignature
  ? { walletId: string }
  : A extends ApiEndpoint.broadcastWalletTransaction
  ? { walletId: string }
  : A extends ApiEndpoint.getWalletSignature
  ? { walletId: string; signatureId: string }
  : A extends ApiEndpoint.getPermission
  ? { permissionId: string }
  : A extends ApiEndpoint.updatePermission
  ? { permissionId: string }
  : A extends ApiEndpoint.archivePermission
  ? { permissionId: string }
  : A extends ApiEndpoint.staffGetCluster
  ? { clusterId: string }
  : A extends ApiEndpoint.staffUpdateCluster
  ? { clusterId: string }
  : A extends ApiEndpoint.listPolicyApprovals
  ? { initiatorId?: string; approverId?: string }
  : A extends ApiEndpoint.createApprovalDecision
  ? { approvalId: string }
  : A extends ApiEndpoint.listPolicies
  ? { limit?: number; paginationToken?: string }
  : A extends ApiEndpoint.getPolicy
  ? { policyId: string }
  : A extends ApiEndpoint.archivePolicy
  ? { policyId: string }
  : A extends ApiEndpoint.updatePolicy
  ? { policyId: string }
  : A extends ApiEndpoint.listUsers
  ? { limit?: number; kind?: UserAuthKind }
  : never

export type ApiRequestBody<A extends ApiEndpoint> = A extends ApiEndpoint.createPersonalAccessToken
  ? CreateServiceAccountWithPublicKeyInput
  : A extends ApiEndpoint.createServiceAccount
  ? CreateServiceAccountWithPublicKeyInput
  : A extends ApiEndpoint.loginUser
  ? LoginUserInput
  : A extends ApiEndpoint.registerUser
  ? RegisterUserInput
  : A extends ApiEndpoint.createUser
  ? CreateUserInput
  : A extends ApiEndpoint.createUserAndOrg
  ? CreateUserAndOrgInput
  : A extends ApiEndpoint.createApplication
  ? CreateAppInput
  : A extends ApiEndpoint.deactivateApplication
  ? ActivateApplicationInput
  : A extends ApiEndpoint.activateApplication
  ? ActivateApplicationInput
  : A extends ApiEndpoint.deactivateUser
  ? ActivateUserInput
  : A extends ApiEndpoint.activateUser
  ? ActivateUserInput
  : A extends ApiEndpoint.resendRegistrationCode
  ? ResendEmailInput
  : A extends ApiEndpoint.activateCredential
  ? ActivateCredentialInput
  : A extends ApiEndpoint.deactivateCredential
  ? ActivateCredentialInput
  : A extends ApiEndpoint.createUserCredential
  ? CreateUserCredentialInput
  : A extends ApiEndpoint.createUserCredentialChallenge
  ? CreateUserCredentialChallengeInput
  : A extends ApiEndpoint.createOrg
  ? CreateOrgInput
  : A extends ApiEndpoint.updateOrg
  ? UpdateOrgInput
  : A extends ApiEndpoint.createAvailableOrgList
  ? CreateAvailableOrgListInput
  : A extends ApiEndpoint.createPermissionAssignment
  ? CreatePermissionAssignmentInput
  : A extends ApiEndpoint.sendUserRecoveryVerificationEmail
  ? SendRecoveryEmailInput
  : A extends ApiEndpoint.recoverUser
  ? RecoverUserInput
  : A extends ApiEndpoint.createWallet
  ? CreateWalletBody
  : A extends ApiEndpoint.walletAssetTransfer
  ? TransferAssetBody
  : A extends ApiEndpoint.generateWalletSignature
  ? GenerateSignatureBody
  : A extends ApiEndpoint.broadcastWalletTransaction
  ? BroadcastTransactionBody
  : A extends ApiEndpoint.createPermission
  ? CreatePermissionInput
  : A extends ApiEndpoint.updatePermission
  ? UpdatePermissionInput
  : A extends ApiEndpoint.archivePermission
  ? ArchivePermissionInput
  : A extends ApiEndpoint.getApplication
  ? { appId: string }
  : A extends ApiEndpoint.staffCreateCluster
  ? CreateClusterBody
  : A extends ApiEndpoint.staffUpdateCluster
  ? UpdateClusterBody
  : A extends ApiEndpoint.createApprovalDecision
  ? { value: DecisionStatus; reason?: string }
  : A extends ApiEndpoint.createPolicy
  ? Record<string, unknown>
  : A extends ApiEndpoint.updatePolicy
  ? Record<string, unknown>
  : never
