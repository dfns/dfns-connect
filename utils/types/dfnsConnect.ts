import { Fido2Attestation, UserRegistrationResponse } from '@dfns/sdk'
import { CreateWalletResponse, ListWalletsResponse } from '@dfns/sdk/generated/wallets'

export enum IframeActiveState {
  default = 'default',
  createUserAndWallet = 'createUserAndWallet',
  signTransaction = 'signTransaction',
  recoveryCodes = 'recoveryCodes',
  credentialsList = 'credentialsList',
  recoveryCredentialsList = 'recoveryCredentialsList',
  parentErrorMessage = 'parentErrorMessage',
  userWallet = 'userWallet',
  requestLogin = 'requestLogin',
  webauthnWaiting = 'webauthnWaiting',
  createPasskeyWaiting = 'createPasskeyWaiting',
  transactionWaiting = 'transactionWaiting',
  recover = 'recover',
}
export enum IframeActiveStateRoutes {
  default = 'no-action',
  createUserAndWallet = 'create-user-and-wallet',
  signTransaction = 'sign-transaction',
  recoveryCodes = 'recovery-codes',
  credentialsList = 'credentials-list',
  recoveryCredentialsList = 'recovery-credentials-list',
  parentErrorMessage = 'parent-error',
  userWallet = 'user-wallet',
  requestLogin = 'request-login',
  waiting = 'waiting',
  webauthnWaiting = 'webauthn-waiting',
  createPasskeyWaiting = 'create-passkey-waiting',
  transactionWaiting = 'transaction-waiting',
  recover = 'recover',
}

// internal dfns actions
export enum MessageActions {
  iframeReady = 'iframeReady',
  login = 'login',
  logout = 'logout',
  signRegisterInit = 'signRegisterInit',
  loginWithToken = 'loginWithToken',
  createWallet = 'createWallet',
  listWallets = 'listWallets',
  listUserCredentials = 'listUserCredentials',
  listUserRecoveryCredentials = 'listUserRecoveryCredentials',
  createAdditionalCredential = 'createAdditionalCredential',
  signWalletTransaction = 'signWalletTransaction',
  createUserAndWallet = 'createUserAndWallet',
  getCurrentUserInfo = 'getCurrentUserInfo',

  userWalletExists = 'userWalletExists',
  getAuthToken = 'getAuthToken',
  registerInit = 'registerInit',
  updateIframeScreenState = 'updateIframeScreenState',
  parentErrorMessage = 'parentErrorMessage',
}
// Actions internal to dfns action responses
export enum MessageActionsResponses {
  iframeReadySuccess = 'iframeReadySuccess',
  loginSuccess = 'loginSuccess',
  logoutSuccess = 'logoutSuccess',
  updateIframeScreenStateSuccess = 'updateIframeScreenStateSuccess',
  signRegisterInitSuccess = 'signRegisterInitSuccess',
  loginWithTokenSuccess = 'loginWithTokenSuccess',
  createWalletSuccess = 'createWalletSuccess',
  listUserCredentialsSuccess = 'listUserCredentialsSuccess',
  listUserRecoveryCredentialsSuccess = 'listUserRecoveryCredentialsSuccess',
  createAdditionalCredentialSuccess = 'createAdditionalCredentialSuccess',
  signWalletTransactionSuccess = 'signWalletTransactionSuccess',
  createUserAndWalletSuccess = 'createUserAndWalletSuccess',
  getCurrentUserInfoSuccess = 'getCurrentUserInfoSuccess',

  authToken = 'authToken',
  authenticated = 'authenticated',
  errorMessage = 'errorMessage',
  registered = 'registered',
  walletCreated = 'walletCreated',
  walletsList = 'walletsList',
}
// Actions where iframe parent might need to take action
export enum MessageParentActions {
  initUserRegister = 'initUserRegister',
  login = 'login',
  handleError = 'handleError',
  handleSignedTransaction = 'handleSignedTransaction',

  completeUserRegister = 'completeUserRegister',
  userLoginSuccess = 'userLoginSuccess',
  userLogoutSuccess = 'userLogoutSuccess',
  userLoginWithTokenComplete = 'userLoginWithTokenComplete',
  isWalletExists = 'isWalletExists',
  error = 'error',
}

export enum MessageParentActionsResponses {
  initUserRegisterSuccess = 'initUserRegisterSuccess',
  loginSuccess = 'loginSuccess',
  handleErrorSuccess = 'handleErrorSuccess',
  handleSignedTransactionSuccess = 'handleSignedTransactionSuccess',

  completeUserRegisterSuccess = 'completeUserRegisterSuccess',
  userLoginSuccess = 'userLoginSuccess',
  userLogoutSuccess = 'userLogoutSuccess',
  userLoginWithTokenCompleteSuccess = 'userLoginWithTokenCompleteSuccess',
  isWalletExistsSuccess = 'isWalletExistsSuccess',
  error = 'errorSuccess',
}
// TODO: expand
export enum UserInteractionTypes {
  sign = 'sign',
}

// TODO split into different payloads
export type MessageResponsePayload = {
  actionResponse?: MessageActionsResponses
  parentAction?: MessageParentActionsResponses
  userAuthToken?: string
  error?: Error
  errorMessage?: string
  signedRegisterInitChallenge?: UserRegistrationResponse
  userLoginResponse?: {
    token: string
  }
  userFromToken?: {
    id: string
    username: string
    orgId: string
  }
  signedChallenge?: Fido2Attestation
  createdWallet?: CreateWalletResponse
  walletId?: string
  userWallets?: ListWalletsResponse | null
  kind?: string
  showScreen?: IframeActiveState
  isWalletExists?: boolean
  userWalletAddress?: string
  isUserLoggedin?: boolean
  isUserCreatedSuccess?: boolean
  registration?: UserRegistrationResponse | undefined
}

export type Networks =
  | 'Algorand'
  | 'AlgorandTestnet'
  | 'ArbitrumOne'
  | 'ArbitrumSepolia'
  | 'AvalancheC'
  | 'AvalancheCFuji'
  | 'Base'
  | 'BaseSepolia'
  | 'Bitcoin'
  | 'BitcoinTestnet3'
  | 'Bsc'
  | 'BscTestnet'
  | 'Ethereum'
  | 'EthereumGoerli'
  | 'EthereumSepolia'
  | 'FantomOpera'
  | 'FantomTestnet'
  | 'InternetComputer'
  | 'Litecoin'
  | 'LitecoinTestnet'
  | 'Optimism'
  | 'OptimismSepolia'
  | 'Origyn'
  | 'Polygon'
  | 'PolygonAmoy'
  | 'PolygonMumbai'
  | 'Tron'
  | 'TronNile'
  | 'ArbitrumGoerli'
  | 'BaseGoerli'
  | 'Cardano'
  | 'CardanoPreprod'
  | 'Kusama'
  | 'OptimismGoerli'
  | 'Polkadot'
  | 'Westend'
  | 'Solana'
  | 'SolanaDevnet'
  | 'Stellar'
  | 'StellarTestnet'
  | 'Tezos'
  | 'TezosGhostnet'
  | 'Ton'
  | 'TonTestnet'
  | 'XrpLedger'
  | 'XrpLedgerTestnet'
  | 'KeyEdDSA'
  | 'KeyECDSA'
  | 'KeyECDSAStark'
