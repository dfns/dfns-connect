import { T } from './translations'

export type Route =
  | 'onboarding'
  | 'register'
  | 'login'
  | 'recover'
  | 'createCredWithCode'
  | 'home'
  | 'payment'
  | 'publicKeys'
  | 'publicKeyNew'
  | 'exchangeAccountAssets'
  | 'exchangeAccounts'
  | 'exchanges'
  | 'settings'
  | 'settingsServiceAccounts'
  | 'settingsServiceAccount'
  | 'settingsServiceAccountNew'
  | 'settingsAccount'
  | 'settingsOrgs'
  | 'settingsOrgNew'
  | 'settingsClusters'
  | 'settingsClusterNew'
  | 'settingsCluster'
  | 'settingsClusterUpdate'
  | 'settingsQueues'
  | 'settingsQueueMessages'
  | 'settingsUsers'
  | 'settingsUser'
  | 'settingsUserNew'
  | 'settingsApps'
  | 'settingsApp'
  | 'settingsAppNew'
  | 'settingsPersonalAccessTokens'
  | 'settingsPersonalAccessTokenNew'
  | 'settingsCredentials'
  | 'settingsCredentialNew'
  | 'settingsRecoveryCredentials'
  | 'settingsRecoveryCredentialNew'
  | 'policyApprovals'
  | 'wallets'
  | 'wallet'
  | 'walletNew'
  | 'walletTier3KleverView'
  | 'settingsPermissions'
  | 'settingsPermission'
  | 'settingsPermissionNew'
  | 'settingsLegacyPolicyRules'
  | 'settingsLegacyPolicyRule'
  | 'settingsLegacyPolicyControls'
  | 'settingsLegacyPolicyControl'
  | 'settingsLegacyPolicies'
  | 'settingsLegacyPolicy'
  | 'settingsSocialLogin'
  | 'settingsExchanges'
  | 'settingsExchangeNew'
  | 'policies'
  | 'policy'
  | 'policyModify'
  | 'policyNew'
  | 'settingsGenerateEnv'
  | 'settingsWebhooks'
  | 'settingsWebhook'
  | 'settingsWebhookUpdate'
  | 'settingsWebhookNew'
  | 'settingsAml'

export type RouteParam =
  | { walletId: string }
  | { permissionId: string }
  | { orgId: string }
  | { userId: string }
  | { serviceAccountId: string }
  | { appId: string }
  | { policyId: string }
  | { webhookId: string }
  | { exchangeId: string }
  | { accountId: string }
  | { queueUrl: string }
  | never

export type RouteDetail = {
  href: string
  label: string
  isPublic?: boolean
}

export const ROUTES: Record<Route, RouteDetail> = {
  onboarding: {
    href: '/onboarding',
    label: 'Onboarding',
    isPublic: true,
  },
  register: {
    href: '/register',
    label: 'Register User',
    isPublic: true,
  },
  login: {
    href: '/login',
    label: 'User Login',
    isPublic: true,
  },
  createCredWithCode: {
    href: '/login/credentials/code',
    label: 'Create Credential with Code',
    isPublic: true,
  },
  recover: {
    href: '/recover',
    label: 'User Recovery',
    isPublic: true,
  },
  home: {
    href: '/',
    label: T.menu_item_home.en,
  },
  payment: {
    href: '/payment',
    label: 'Payment',
  },
  publicKeys: {
    href: '/public-keys',
    label: 'Public Keys',
  },
  publicKeyNew: {
    href: '/public-keys/new',
    label: 'New Public Key',
  },
  settings: {
    href: '/settings/account',
    label: 'Settings',
  },
  settingsServiceAccounts: {
    href: '/settings/service-accounts',
    label: 'Service Accounts',
  },
  settingsServiceAccount: {
    href: '/settings/service-accounts/[serviceAccountId]',
    label: 'Service Accounts',
  },
  settingsServiceAccountNew: {
    href: '/settings/service-accounts/new',
    label: 'New Service Accounts',
  },
  settingsAccount: {
    href: '/settings/account',
    label: 'My Account',
  },
  settingsOrgs: {
    href: '/settings/orgs',
    label: 'Orgs',
  },
  settingsOrgNew: {
    href: '/settings/orgs/new',
    label: 'New Org',
  },
  settingsClusters: {
    href: '/settings/clusters',
    label: 'Clusters',
  },
  settingsClusterNew: {
    href: '/settings/clusters/new',
    label: 'New Cluster',
  },
  settingsCluster: {
    href: '/settings/clusters/[clusterId]',
    label: 'Cluster',
  },
  settingsClusterUpdate: {
    href: '/settings/clusters/[clusterId]/update',
    label: 'Update Cluster',
  },
  settingsQueues: {
    href: '/settings/queues',
    label: 'Queues',
  },
  settingsQueueMessages: {
    href: '/settings/queues/[queueUrl]/messages',
    label: 'Queue Messages',
  },
  settingsUsers: {
    href: '/settings/users',
    label: 'Users',
  },
  settingsUser: {
    href: '/settings/users/[userId]',
    label: 'Users',
  },
  settingsUserNew: {
    href: '/settings/users/new',
    label: 'New User',
  },
  settingsPersonalAccessTokens: {
    href: '/settings/pats',
    label: 'My Access Tokens',
  },
  settingsPersonalAccessTokenNew: {
    href: '/settings/pats/new',
    label: 'New Personal Access Token',
  },
  settingsCredentials: {
    href: '/settings/credentials',
    label: 'My Credentials',
  },
  settingsCredentialNew: {
    href: '/settings/credentials/new',
    label: 'Add Credential',
  },
  settingsRecoveryCredentials: {
    href: '/settings/recovery-credentials',
    label: 'My Recovery Credentials',
  },
  settingsRecoveryCredentialNew: {
    href: '/settings/recovery-credentials/new',
    label: 'Add Recovery Credential',
  },
  settingsApps: {
    href: '/settings/apps',
    label: 'Applications',
  },
  settingsApp: {
    href: '/settings/apps/[appId]',
    label: 'Applications',
  },
  settingsAppNew: {
    href: '/settings/apps/new',
    label: 'New Application',
  },
  policyApprovals: {
    href: '/policies/approvals',
    label: 'Approvals',
  },
  exchanges: {
    href: '/exchanges',
    label: 'Exchanges',
  },
  exchangeAccounts: {
    href: '/exchanges/[exchangeId]/accounts',
    label: 'Exchange accounts',
  },
  exchangeAccountAssets: {
    href: '/exchanges/[exchangeId]/accounts/[accountId]/assets',
    label: 'Exchange account assets',
  },
  wallets: {
    href: '/wallets',
    label: 'Wallets',
  },
  wallet: {
    href: '/wallets/[walletId]',
    label: 'Wallet',
  },
  walletNew: {
    href: '/wallets/new',
    label: 'New Wallet',
  },
  walletTier3KleverView: {
    href: '/wallets/[walletId]/tier3/klever',
    label: 'Klever Wallet',
  },
  settingsPermissions: {
    href: '/settings/permissions',
    label: 'Permissions',
  },
  settingsPermission: {
    href: '/settings/permissions/[permissionId]',
    label: 'Permission',
  },
  settingsPermissionNew: {
    href: '/settings/permissions/new',
    label: 'New Permission',
  },
  settingsLegacyPolicyRules: {
    href: '/settings/legacy/policy-rules',
    label: 'Policy Rules',
  },
  settingsLegacyPolicyRule: {
    href: '/settings/legacy/policy-rules/[policyRuleId]',
    label: 'Policy Rule',
  },
  settingsLegacyPolicyControls: {
    href: '/settings/legacy/policy-controls',
    label: 'Policy Controls',
  },
  settingsLegacyPolicyControl: {
    href: '/settings/legacy/policy-controls/[policyControlId]',
    label: 'Policy Control',
  },
  settingsLegacyPolicies: {
    href: '/settings/legacy/policies',
    label: 'Policies',
  },
  settingsLegacyPolicy: {
    href: '/settings/legacy/policies/[policyId]',
    label: 'Policy',
  },
  settingsSocialLogin: {
    href: '/settings/social-login',
    label: 'Social Login',
  },
  settingsAml: {
    href: '/settings/aml',
    label: 'AML',
  },
  settingsExchanges: {
    href: '/settings/exchanges',
    label: 'Exchanges',
  },
  settingsExchangeNew: {
    href: '/settings/exchanges/new',
    label: 'New Exchange',
  },
  policies: {
    href: '/policies',
    label: 'Policies',
  },
  policy: {
    href: '/policies/[policyId]',
    label: 'Policy',
  },
  policyModify: {
    href: '/policies/[policyId]/modify',
    label: 'Modify policy',
  },
  policyNew: {
    href: '/policies/new',
    label: 'New Policy',
  },
  settingsGenerateEnv: {
    href: '/settings/utilities/generateEnv',
    label: 'Generate .env Template',
  },
  settingsWebhooks: {
    href: '/settings/webhooks',
    label: 'Webhooks',
  },
  settingsWebhookNew: {
    href: '/settings/webhooks/new',
    label: 'New Webhook',
  },
  settingsWebhook: {
    href: '/settings/webhooks/[webhookId]',
    label: 'Webhook',
  },
  settingsWebhookUpdate: {
    href: '/settings/webhooks/[webhookId]/update',
    label: 'Update Webhook',
  },
}

export const getRoutePath = (route: Route, params?: RouteParam): string => {
  let href = new String(ROUTES[route].href).toString()

  for (const [key, value] of Object.entries(params || {})) {
    const regexp = new RegExp(`\\[${key}\\]`)
    href = href.replace(regexp, value)
  }

  return href
}
