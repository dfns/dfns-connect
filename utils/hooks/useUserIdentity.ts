import { EntityId } from '@dfns/datamodel/dist/Foundations'
import { useMemo } from 'react'
import { LOCAL_STORAGE_TOKEN_KEY } from 'utils/misc'

export const useUserIdentity = (): AuthIdentity => {
  const identity = useMemo(() => {
    return getUserIdentity()
  }, [])

  return identity
}

export const getUserIdentity = (): AuthIdentity => {
  try {
    const apiToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || 'MISSING'
    const parsedJwt = parseJwt(apiToken)
    const identity = getIdentityFromToken(parsedJwt)
    return identity
  } catch (e) {
    return {
      username: '',
      orgId: '',
      employeeId: '',
      scope: '',
      permissions: [],
      settings: {
        adminPermissionName: 'DfnsFullAdminAccess',
        hasAccessToOrgManagement: false,
        hasAccessToStaffUsers: false,
      }
    }
  }
}

export type AuthIdentity = {
  orgId: EntityId
  employeeId: EntityId
  username: string
  scope: string
  permissions: string[]

  settings: {
    adminPermissionName: string
    hasAccessToOrgManagement: boolean
    hasAccessToStaffUsers: boolean
  }
}

type IdentityToken = {
  'https://custom/app_metadata': {
    orgId: string
    employeeId: string
    userId: string
  }
  'https://custom/username': string
  scope: string
  permissions: string[]
}

export const hasPermission = (permission: string, userIdentity: AuthIdentity): boolean => {
  return !!userIdentity && !!userIdentity.permissions && permissionInList(permission, userIdentity.permissions)
}

const permissionInList = (permission: string, permissions: string[]): boolean => {
  return !!permissions.find((perm) => perm === permission.toLowerCase())
}

const anyPermissionInList = (permissionsToFind: string[], assignedPermissions: string[]): boolean => {
  const permissionToFindList = permissionsToFind.map((perm) => perm.toLowerCase())
  return !!assignedPermissions.find((perm) => !!permissionToFindList.find((value) => value === perm))
}

export const getIdentityFromToken = (decodedToken: IdentityToken): AuthIdentity => {
  const permissions = (decodedToken.permissions || []).map((perm)=>perm.toLowerCase())
  const internalPermissions = [
    'internal:auth:orgs:read',
    'internal:auth:orgs:create',
    'internal:auth:utils',
    'internal:auth:types:staff',
  ]
  return {
    orgId: decodedToken['https://custom/app_metadata']['orgId'],
    employeeId: decodedToken['https://custom/app_metadata']['employeeId']
             || decodedToken['https://custom/app_metadata']['userId'],
    username: decodedToken['https://custom/username'],
    scope: '',
    permissions: permissions,
    settings: {
      adminPermissionName: anyPermissionInList(internalPermissions, permissions) ?
        'DfnsInternalFullAdminAccess' : 'DfnsFullAdminAccess',
      hasAccessToOrgManagement: permissionInList('internal:auth:orgs:read', permissions),
      hasAccessToStaffUsers: permissionInList('internal:auth:types:staff', permissions),
    }
  }
}

const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  const decodedPayload = JSON.parse(jsonPayload)
  if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
    throw new Error('User token has expired.')
  }
  return decodedPayload
}
