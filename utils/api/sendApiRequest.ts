import {
  BlockchainNetwork,
  BroadcastTransactionBody,
  CreateWalletBody,
  GenerateSignatureBody,
  TransferAssetBody,
} from '@dfns/datamodel/dist/Wallets'
import toast from 'react-hot-toast'
import { getEnvVarOrThrow } from 'utils/env'
import { errorHandler } from 'utils/errors'
import { getUserCredentials } from 'utils/identity/identityProvider'

import { createUserCredentials } from '@/components/RegistrationForm'

import { DfnsAPI } from './clients/dfnsApi'
import {
  ActivateApplicationInput,
  ActivateCredentialInput,
  ActivateUserInput,
  ArchivePermissionInput,
  CreateAppInput,
  CreateAvailableOrgListInput,
  CreateClusterBody,
  CreateOrgInput,
  CreatePermissionInput,
  CreateServiceAccountWithPublicKeyInput,
  CreateUserCredentialChallengeInput,
  CreateUserCredentialInput,
  CreateUserInput,
  LoginUserInput,
  RecoverUserInput,
  RegisterUserInput,
  ResendEmailInput,
  SendRecoveryEmailInput,
  UpdateClusterBody,
  UpdateOrgInput,
  UpdatePermissionInput,
} from './clients/dfnsApi/types'
import { ApiEndpoint, ApiRequestBody, ApiRequestParams, ApiRequestResult } from './constants'

const NEXT_PUBLIC_API_URL = getEnvVarOrThrow('NEXT_PUBLIC_API_URL')
const NEXT_PUBLIC_APP_ID = getEnvVarOrThrow('NEXT_PUBLIC_APP_ID')
const NEXT_PUBLIC_APP_RPID = getEnvVarOrThrow('NEXT_PUBLIC_APP_RPID')

type Options<A extends ApiEndpoint> = {
  params?: ApiRequestParams<A>
  body?: ApiRequestBody<A>
  successToast?: string
  skipErrorHandler?: boolean
}

function getParam(params: any, key: string): string | undefined {
  const value = params?.[key]
  return value
}

function getParamOrThrow(params: any, key: string, debug?: string): string {
  const value = getParam(params, key)

  if (!value) {
    throw Error(`key ${key} does not exist in passed params ${debug}`)
  }

  return value
}

const executeApiMethod = async <A extends ApiEndpoint>(
  endpoint: A,
  options: Pick<Options<A>, 'body' | 'params'> = {}
): Promise<ApiRequestResult<A>> => {
  const { params, body } = options

  const client = new DfnsAPI({
    customUrl: NEXT_PUBLIC_API_URL,
    appId: NEXT_PUBLIC_APP_ID,
    appOrigin: window.location.origin,
    appRelyingParty: NEXT_PUBLIC_APP_RPID,
    getUserCredentialsCallback: getUserCredentials,
    createUserCredentialsCallback: createUserCredentials,
  })

  let result: any = undefined

  switch (endpoint) {
    case ApiEndpoint.createPersonalAccessToken: {
      result = client.createPersonalAccessToken(body as CreateServiceAccountWithPublicKeyInput)
      break
    }
    case ApiEndpoint.listActivePersonalAccessTokens: {
      result = client.listActivePersonalAccessTokens()
      break
    }
    case ApiEndpoint.createServiceAccount: {
      result = client.createServiceAccount(body as CreateServiceAccountWithPublicKeyInput)
      break
    }
    case ApiEndpoint.getServiceAccount: {
      const id = getParamOrThrow(params, 'serviceAccountId', '1')
      result = client.getServiceAccount(id)
      break
    }
    case ApiEndpoint.listActiveServiceAccounts: {
      result = client.listActiveServiceAccounts()
      break
    }
    case ApiEndpoint.listServiceAccounts: {
      result = client.listServiceAccounts()
      break
    }
    case ApiEndpoint.activateServiceAccount: {
      const serviceAccountId = getParamOrThrow(params, 'serviceAccountId', '6')
      result = client.activateServiceAccount(serviceAccountId)
      break
    }
    case ApiEndpoint.deactivateServiceAccount: {
      const serviceAccountId = getParamOrThrow(params, 'serviceAccountId', '6')
      result = client.deactivateServiceAccount(serviceAccountId)
      break
    }
    case ApiEndpoint.activatePersonalAccessToken: {
      const serviceAccountId = getParamOrThrow(params, 'serviceAccountId', '6')
      result = client.activatePersonalAccessToken(serviceAccountId)
      break
    }
    case ApiEndpoint.deactivatePersonalAccessToken: {
      const serviceAccountId = getParamOrThrow(params, 'serviceAccountId', '6')
      result = client.deactivatePersonalAccessToken(serviceAccountId)
      break
    }
    case ApiEndpoint.listServiceAccountScopes: {
      result = client.listServiceAccountScopes()
      break
    }
    case ApiEndpoint.loginUser: {
      const { username, orgId } = body as LoginUserInput
      result = client.login(username, orgId)
      break
    }
    case ApiEndpoint.registerUser: {
      const { username, orgId, registrationCode } = body as RegisterUserInput
      result = client.register(username, orgId, registrationCode)
      break
    }
    case ApiEndpoint.logoutUser: {
      result = client.logout()
      break
    }
    case ApiEndpoint.listUsers: {
      const limit = getParam(params, 'limit')
      const kind = getParam(params, 'kind')
      result = client.listUsers({ limit, kind })
      break
    }
    case ApiEndpoint.listApplications: {
      result = client.listApplications()
      break
    }
    case ApiEndpoint.createUser: {
      const { email, kind, publicKey, externalId } = body as CreateUserInput
      result = client.createUser(email, kind, publicKey, externalId)
      break
    }
    case ApiEndpoint.getUser: {
      const id = getParamOrThrow(params, 'userId', '1')
      result = client.getUser(id)
      break
    }
    case ApiEndpoint.createApplication: {
      result = client.createApplication(body as CreateAppInput)
      break
    }
    case ApiEndpoint.getApplication: {
      const id = getParamOrThrow(params, 'appId', '1')
      result = client.getApplication(id)
      break
    }
    case ApiEndpoint.deactivateApplication: {
      result = client.deactivateApplication(body as ActivateApplicationInput)
      break
    }
    case ApiEndpoint.activateApplication: {
      result = client.activateApplication(body as ActivateApplicationInput)
      break
    }
    case ApiEndpoint.deactivateUser: {
      result = client.deactivateUser(body as ActivateUserInput)
      break
    }
    case ApiEndpoint.activateUser: {
      result = client.activateUser(body as ActivateUserInput)
      break
    }
    case ApiEndpoint.resendRegistrationCode: {
      result = client.resendRegistrationCode(body as ResendEmailInput)
      break
    }
    case ApiEndpoint.deactivateCredential: {
      result = client.deactivateCredential(body as ActivateCredentialInput)
      break
    }
    case ApiEndpoint.activateCredential: {
      result = client.activateCredential(body as ActivateCredentialInput)
      break
    }
    case ApiEndpoint.listUserCredentials: {
      result = client.listUserCredentials()
      break
    }
    case ApiEndpoint.createUserCredential: {
      result = client.createUserCredential(body as CreateUserCredentialInput)
      break
    }
    case ApiEndpoint.createUserCredentialChallenge: {
      result = client.createUserCredentialChallenge(body as CreateUserCredentialChallengeInput)
      break
    }
    case ApiEndpoint.createOrg: {
      result = client.createOrg(body as CreateOrgInput)
      break
    }
    case ApiEndpoint.listOrgs: {
      result = client.listOrgs()
      break
    }
    case ApiEndpoint.updateOrg: {
      result = client.updateOrg(body as UpdateOrgInput)
      break
    }
    case ApiEndpoint.createAvailableOrgList: {
      result = client.createAvailableOrgList(body as CreateAvailableOrgListInput)
      break
    }
    case ApiEndpoint.createPermissionAssignment: {
      const permissionId = getParamOrThrow(params, 'permissionId')
      result = client.createPermissionAssignment(permissionId, (body as any).identityId)
      break
    }
    case ApiEndpoint.deletePermissionAssignment: {
      const permissionId = getParamOrThrow(params, 'permissionId')
      const assignmentId = getParamOrThrow(params, 'assignmentId')
      result = client.deletePermissionAssignment(permissionId, assignmentId)
      break
    }
    case ApiEndpoint.sendUserRecoveryVerificationEmail: {
      result = client.sendUserRecoveryVerificationEmail(body as SendRecoveryEmailInput)
      break
    }
    case ApiEndpoint.recoverUser: {
      result = client.recoverUser(body as RecoverUserInput)
      break
    }
    case ApiEndpoint.listWallets: {
      const limit = getParam(params, 'limit')
      const paginationToken = getParam(params, 'paginationToken')
      result = client.listWallets({ limit, paginationToken })
      break
    }
    case ApiEndpoint.getWallet: {
      const id = getParamOrThrow(params, 'walletId', '1')
      result = client.getWallet(id)
      break
    }
    case ApiEndpoint.getWalletAssets: {
      const id = getParamOrThrow(params, 'walletId', '1')
      result = client.getWalletAssets(id)
      break
    }
    case ApiEndpoint.getWalletNfts: {
      const id = getParamOrThrow(params, 'walletId', '1')
      result = client.getWalletNfts(id)
      break
    }
    case ApiEndpoint.getWalletHistory: {
      const id = getParamOrThrow(params, 'walletId', '1')
      const network = getParamOrThrow(params, 'network') as BlockchainNetwork
      result = client.getWalletHistory(id, network)
      break
    }
    case ApiEndpoint.listWalletTransferRequests: {
      const id = getParamOrThrow(params, 'walletId', '1')
      result = client.listWalletTransferRequests(id)
      break
    }
    case ApiEndpoint.listWalletTransactionRequests: {
      const id = getParamOrThrow(params, 'walletId', '1')
      result = client.listWalletTransactionRequests(id)
      break
    }
    case ApiEndpoint.listWalletSignatureRequests: {
      const id = getParamOrThrow(params, 'walletId', '1')
      result = client.listWalletSignatureRequests(id)
      break
    }
    case ApiEndpoint.createWallet: {
      result = client.createWallet(body as CreateWalletBody)
      break
    }
    case ApiEndpoint.walletAssetTransfer: {
      const walletId = getParamOrThrow(params, 'walletId', '1')
      result = client.walletAssetTransfer(walletId, body as TransferAssetBody)
      break
    }
    case ApiEndpoint.generateWalletSignature: {
      const walletId = getParamOrThrow(params, 'walletId', '1')
      result = client.generateWalletSignature(walletId, body as GenerateSignatureBody)
      break
    }
    case ApiEndpoint.broadcastWalletTransaction: {
      const walletId = getParamOrThrow(params, 'walletId', '1')
      result = client.broadcastWalletTransaction(walletId, body as BroadcastTransactionBody)
      break
    }
    case ApiEndpoint.getWalletSignature: {
      const walletId = getParamOrThrow(params, 'walletId', '1')
      const signatureId = getParamOrThrow(params, 'signatureId', '2')
      result = client.getWalletSignature(walletId, signatureId)
      break
    }
    case ApiEndpoint.createPermission: {
      result = client.createPermission(body as CreatePermissionInput)
      break
    }
    case ApiEndpoint.updatePermission: {
      const permissionId = getParamOrThrow(params, 'permissionId', '1')
      result = client.updatePermission(permissionId, body as UpdatePermissionInput)
      break
    }
    case ApiEndpoint.getPermission: {
      const id = getParamOrThrow(params, 'permissionId', '1')
      result = client.getPermission(id)
      break
    }
    case ApiEndpoint.listPermissions: {
      result = client.listPermissions()
      break
    }
    case ApiEndpoint.archivePermission: {
      const permissionId = getParamOrThrow(params, 'permissionId', '1')
      result = client.archivePermission(permissionId, body as ArchivePermissionInput)
      break
    }
    case ApiEndpoint.staffListClusters: {
      result = client.staffListClusters()
      break
    }
    case ApiEndpoint.staffCreateCluster: {
      result = client.staffCreateCluster(body as CreateClusterBody)
      break
    }
    case ApiEndpoint.staffGetCluster: {
      const clusterId = getParamOrThrow(params, 'clusterId')
      result = client.staffGetCluster(clusterId)
      break
    }
    case ApiEndpoint.staffUpdateCluster: {
      const clusterId = getParamOrThrow(params, 'clusterId')
      result = client.staffUpdateCluster(clusterId, body as UpdateClusterBody)
      break
    }
    case ApiEndpoint.listPolicyApprovals: {
      const initiatorId = getParam(params, 'initiatorId')
      const approverId = getParam(params, 'approverId')
      const status = getParam(params, 'status')
      const triggerStatus = getParam(params, 'triggerStatus')
      result = client.listPolicyApprovals({ initiatorId, approverId, status, triggerStatus })
      break
    }
    case ApiEndpoint.createApprovalDecision: {
      const approvalId = getParamOrThrow(params, 'approvalId')
      result = client.createApprovalDecision(approvalId, body as any)
      break
    }
    case ApiEndpoint.listPolicies: {
      const status = getParam(params, 'status') as any
      result = client.listPolicies({ status })
      break
    }
    case ApiEndpoint.getPolicy: {
      const policyId = getParamOrThrow(params, 'policyId')
      result = client.getPolicy(policyId)
      break
    }
    case ApiEndpoint.archivePolicy: {
      const policyId = getParamOrThrow(params, 'policyId')
      result = client.archivePolicy(policyId)
      break
    }
    case ApiEndpoint.createPolicy: {
      result = client.createPolicy(body as any)
      break
    }
    case ApiEndpoint.updatePolicy: {
      const policyId = getParamOrThrow(params, 'policyId')
      result = client.updatePolicy(policyId, body as any)
      break
    }
    case ApiEndpoint.createUserAndOrg: {
      const email = (body as any)?.adminUser?.email || ''
      const recaptchaResponse = (body as any)?.recaptchaResponse || ''
      const termsAndConditionsAccepted = (body as any)?.termsAndConditionsAccepted || ''
      const privacyPolicyAccepted = (body as any)?.privacyPolicyAccepted || ''
      result = client.createUserAndOrg(email, recaptchaResponse, termsAndConditionsAccepted, privacyPolicyAccepted)
      break
    }
    default: {
      throw Error('sendApiRequest: Unimplemented: ' + endpoint)
    }
  }
  return result
}

export const sendApiRequest = async <A extends ApiEndpoint>(
  endpoint: A,
  options: Options<A> = {}
): Promise<ApiRequestResult<A>> => {
  const { body, params, skipErrorHandler, successToast } = options

  try {
    const res = await executeApiMethod(endpoint, { params, body })
    !!successToast && toast.success(successToast)
    return res
  } catch (err) {
    !skipErrorHandler && errorHandler()(err)
    throw err
  }
}
