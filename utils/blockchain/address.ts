import { BlockchainNetwork } from '../../utils/blockchain/networks'

const blockchainAddressRegExps: Record<string, string | undefined> = {
  Algorand: '[A-Z0-9]{58}',
  Bitcoin: '(([13]|[mn2])[a-km-zA-HJ-NP-Z1-9]{25,34}|(bc1|tb1)[ac-hj-np-z02-9]{39,59})',
  Cosmos: '[a-z0-9]{1,83}1[02-9ac-hj-np-z]{38}',
  Ethereum: '0x[a-fA-F0-9]{40}',
  Solana: '[1-9A-HJ-NP-Za-km-z]{32,44}',
  Stellar: '(G[A-Z0-9]{55}|M[A-Z0-9]{68})',
  Tezos: '[Tt][A-Za-z0-9]{35}',
  Ton: '^(?:[A-Za-z0-9-_]{48}|d+:[a-fA-F0-9]{64})',
  Tron: 'T[A-Za-z1-9]{33}',
  Xrpl: 'r[0-9a-zA-Z]{33}',
  //BCH: '((bitcoincash|bchreg|bchtest):)?(q|p)[a-z0-9]{41}',
  //DASH: 'X[1-9A-HJ-NP-Za-km-z]{33}',
  //XMR: '4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}',
  //NEO: 'A[0-9a-zA-Z]{33}',
}

export const blockchainNetworkAddressRegEx = (network: BlockchainNetwork): RegExp => {
  const regexpStr = getBlockchainAddressRegExp(network)

  if (!regexpStr) {
    return RegExp('[sS]*')
  }
  return new RegExp(`^${regexpStr}$`)
}

export const validateBlockchainNetworkAddress = (network: BlockchainNetwork, address: string): boolean => {
  const regexpStr = blockchainAddressRegExps[network]

  if (!regexpStr) {
    return true
  }

  const addressTrimmed = address.trim()

  return new RegExp(`^${regexpStr}$`).test(addressTrimmed)
}

export const getBlockchainAddressRegExp = (network: BlockchainNetwork): string | undefined => {
  switch (network) {
    case BlockchainNetwork.Algorand:
    case BlockchainNetwork.AlgorandTestnet:
      return blockchainAddressRegExps.Algorand
    case BlockchainNetwork.Bitcoin:
    case BlockchainNetwork.BitcoinTestnet3:
      return blockchainAddressRegExps.Bitcoin
    case BlockchainNetwork.SeiAtlantic2:
    case BlockchainNetwork.SeiPacific1:
      return blockchainAddressRegExps.Cosmos
    case BlockchainNetwork.Ethereum:
    case BlockchainNetwork.EthereumGoerli:
    case BlockchainNetwork.EthereumSepolia:
    case BlockchainNetwork.EthereumHolesky:
    case BlockchainNetwork.ArbitrumOne:
    case BlockchainNetwork.ArbitrumSepolia:
    case BlockchainNetwork.AvalancheC:
    case BlockchainNetwork.AvalancheCFuji:
    case BlockchainNetwork.Base:
    case BlockchainNetwork.BaseSepolia:
    case BlockchainNetwork.Bsc:
    case BlockchainNetwork.BscTestnet:
    case BlockchainNetwork.Celo:
    case BlockchainNetwork.CeloAlfajores:
    case BlockchainNetwork.FantomOpera:
    case BlockchainNetwork.FantomTestnet:
    case BlockchainNetwork.Optimism:
    case BlockchainNetwork.OptimismSepolia:
    case BlockchainNetwork.Polygon:
    case BlockchainNetwork.PolygonAmoy:
    case BlockchainNetwork.Race:
    case BlockchainNetwork.RaceSepolia:
      return blockchainAddressRegExps.Ethereum
    case BlockchainNetwork.Stellar:
    case BlockchainNetwork.StellarTestnet:
      return blockchainAddressRegExps.Stellar
    case BlockchainNetwork.Solana:
    case BlockchainNetwork.SolanaDevnet:
      return blockchainAddressRegExps.Solana
    case BlockchainNetwork.Tezos:
    case BlockchainNetwork.TezosGhostnet:
      return blockchainAddressRegExps.Tezos
    case BlockchainNetwork.Ton:
    case BlockchainNetwork.TonTestnet:
      return blockchainAddressRegExps.Ton
    case BlockchainNetwork.Tron:
    case BlockchainNetwork.TronNile:
      return blockchainAddressRegExps.Tron
    case BlockchainNetwork.XrpLedger:
    case BlockchainNetwork.XrpLedgerTestnet:
      return blockchainAddressRegExps.Xrpl
    case BlockchainNetwork.KeyECDSA:
    case BlockchainNetwork.KeyEdDSA:
    case BlockchainNetwork.KeyECDSAStark:
    default:
      return undefined
  }
}

export const getBlockchainExampleAddress = (network: BlockchainNetwork): string | undefined => {
  if (BlockchainNetwork.Bitcoin === network) return 'bc1qydad3w30lkvj7m4u02ec3emlqr7g05wf5456q3'
  if (BlockchainNetwork.BitcoinTestnet3 === network) return 'tb1qydad3w30lkvj7m4u02ec3emlqr7g05wf5456q3'
  return '0x29D7d1dd5C6f9C864d9db560F72a247c178aE86B'
}
