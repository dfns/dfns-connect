import {
  ApiKeyRecord as ServiceAccountRecord,
  ApiKeyStatus as ServiceAccountStatus,
} from '@dfns/datamodel/dist/ApiKeys'
import { ApplicationKind, AvailableOrg } from '@dfns/datamodel/dist/Auth'
import {
  BlockchainNetwork,
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
} from '@dfns/datamodel/dist/Wallets'
import _ from 'lodash'
import { ApiScope, PaginatedEventHistory } from 'utils/api/constants'
import { getUserIdentity } from 'utils/hooks/useUserIdentity'
import { buildPathWithQueryParams } from 'utils/url'

import { ApiKind, ClientSideHttpClient, CreateUserCredentials, GetUserCredentials, RiskKind } from './httpClient'
import {
  AccessTokenInfoWithPublicKey,
  ActivateApplicationInput,
  ActivateCredentialInput,
  ActivateUserInput,
  AppInfoWithPublicKey,
  ArchivePermissionInput,
  CreateAccessTokenInput,
  CreateAppInput,
  CreateApplicationInput,
  CreateAvailableOrgListInput,
  CreateClusterBody,
  CreateOrgInput,
  CreatePermissionInput,
  CreateServiceAccountWithPublicKeyInput,
  CreateUserAndOrgResponse,
  CreateUserCredentialChallengeInput,
  CreateUserCredentialChallengeResponse,
  CreateUserCredentialInput,
  CreateUserResponse,
  CredentialInfo,
  DecisionStatus,
  GetApiResponse,
  ListApiResponse,
  Org,
  Permission,
  PermissionAssignment,
  Policy,
  PolicyApproval,
  PostApiResponse,
  PutApiResponse,
  RecoverUserInput,
  RegisterUserResponse,
  ResendEmailInput,
  SendRecoveryEmailInput,
  ServiceAccountRecordWithPublicKey,
  SigningCluster,
  UpdateClusterBody,
  UpdateOrgInput,
  UpdatePermissionInput,
  UserAccessTokenInformation,
  UserInfo,
  UserKind,
} from './types'

export type DfnsAPIConfig = {
  customUrl?: string
  appId?: string
  appOrigin?: string
  appRelyingParty?: string
  getUserCredentialsCallback: GetUserCredentials
  createUserCredentialsCallback: CreateUserCredentials
}

export interface DfnsAPIInterface {
  createPersonalAccessToken(input: CreateServiceAccountWithPublicKeyInput): Promise<ServiceAccountRecord>
  listActivePersonalAccessTokens(): Promise<ServiceAccountRecordWithPublicKey[]>
  createServiceAccount(input: CreateServiceAccountWithPublicKeyInput): Promise<ServiceAccountRecordWithPublicKey>
  getServiceAccount(id: string): Promise<UserAccessTokenInformation>
  listActiveServiceAccounts(): Promise<ServiceAccountRecordWithPublicKey[]>
  listServiceAccounts(): Promise<ServiceAccountRecordWithPublicKey[]>
  activateServiceAccount(id: string): Promise<ServiceAccountRecordWithPublicKey>
  deactivateServiceAccount(id: string): Promise<ServiceAccountRecordWithPublicKey>
  activatePersonalAccessToken(id: string): Promise<ServiceAccountRecordWithPublicKey>
  deactivatePersonalAccessToken(id: string): Promise<ServiceAccountRecordWithPublicKey>
  listServiceAccountScopes(): Promise<ApiScope[]>
  listUsers(): Promise<UserInfo[]>
  listApplications(): Promise<AppInfoWithPublicKey[]>
  createUser(
    email: string,
    kind: UserKind.Employee | UserKind.Staff | UserKind.User,
    publicKey: string
  ): Promise<CreateUserResponse>
  createUserAndOrg(
    email: string,
    recaptchaResponse: string,
    termsAndConditionsAccepted: boolean,
    privacyPolicyAccepted: boolean
  ): Promise<CreateUserAndOrgResponse>
  getUser(id: string): Promise<UserInfo>
  deactivateUser(input: ActivateUserInput): Promise<void>
  activateUser(input: ActivateUserInput): Promise<void>
  createApplication(input: CreateAppInput): Promise<AppInfoWithPublicKey>
  getApplication(id: string): Promise<AppInfoWithPublicKey>
  deactivateApplication(input: ActivateApplicationInput): Promise<void>
  activateApplication(input: ActivateApplicationInput): Promise<void>
  resendRegistrationCode(input: ResendEmailInput): Promise<void>
  deactivateCredential(input: ActivateCredentialInput): Promise<void>
  activateCredential(input: ActivateCredentialInput): Promise<void>
  listUserCredentials(): Promise<CredentialInfo[]>
  createUserCredential(input: CreateUserCredentialInput): Promise<CredentialInfo>
  createUserCredentialChallenge(
    input: CreateUserCredentialChallengeInput
  ): Promise<CreateUserCredentialChallengeResponse>
  createOrg(input: CreateOrgInput): Promise<Org>
  listOrgs(): Promise<Org[]>
  updateOrg(input: UpdateOrgInput): Promise<Org>
  createAvailableOrgList(input: CreateAvailableOrgListInput): Promise<AvailableOrg[]>

  createPermissionAssignment(permissionId: string, identityId: string): Promise<PermissionAssignment>
  deletePermissionAssignment(permissionId: string, assignmentId: string): Promise<PermissionAssignment>

  listWallets(): Promise<ListApiResponse<Wallet>>
  getWallet(walletId: string): Promise<Wallet>
  getWalletAssets(walletId: string): Promise<WalletAssets>
  getWalletNfts(walletId: string): Promise<WalletNfts>
  getWalletHistory(walletId: string, network: BlockchainNetwork): Promise<PaginatedEventHistory>
  listWalletTransferRequests(walletId: string): Promise<PaginatedTransferList>
  listWalletTransactionRequests(walletId: string): Promise<PaginatedTransactionList>
  listWalletSignatureRequests(walletId: string): Promise<PaginatedSignatureList>
  createWallet(input: CreateWalletBody): Promise<Wallet>
  walletAssetTransfer(walletId: string, input: TransferAssetBody): Promise<TransferRequest>
  generateWalletSignature(walletId: string, input: GenerateSignatureBody): Promise<SignatureRequest>
  broadcastWalletTransaction(walletId: string, input: BroadcastTransactionBody): Promise<BroadcastTransactionSuccess>
  getWalletSignature(walletId: string, signatureId: string): Promise<SignatureRequest>

  createPermission(input: CreatePermissionInput): Promise<Permission>
  updatePermission(permissionId: string, input: UpdatePermissionInput): Promise<Permission>
  getPermission(permissionId: string): Promise<Permission>
  listPermissions(): Promise<Permission[]>
  archivePermission(permissionId: string, input: ArchivePermissionInput): Promise<Permission>

  staffListClusters(): Promise<SigningCluster[]>
  staffCreateCluster(body: CreateClusterBody): Promise<SigningCluster>
  staffGetCluster(clusterId: string): Promise<SigningCluster>
  staffUpdateCluster(clusterId: string, body: UpdateClusterBody): Promise<SigningCluster>

  listPolicyApprovals(): Promise<ListApiResponse<PolicyApproval>>
  createApprovalDecision(approvalId: string, body: { value: DecisionStatus; reason: string }): Promise<PolicyApproval>

  listPolicies(): Promise<ListApiResponse<Policy>>
  getPolicy(policyId: string): Promise<Policy>
  createPolicy(body: Record<string, unknown>): Promise<Policy>
  archivePolicy(policyId: string): Promise<Policy>
  updatePolicy(policyId: string, body: Record<string, unknown>): Promise<Policy>
}

export class DfnsAPI implements DfnsAPIInterface {
  private prodUrl = 'api.dfns.co'
  private httpClient: ClientSideHttpClient

  constructor(config: DfnsAPIConfig) {
    this.httpClient = new ClientSideHttpClient(
      config.appId || '',
      config.customUrl || this.prodUrl,
      config.appOrigin || 'api.dfns.co',
      config.appRelyingParty || 'dfns.co',
      config.getUserCredentialsCallback,
      config.createUserCredentialsCallback
    )
  }

  setBaseUrl(url: string): DfnsAPI {
    this.httpClient.baseUrl = url.replace(/\/$/, '').replace(/^https?:\/\//, '')
    return this
  }

  async login(username: string, orgId: string) {
    await this.httpClient.authAsPesron(username, orgId)
    return {}
  }

  async register(username: string, orgId: string, registrationCode: string) {
    return await this.httpClient.registerUser(username, orgId, registrationCode)
  }

  async logout() {
    await this.httpClient.logoutUser()
    return {}
  }

  async createUser(
    email: string,
    kind: UserKind.Employee | UserKind.Staff | UserKind.User,
    publicKey: string,
    externalId?: string
  ) {
    const resp = await this.httpClient.post<UserInfo>(
      '/auth/users',
      {
        email: email,
        kind: kind,
        publicKey: publicKey,
        externalId: externalId,
      },
      RiskKind.UserActionSignatureRequired
    )
    const result: UserInfo = {
      ...resp,
      adminPermissionId: 'Not known',
      permissions: [],
    }
    return result
  }

  async createUserAndOrg(
    email: string,
    recaptchaResponse: string,
    termsAndConditionsAccepted: boolean,
    privacyPolicyAccepted: boolean
  ) {
    const result = await this.httpClient.post<{ id: string }>(
      '/dashboard/org',
      {
        adminUser: {
          email,
        },
        termsAndConditionsAccepted,
        privacyPolicyAccepted,
        recaptchaResponse,
      },
      RiskKind.NoAuth
    )
    return result
  }

  async getUser(id: string) {
    const resp = await this.httpClient.get<GetApiResponse<UserInfo>>(`/auth/users/${id}`)
    return resp
  }

  async createApplication(input: CreateAppInput) {
    const body: CreateApplicationInput =
      input.kind === ApplicationKind.ClientSideApplication
        ? {
            kind: input.kind,
            name: input.name,
            origin: input.expectedOrigin,
            relyingPartyId: input.expectedRpId,
            permissionId: input.permissionId,
            externalId: input.externalId,
          }
        : {
            kind: input.kind,
            name: input.name,
            publicKey: input.publicKey,
            origin: input.expectedOrigin,
            relyingPartyId: input.expectedRpId,
            permissionId: input.permissionId,
            externalId: input.externalId,
          }

    const resp = await this.httpClient.post<PostApiResponse<AppInfoWithPublicKey>>(
      '/auth/apps',
      body,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async getApplication(id: string) {
    const resp = await this.httpClient.get<GetApiResponse<AppInfoWithPublicKey>>(`/auth/apps/${id}`)
    return resp
  }

  async deactivateApplication(input: ActivateApplicationInput) {
    await this.httpClient.put(`/auth/apps/${input.appId}/deactivate`, undefined, RiskKind.UserActionSignatureRequired)
  }

  async activateApplication(input: ActivateApplicationInput) {
    await this.httpClient.put(`/auth/apps/${input.appId}/activate`, undefined, RiskKind.UserActionSignatureRequired)
  }

  async deactivateUser(input: ActivateUserInput) {
    await this.httpClient.put(`/auth/users/${input.userId}/deactivate`, undefined, RiskKind.UserActionSignatureRequired)
  }

  async activateUser(input: ActivateUserInput) {
    await this.httpClient.put(`/auth/users/${input.userId}/activate`, undefined, RiskKind.UserActionSignatureRequired)
  }

  async deactivateCredential(input: ActivateCredentialInput) {
    await this.httpClient.put('/auth/credentials/deactivate', input, RiskKind.UserActionSignatureRequired)
  }

  async activateCredential(input: ActivateCredentialInput) {
    await this.httpClient.put('/auth/credentials/activate', input, RiskKind.UserActionSignatureRequired)
  }

  async createUserCredential(input: CreateUserCredentialInput) {
    const resp = await this.httpClient.post<CredentialInfo>(
      '/auth/credentials',
      input,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async createUserCredentialChallenge(input: CreateUserCredentialChallengeInput) {
    const resp = await this.httpClient.post<CreateUserCredentialChallengeResponse>(
      '/auth/credentials/init',
      input,
      RiskKind.AuthRequired
    )
    return resp
  }

  async createPersonalAccessToken(input: CreateAccessTokenInput) {
    const resp = await this.httpClient.post<PostApiResponse<AccessTokenInfoWithPublicKey>>(
      '/auth/pats',
      input,
      RiskKind.UserActionSignatureRequired
    )

    const result: ServiceAccountRecordWithPublicKey = {
      authorId: '',
      dateCreated: resp.dateCreated,
      orgId: resp.orgId,
      scopes: [],
      status: ServiceAccountStatus.Active,
      id: resp.tokenId,
      token: resp.accessToken || '',
      externalId: '',
      name: input.name,
      credId: resp.credId,
      permissions: [],
      publicKey: resp.publicKey,
    }

    return result
  }

  private GetAdminPermissionId(items: UserInfo[]): string {
    const userIdentity = getUserIdentity()
    for (const item of items) {
      if (!item.permissionAssignments) {
        continue
      }

      for (const permission of item.permissionAssignments) {
        if (permission.permissionName === userIdentity.settings.adminPermissionName) {
          return permission.permissionId
        }
      }
    }
    return ''
  }

  async listActivePersonalAccessTokens() {
    const resp = await this.httpClient.get<ListApiResponse<AccessTokenInfoWithPublicKey>>('/auth/pats')

    const items: ServiceAccountRecordWithPublicKey[] = resp.items
      .filter((key) => key.isActive)
      .map((key) => {
        return {
          authorId: key.linkedUserId,
          dateCreated: key.dateCreated,
          id: key.tokenId,
          orgId: key.orgId,
          scopes: [],
          permissions: [],
          status: key.isActive ? ServiceAccountStatus.Active : ServiceAccountStatus.Archived,
          externalId: '',
          name: key.name,
          publicKey: key.publicKey,
          credId: key.credId,
        }
      })
    return items
  }

  async createServiceAccount(input: CreateServiceAccountWithPublicKeyInput) {
    const body: CreateAccessTokenInput = {
      name: input.name,
      publicKey: input.publicKey,
      permissionId: input.permissionId,
      externalId: input.externalId,
    }
    const resp = await this.httpClient.post<PostApiResponse<UserAccessTokenInformation>>(
      '/auth/service-accounts',
      body,
      RiskKind.UserActionSignatureRequired
    )

    if (resp.accessTokens.length === 0) {
      throw new Error('Unknown error')
    }
    const result: ServiceAccountRecordWithPublicKey = {
      authorId: '',
      dateCreated: resp.accessTokens[0].dateCreated,
      userId: resp.userInfo.userId,
      orgId: resp.userInfo.orgId,
      scopes: [],
      status: ServiceAccountStatus.Active,
      id: resp.accessTokens[0].tokenId,
      token: resp.accessTokens[0].accessToken || '',
      externalId: input.externalId,
      name: resp.userInfo.username,
      credId: resp.accessTokens[0].credId,
      permissions: [],
      publicKey: resp.accessTokens[0].publicKey,
    }

    return result
  }

  async getServiceAccount(id: string) {
    const resp = await this.httpClient.get<GetApiResponse<UserAccessTokenInformation>>(`/auth/service-accounts/${id}`)
    return resp
  }

  async listServiceAccounts() {
    const resp = await this.httpClient.get<ListApiResponse<UserAccessTokenInformation>>('/auth/service-accounts')
    const items: ServiceAccountRecordWithPublicKey[] = resp.items.map((serviceAccount) => {
      return {
        authorId: '',
        dateCreated: serviceAccount.accessTokens[0].dateCreated,
        id: serviceAccount.accessTokens[0].tokenId,
        userId: serviceAccount.userInfo.userId,
        orgId: serviceAccount.userInfo.orgId,
        scopes: [],
        permissions: [],
        credId: serviceAccount.accessTokens[0].credId,
        publicKey: serviceAccount.accessTokens[0].publicKey,
        status: ServiceAccountStatus.Active,
        externalId: '',
        name: serviceAccount.userInfo.username,
        isActive:
          serviceAccount.accessTokens.filter((token) => token.isActive).length !== 0 &&
          serviceAccount.userInfo.isActive,
      }
    })
    return items
  }

  async listActiveServiceAccounts() {
    const resp = await this.httpClient.get<ListApiResponse<UserAccessTokenInformation>>('/auth/service-accounts')
    const items: ServiceAccountRecordWithPublicKey[] = resp.items
      .filter((serviceAccount) => serviceAccount.accessTokens.filter((token) => token.isActive).length !== 0)
      .filter((serviceAccount) => serviceAccount.userInfo.isActive)
      .map((serviceAccount) => {
        return {
          authorId: '',
          dateCreated: serviceAccount.accessTokens[0].dateCreated,
          id: serviceAccount.accessTokens[0].tokenId,
          userId: serviceAccount.userInfo.userId,
          orgId: serviceAccount.userInfo.orgId,
          scopes: [],
          permissions: [],
          credId: serviceAccount.accessTokens[0].credId,
          publicKey: serviceAccount.accessTokens[0].publicKey,
          status: ServiceAccountStatus.Active,
          externalId: '',
          name: serviceAccount.userInfo.username,
        }
      })
    return items
  }

  async activateServiceAccount(id: string) {
    const resp = await this.httpClient.put<PutApiResponse<UserAccessTokenInformation>>(
      `/auth/service-accounts/${id}/activate`,
      undefined,
      RiskKind.UserActionSignatureRequired
    )

    const token =
      resp.accessTokens.length > 0 ? resp.accessTokens[0] : { dateCreated: '', credId: '', publicKey: '', tokenId: '' }
    const result: ServiceAccountRecordWithPublicKey = {
      authorId: '',
      dateCreated: token.dateCreated,
      id: token.tokenId,
      userId: resp.userInfo.userId,
      orgId: resp.userInfo.orgId,
      scopes: [],
      permissions: [],
      credId: token.credId,
      publicKey: token.publicKey,
      status: resp.userInfo.isActive ? ServiceAccountStatus.Active : ServiceAccountStatus.Archived,
      externalId: '',
      name: resp.userInfo.username,
    }

    return result
  }

  async deactivateServiceAccount(id: string) {
    const resp = await this.httpClient.put<PutApiResponse<UserAccessTokenInformation>>(
      `/auth/service-accounts/${id}/deactivate`,
      undefined,
      RiskKind.UserActionSignatureRequired
    )

    const token =
      resp.accessTokens.length > 0 ? resp.accessTokens[0] : { dateCreated: '', credId: '', publicKey: '', tokenId: '' }
    const result: ServiceAccountRecordWithPublicKey = {
      authorId: '',
      dateCreated: token.dateCreated,
      id: token.tokenId,
      userId: resp.userInfo.userId,
      orgId: resp.userInfo.orgId,
      scopes: [],
      permissions: [],
      credId: token.credId,
      publicKey: token.publicKey,
      status: resp.userInfo.isActive ? ServiceAccountStatus.Active : ServiceAccountStatus.Archived,
      externalId: '',
      name: resp.userInfo.username,
    }

    return result
  }

  async activatePersonalAccessToken(id: string) {
    const resp = await this.httpClient.put<PutApiResponse<AccessTokenInfoWithPublicKey>>(
      `/auth/pats/${id}/activate`,
      undefined,
      RiskKind.UserActionSignatureRequired
    )

    const result: ServiceAccountRecordWithPublicKey = {
      authorId: '',
      dateCreated: resp.dateCreated,
      orgId: resp.orgId,
      scopes: [],
      permissions: [],
      status: resp.isActive ? ServiceAccountStatus.Active : ServiceAccountStatus.Archived,
      id: resp.tokenId,
      externalId: '',
      name: resp.name,
      credId: resp.credId,
      publicKey: resp.publicKey,
    }

    return result
  }

  async deactivatePersonalAccessToken(id: string) {
    const resp = await this.httpClient.put<PutApiResponse<AccessTokenInfoWithPublicKey>>(
      `/auth/pats/${id}/deactivate`,
      undefined,
      RiskKind.UserActionSignatureRequired
    )

    const result: ServiceAccountRecordWithPublicKey = {
      authorId: '',
      dateCreated: resp.dateCreated,
      orgId: resp.orgId,
      scopes: [],
      permissions: [],
      status: resp.isActive ? ServiceAccountStatus.Active : ServiceAccountStatus.Archived,
      id: resp.tokenId,
      externalId: '',
      name: resp.name,
      credId: resp.credId,
      publicKey: resp.publicKey,
    }

    return result
  }

  async listServiceAccountScopes() {
    const resp = await this.httpClient.get<{ scopes: ApiScope[] }>('/api-keys/scopes')

    return resp.scopes
  }

  async listUsers(args?: { limit?: string; paginationToken?: string; kind?: string }) {
    const path = buildPathWithQueryParams('/auth/users', args)
    const resp = await this.httpClient.get<ListApiResponse<UserInfo>>(path)
    const adminPermssionName = this.GetAdminPermissionId(resp.items)
    const items = resp.items
      .filter((user) => !user.isServiceAccount)
      .map((user) => {
        return {
          ...user,
          adminPermissionId: adminPermssionName,
          permissions: [],
        }
      })

    return items
  }

  async listApplications() {
    const resp = await this.httpClient.get<ListApiResponse<AppInfoWithPublicKey>>('/auth/apps')
    return resp.items
  }

  async resendRegistrationCode(input: ResendEmailInput) {
    await this.httpClient.put<void>('/auth/registration/code', input, RiskKind.NoAuth)
  }

  async listUserCredentials() {
    const resp = await this.httpClient.get<ListApiResponse<CredentialInfo>>('/auth/credentials')
    return resp.items
  }

  async createOrg(input: CreateOrgInput) {
    const resp = await this.httpClient.post<Org>(
      '/staff/orgs/create-org',
      input,
      RiskKind.UserActionSignatureRequired,
      ApiKind.Staff
    )
    return resp
  }

  async listOrgs() {
    const resp = await this.httpClient.post<Org[]>(
      '/staff/orgs/list-orgs',
      undefined,
      RiskKind.AuthRequired,
      ApiKind.Staff
    )
    return resp
  }

  async updateOrg(input: UpdateOrgInput) {
    const resp = await this.httpClient.post<Org>(
      '/staff/orgs/update-org',
      input,
      RiskKind.UserActionSignatureRequired,
      ApiKind.Staff
    )
    return resp
  }

  async createAvailableOrgList(input: CreateAvailableOrgListInput) {
    const resp = await this.httpClient.post<ListApiResponse<AvailableOrg>>('/auth/login/orgs', input, RiskKind.NoAuth)
    return resp.items
  }

  async createPermissionAssignment(permissionId: string, identityId: string) {
    const resp = await this.httpClient.post<PermissionAssignment>(
      `/permissions/${permissionId}/assignments`,
      { identityId },
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async deletePermissionAssignment(permissionId: string, assignmentId: string) {
    const resp = await this.httpClient.delete<PermissionAssignment>(
      `/permissions/${permissionId}/assignments/${assignmentId}`,
      undefined,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async sendUserRecoveryVerificationEmail(input: SendRecoveryEmailInput): Promise<void> {
    await this.httpClient.post<SendRecoveryEmailInput>('/auth/recover/user/code', input, RiskKind.NoAuth)
  }

  async recoverUser(input: RecoverUserInput): Promise<RegisterUserResponse> {
    return await this.httpClient.recoverUser(
      input.username,
      input.verificationCode,
      input.recoveryCode,
      input.recoveryCredId,
      input.orgId
    )
  }

  async listWallets(args?: { limit?: string; paginationToken?: string }) {
    const path = buildPathWithQueryParams('/wallets', args)
    return this.httpClient.get<ListApiResponse<Wallet>>(path)
  }

  async getWallet(walletId: string) {
    const resp = await this.httpClient.get<GetApiResponse<Wallet>>(`/wallets/${walletId}`)
    return resp
  }

  async getWalletAssets(walletId: string) {
    const resp = await this.httpClient.get<GetApiResponse<WalletAssets>>(`/wallets/${walletId}/assets`)
    return resp
  }

  async getWalletNfts(walletId: string): Promise<WalletNfts> {
    const resp = await this.httpClient.get<GetApiResponse<WalletNfts>>(`/wallets/${walletId}/nfts`)
    return resp
  }

  async getWalletHistory(walletId: string, network: BlockchainNetwork): Promise<PaginatedEventHistory> {
    const resp = await this.httpClient.get<GetApiResponse<PaginatedEventHistory>>(`/wallets/${walletId}/history`)

    // Map different fields for Bitcoin (differs from EVM)
    const isBitcoinNetwork = [BlockchainNetwork.Bitcoin, BlockchainNetwork.BitcoinTestnet3].includes(network)
    if (!isBitcoinNetwork || !resp?.items) return resp

    const walletHistoryBitcoin = _.cloneDeep(resp)
    const walletHistoryItems = (walletHistoryBitcoin.items = walletHistoryBitcoin.items.map((i) => ({
      ...i,
      from: i?.froms?.join(',') ?? '',
      to: i?.tos?.join(',') ?? '',
    })))
    walletHistoryBitcoin.items = walletHistoryItems
    return walletHistoryBitcoin
  }

  async listWalletTransferRequests(walletId: string): Promise<PaginatedTransferList> {
    const resp = await this.httpClient.get<GetApiResponse<PaginatedTransferList>>(`/wallets/${walletId}/transfers`)
    return resp
  }

  async listWalletTransactionRequests(walletId: string): Promise<PaginatedTransactionList> {
    const resp = await this.httpClient.get<GetApiResponse<PaginatedTransactionList>>(
      `/wallets/${walletId}/transactions`
    )
    return resp
  }

  async listWalletSignatureRequests(walletId: string): Promise<PaginatedSignatureList> {
    const resp = await this.httpClient.get<GetApiResponse<PaginatedSignatureList>>(`/wallets/${walletId}/signatures`)
    return resp
  }

  async createWallet(input: CreateWalletBody): Promise<Wallet> {
    const resp = await this.httpClient.post<PostApiResponse<Wallet>>(
      '/wallets',
      input,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async walletAssetTransfer(walletId: string, body: TransferAssetBody): Promise<TransferRequest> {
    const resp = await this.httpClient.post<PostApiResponse<TransferRequest>>(
      `/wallets/${walletId}/transfers`,
      body,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async generateWalletSignature(walletId: string, body: GenerateSignatureBody): Promise<SignatureRequest> {
    const resp = await this.httpClient.post<PostApiResponse<SignatureRequest>>(
      `/wallets/${walletId}/signatures`,
      body,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async broadcastWalletTransaction(
    walletId: string,
    body: BroadcastTransactionBody
  ): Promise<BroadcastTransactionSuccess> {
    const resp = await this.httpClient.post<PostApiResponse<BroadcastTransactionSuccess>>(
      `/wallets/${walletId}/transactions`,
      body,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async getWalletSignature(walletId: string, signatureId: string): Promise<SignatureRequest> {
    const resp = await this.httpClient.get<PostApiResponse<SignatureRequest>>(
      `/wallets/${walletId}/signatures/${signatureId}`
    )
    return resp
  }

  async listPermissions() {
    const resp = await this.httpClient.get<ListApiResponse<Permission>>('/permissions')
    return resp.items
  }

  async getPermission(permissionId: string): Promise<Permission> {
    const resp = await this.httpClient.get<GetApiResponse<Permission>>(`/permissions/${permissionId}`)
    return resp
  }

  async createPermission(body: CreatePermissionInput): Promise<Permission> {
    const resp = await this.httpClient.post<PostApiResponse<Permission>>(
      '/permissions',
      body,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async updatePermission(permissionId: string, body: UpdatePermissionInput): Promise<Permission> {
    const resp = await this.httpClient.put<PostApiResponse<Permission>>(
      `/permissions/${permissionId}`,
      body,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async archivePermission(permissionId: string, body: ArchivePermissionInput): Promise<Permission> {
    const resp = await this.httpClient.put<PostApiResponse<Permission>>(
      `/permissions/${permissionId}/archive`,
      body,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async staffListClusters() {
    const resp = await this.httpClient.get<SigningCluster[]>(
      '/staff/signers/clusters',
      undefined,
      RiskKind.AuthRequired,
      ApiKind.Staff
    )
    return resp
  }

  async staffCreateCluster(body: CreateClusterBody) {
    const resp = await this.httpClient.post<SigningCluster>(
      '/staff/signers/clusters',
      body,
      RiskKind.UserActionSignatureRequired,
      ApiKind.Staff
    )
    return resp
  }

  async staffGetCluster(clusterId: string) {
    const resp = await this.httpClient.get<SigningCluster>(
      `/staff/signers/clusters/${clusterId}`,
      undefined,
      RiskKind.AuthRequired,
      ApiKind.Staff
    )
    return resp
  }

  async staffUpdateCluster(clusterId: string, body: UpdateClusterBody) {
    const resp = await this.httpClient.put<SigningCluster>(
      `/staff/signers/clusters/${clusterId}`,
      body,
      RiskKind.UserActionSignatureRequired,
      ApiKind.Staff
    )
    return resp
  }

  async listPolicyApprovals(args?: {
    initiatorId?: string
    approverId?: string
    status?: string
    triggerStatus?: string
  }) {
    const path = buildPathWithQueryParams('/v2/policy-approvals', args)
    return this.httpClient.get<ListApiResponse<PolicyApproval>>(path)
  }

  async createApprovalDecision(approvalId: string, body: { value: DecisionStatus; reason?: string }) {
    const resp = await this.httpClient.post<PolicyApproval>(
      `/v2/policy-approvals/${approvalId}/decisions`,
      body,
      RiskKind.UserActionSignatureRequired
    )
    return resp
  }

  async listPolicies(args?: { status?: 'Active' | 'Archived' }) {
    const path = buildPathWithQueryParams('/v2/policies', args)
    return this.httpClient.get<ListApiResponse<Policy>>(path)
  }

  async getPolicy(policyId: string) {
    return this.httpClient.get<Policy>(`/v2/policies/${policyId}`)
  }

  async createPolicy(body: Record<string, unknown>) {
    return this.httpClient.post<Policy>('/v2/policies', body, RiskKind.UserActionSignatureRequired)
  }

  async archivePolicy(policyId: string) {
    return this.httpClient.delete<Policy>(`/v2/policies/${policyId}`, undefined, RiskKind.UserActionSignatureRequired)
  }

  async updatePolicy(policyId: string, body: Record<string, unknown>) {
    return this.httpClient.put<Policy>(`/v2/policies/${policyId}`, body, RiskKind.UserActionSignatureRequired)
  }
}
