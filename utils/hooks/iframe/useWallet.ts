import { DfnsApiClient } from '@dfns/sdk'
import { CreateWalletResponse, ListWalletsResponse } from '@dfns/sdk/generated/wallets'
import { GenerateSignatureBody } from '@dfns/sdk/generated/wallets/types'
import * as T from '@dfns/sdk/generated/wallets/types'
import { WebAuthnSigner } from '@dfns/sdk-browser'

import { useSignerStore } from '@/store/iframe'

import { BlockchainNetwork } from '../../blockchain/networks'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`
const webauthn = new WebAuthnSigner()

export const useWallet = () => {
  const { getAppEntry, currentIdentifier } = useSignerStore()
  const currentApp = getAppEntry(currentIdentifier)
  const appId = currentApp?.appId || ''

  const getDfnsClient = (userAuthToken: string) => {
    return new DfnsApiClient({
      appId,
      authToken: userAuthToken,
      baseUrl: `https://${BASE_URL}`,
      signer: webauthn,
    })
  }

  const createWallet = async (
    networkId: BlockchainNetwork,
    walletName: string,
    userAuthToken: string
  ): Promise<CreateWalletResponse> => {
    try {
      const dfnsClient = getDfnsClient(userAuthToken)
      const body = {
        network: networkId,
        name: walletName,
      }
      const wallet = await dfnsClient.wallets.createWallet({ body })
      return wallet as CreateWalletResponse
    } catch (e) {
      throw e
    }
  }

  const listUserWallets = async (userAuthToken: string): Promise<ListWalletsResponse | null> => {
    try {
      const dfnsClient = getDfnsClient(userAuthToken)
      const wallets = await dfnsClient.wallets.listWallets()
      return wallets.items.length > 0 ? wallets : null
    } catch (e) {
      throw e
    }
  }

  const createWalletSignature = async (
    userAuthToken: string,
    walletId: string,
    transactionPayload: GenerateSignatureBody
  ): Promise<T.GenerateSignatureResponse> => {
    try {
      const dfnsClient = getDfnsClient(userAuthToken)
      return await dfnsClient.wallets.generateSignature({
        walletId,
        body: transactionPayload,
      })
    } catch (e) {
      throw e
    }
  }

  return { createWallet, listUserWallets, createWalletSignature }
}
