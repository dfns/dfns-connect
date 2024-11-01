import { BlockchainNetwork } from '../../utils/blockchain/networks'

export const SUPPORTED_NETWORKS_MAINNETS = [
  BlockchainNetwork.Algorand,
  BlockchainNetwork.ArbitrumOne,
  BlockchainNetwork.AvalancheC,
  BlockchainNetwork.Base,
  BlockchainNetwork.Bitcoin,
  BlockchainNetwork.Bsc,
  BlockchainNetwork.Cardano,
  BlockchainNetwork.Celo,
  BlockchainNetwork.Ethereum,
  BlockchainNetwork.FantomOpera,
  BlockchainNetwork.InternetComputer,
  BlockchainNetwork.Kaspa,
  BlockchainNetwork.Kusama,
  BlockchainNetwork.Litecoin,
  BlockchainNetwork.Optimism,
  BlockchainNetwork.Origyn,
  BlockchainNetwork.Polkadot,
  BlockchainNetwork.Polygon,
  BlockchainNetwork.Race,
  BlockchainNetwork.SeiPacific1,
  BlockchainNetwork.Solana,
  BlockchainNetwork.Stellar,
  BlockchainNetwork.Tezos,
  BlockchainNetwork.Ton,
  BlockchainNetwork.Tron,
  BlockchainNetwork.XrpLedger,
  BlockchainNetwork.KeyECDSA,
  BlockchainNetwork.KeyEdDSA,
  BlockchainNetwork.KeyECDSAStark,
]

export const SUPPORTED_NETWORKS_TESTNETS = [
  BlockchainNetwork.AlgorandTestnet,
  BlockchainNetwork.ArbitrumGoerli,
  BlockchainNetwork.ArbitrumSepolia,
  BlockchainNetwork.AvalancheCFuji,
  BlockchainNetwork.BaseGoerli,
  BlockchainNetwork.BaseSepolia,
  BlockchainNetwork.BitcoinTestnet3,
  BlockchainNetwork.BscTestnet,
  BlockchainNetwork.CardanoPreprod,
  BlockchainNetwork.CeloAlfajores,
  BlockchainNetwork.EthereumGoerli,
  BlockchainNetwork.EthereumSepolia,
  BlockchainNetwork.EthereumHolesky,
  BlockchainNetwork.FantomTestnet,
  BlockchainNetwork.OptimismGoerli,
  BlockchainNetwork.OptimismSepolia,
  BlockchainNetwork.PolygonMumbai,
  BlockchainNetwork.PolygonAmoy,
  BlockchainNetwork.RaceSepolia,
  BlockchainNetwork.SeiAtlantic2,
  BlockchainNetwork.SolanaDevnet,
  BlockchainNetwork.StellarTestnet,
  BlockchainNetwork.TezosGhostnet,
  BlockchainNetwork.TonTestnet,
  BlockchainNetwork.TronNile,
  BlockchainNetwork.Westend,
  BlockchainNetwork.XrpLedgerTestnet,
  BlockchainNetwork.KeyECDSA,
  BlockchainNetwork.KeyEdDSA,
  BlockchainNetwork.KeyECDSAStark,
]

export const TIER_1_SUPPORTED_NETWORKS = [
  BlockchainNetwork.Algorand,
  BlockchainNetwork.AlgorandTestnet,
  BlockchainNetwork.ArbitrumOne,
  BlockchainNetwork.ArbitrumSepolia,
  BlockchainNetwork.AvalancheC,
  BlockchainNetwork.AvalancheCFuji,
  BlockchainNetwork.Base,
  BlockchainNetwork.BaseSepolia,
  BlockchainNetwork.Bitcoin,
  BlockchainNetwork.BitcoinTestnet3,
  BlockchainNetwork.Bsc,
  BlockchainNetwork.BscTestnet,
  BlockchainNetwork.Celo,
  BlockchainNetwork.CeloAlfajores,
  BlockchainNetwork.Ethereum,
  BlockchainNetwork.EthereumSepolia,
  BlockchainNetwork.EthereumHolesky,
  BlockchainNetwork.FantomOpera,
  BlockchainNetwork.FantomTestnet,
  BlockchainNetwork.InternetComputer,
  BlockchainNetwork.Kaspa,
  BlockchainNetwork.Litecoin,
  BlockchainNetwork.Optimism,
  BlockchainNetwork.OptimismSepolia,
  BlockchainNetwork.Origyn,
  BlockchainNetwork.Polygon,
  BlockchainNetwork.PolygonAmoy,
  BlockchainNetwork.Race,
  BlockchainNetwork.RaceSepolia,
  BlockchainNetwork.SeiAtlantic2,
  BlockchainNetwork.SeiPacific1,
  BlockchainNetwork.Solana,
  BlockchainNetwork.SolanaDevnet,
  BlockchainNetwork.Stellar,
  BlockchainNetwork.StellarTestnet,
  BlockchainNetwork.Ton,
  BlockchainNetwork.TonTestnet,
  BlockchainNetwork.Tron,
  BlockchainNetwork.TronNile,
]

export const TIER_2_SUPPORTED_NETWORKS = [
  BlockchainNetwork.ArbitrumGoerli,
  BlockchainNetwork.BaseGoerli,
  BlockchainNetwork.Cardano,
  BlockchainNetwork.CardanoPreprod,
  BlockchainNetwork.EthereumGoerli,
  BlockchainNetwork.Kusama,
  BlockchainNetwork.OptimismGoerli,
  BlockchainNetwork.Polkadot,
  BlockchainNetwork.Tezos,
  BlockchainNetwork.TezosGhostnet,
  BlockchainNetwork.Westend,
  BlockchainNetwork.XrpLedger,
  BlockchainNetwork.XrpLedgerTestnet,
  BlockchainNetwork.KeyECDSA,
  BlockchainNetwork.KeyEdDSA,
  BlockchainNetwork.KeyECDSAStark,
]

export const SUPPORTED_NETWORKS = [
  BlockchainNetwork.Algorand,
  BlockchainNetwork.AlgorandTestnet,
  BlockchainNetwork.ArbitrumOne,
  BlockchainNetwork.ArbitrumGoerli,
  BlockchainNetwork.ArbitrumSepolia,
  BlockchainNetwork.AvalancheC,
  BlockchainNetwork.AvalancheCFuji,
  BlockchainNetwork.Base,
  BlockchainNetwork.BaseGoerli,
  BlockchainNetwork.BaseSepolia,
  BlockchainNetwork.Bitcoin,
  BlockchainNetwork.BitcoinTestnet3,
  BlockchainNetwork.Bsc,
  BlockchainNetwork.BscTestnet,
  BlockchainNetwork.Cardano,
  BlockchainNetwork.CardanoPreprod,
  BlockchainNetwork.Celo,
  BlockchainNetwork.CeloAlfajores,
  BlockchainNetwork.Ethereum,
  BlockchainNetwork.EthereumGoerli,
  BlockchainNetwork.EthereumSepolia,
  BlockchainNetwork.EthereumHolesky,
  BlockchainNetwork.FantomOpera,
  BlockchainNetwork.FantomTestnet,
  BlockchainNetwork.InternetComputer,
  BlockchainNetwork.Kaspa,
  BlockchainNetwork.Kusama,
  BlockchainNetwork.Litecoin,
  BlockchainNetwork.Optimism,
  BlockchainNetwork.OptimismGoerli,
  BlockchainNetwork.OptimismSepolia,
  BlockchainNetwork.Origyn,
  BlockchainNetwork.Polkadot,
  BlockchainNetwork.Polygon,
  BlockchainNetwork.PolygonMumbai,
  BlockchainNetwork.PolygonAmoy,
  BlockchainNetwork.Race,
  BlockchainNetwork.RaceSepolia,
  BlockchainNetwork.SeiAtlantic2,
  BlockchainNetwork.SeiPacific1,
  BlockchainNetwork.Solana,
  BlockchainNetwork.SolanaDevnet,
  BlockchainNetwork.Stellar,
  BlockchainNetwork.StellarTestnet,
  BlockchainNetwork.Tezos,
  BlockchainNetwork.TezosGhostnet,
  BlockchainNetwork.Ton,
  BlockchainNetwork.TonTestnet,
  BlockchainNetwork.Tron,
  BlockchainNetwork.TronNile,
  BlockchainNetwork.Westend,
  BlockchainNetwork.XrpLedger,
  BlockchainNetwork.XrpLedgerTestnet,
  BlockchainNetwork.KeyECDSA,
  BlockchainNetwork.KeyEdDSA,
  BlockchainNetwork.KeyECDSAStark,
]

export const NETWORKS_NOT_SUPPORTING_NFTS = [
  BlockchainNetwork.Bitcoin,
  BlockchainNetwork.BitcoinTestnet3,
  BlockchainNetwork.Cardano,
  BlockchainNetwork.CardanoPreprod,
  BlockchainNetwork.InternetComputer,
  BlockchainNetwork.Kaspa,
  BlockchainNetwork.Kusama,
  BlockchainNetwork.Litecoin,
  BlockchainNetwork.LitecoinTestnet,
  BlockchainNetwork.Origyn,
  BlockchainNetwork.Polkadot,
  BlockchainNetwork.SeiAtlantic2,
  BlockchainNetwork.SeiPacific1,
  BlockchainNetwork.Solana,
  BlockchainNetwork.SolanaDevnet,
  BlockchainNetwork.Stellar,
  BlockchainNetwork.StellarTestnet,
  BlockchainNetwork.Tezos,
  BlockchainNetwork.TezosGhostnet,
  BlockchainNetwork.Ton,
  BlockchainNetwork.TonTestnet,
  BlockchainNetwork.Westend,
  BlockchainNetwork.XrpLedger,
  BlockchainNetwork.XrpLedgerTestnet,
]

export const NFT_SUPPORTED_NETWORKS = SUPPORTED_NETWORKS.filter((n) => !NETWORKS_NOT_SUPPORTING_NFTS.includes(n))

export const WALLETCONNECT_SUPPORTED_NETWORKS = [
  BlockchainNetwork.ArbitrumOne,
  BlockchainNetwork.ArbitrumSepolia,
  BlockchainNetwork.AvalancheC,
  BlockchainNetwork.AvalancheCFuji,
  BlockchainNetwork.Base,
  BlockchainNetwork.BaseSepolia,
  BlockchainNetwork.Bsc,
  BlockchainNetwork.BscTestnet,
  BlockchainNetwork.Celo,
  BlockchainNetwork.CeloAlfajores,
  BlockchainNetwork.Ethereum,
  BlockchainNetwork.EthereumSepolia,
  BlockchainNetwork.EthereumHolesky,
  BlockchainNetwork.FantomOpera,
  BlockchainNetwork.FantomTestnet,
  BlockchainNetwork.Optimism,
  BlockchainNetwork.OptimismSepolia,
  BlockchainNetwork.Polygon,
  BlockchainNetwork.PolygonAmoy,
  BlockchainNetwork.Race,
  BlockchainNetwork.RaceSepolia,
]

export const NETWORKS_SUPPORTING_MEMO = [
  BlockchainNetwork.Stellar,
  BlockchainNetwork.StellarTestnet,
  BlockchainNetwork.Ton,
  BlockchainNetwork.TonTestnet,
  BlockchainNetwork.XrpLedger,
  BlockchainNetwork.XrpLedgerTestnet,
]

export type SupportedNetworks = (typeof SUPPORTED_NETWORKS)[number]

export const MOST_COMMON_NETWORKS = [BlockchainNetwork.Ethereum, BlockchainNetwork.Polygon] as const

export const MOST_COMMON_TESTNETS = [BlockchainNetwork.EthereumSepolia, BlockchainNetwork.PolygonAmoy] as const

export const getWalletNetwork = (network?: BlockchainNetwork): string => {
  if (!network) return ''
  const split = network.split('.')
  return split[split.length - 1] || ''
}

export const getWalletImageUrl = (network?: BlockchainNetwork): string => {
  if (!network) return ''
  const key = BlockchainNetwork_ICON_MAPPING[network]
  return key ? `/img/assets/icon/${key.toLowerCase()}.svg` : ''
}

export const getWalletColor = (network?: BlockchainNetwork): string => {
  if (!network) return ''
  const key = BlockchainNetwork_ICON_MAPPING[network]
  const detail = WALLET_ICONS[key]
  if (!detail) return ''
  return detail.color || '#000000'
}

export const BlockchainNetwork_ICON_MAPPING: Record<BlockchainNetwork, WalletIconSymbol> = {
  [BlockchainNetwork.Algorand]: 'Algorand',
  [BlockchainNetwork.AlgorandTestnet]: 'Algorand',
  [BlockchainNetwork.ArbitrumOne]: 'ArbitrumOne',
  [BlockchainNetwork.ArbitrumGoerli]: 'ArbitrumOne',
  [BlockchainNetwork.ArbitrumSepolia]: 'ArbitrumOne',
  [BlockchainNetwork.AvalancheC]: 'Avalanche',
  [BlockchainNetwork.AvalancheCFuji]: 'Avalanche',
  [BlockchainNetwork.Base]: 'Base',
  [BlockchainNetwork.BaseGoerli]: 'Base',
  [BlockchainNetwork.BaseSepolia]: 'Base',
  [BlockchainNetwork.Bitcoin]: 'Bitcoin',
  [BlockchainNetwork.BitcoinTestnet3]: 'Bitcoin',
  [BlockchainNetwork.Bsc]: 'Bsc',
  [BlockchainNetwork.BscTestnet]: 'Bsc',
  [BlockchainNetwork.Cardano]: 'Cardano',
  [BlockchainNetwork.CardanoPreprod]: 'Cardano',
  [BlockchainNetwork.Celo]: 'Celo',
  [BlockchainNetwork.CeloAlfajores]: 'Celo',
  [BlockchainNetwork.Ethereum]: 'Ethereum',
  [BlockchainNetwork.EthereumGoerli]: 'Ethereum',
  [BlockchainNetwork.EthereumSepolia]: 'Ethereum',
  [BlockchainNetwork.EthereumHolesky]: 'Ethereum',
  [BlockchainNetwork.FantomOpera]: 'FantomOpera',
  [BlockchainNetwork.FantomTestnet]: 'FantomOpera',
  [BlockchainNetwork.InternetComputer]: 'InternetComputer',
  [BlockchainNetwork.Litecoin]: 'Litecoin',
  [BlockchainNetwork.LitecoinTestnet]: 'Litecoin',
  [BlockchainNetwork.Kaspa]: 'Kaspa',
  [BlockchainNetwork.Kusama]: 'Kusama',
  [BlockchainNetwork.Optimism]: 'Optimism',
  [BlockchainNetwork.OptimismGoerli]: 'Optimism',
  [BlockchainNetwork.OptimismSepolia]: 'Optimism',
  [BlockchainNetwork.Origyn]: 'Origyn',
  [BlockchainNetwork.Polkadot]: 'Polkadot',
  [BlockchainNetwork.Polygon]: 'Polygon',
  [BlockchainNetwork.PolygonMumbai]: 'Polygon',
  [BlockchainNetwork.PolygonAmoy]: 'Polygon',
  [BlockchainNetwork.Race]: 'Race',
  [BlockchainNetwork.RaceSepolia]: 'Race',
  [BlockchainNetwork.SeiAtlantic2]: 'Sei',
  [BlockchainNetwork.SeiPacific1]: 'Sei',
  [BlockchainNetwork.Solana]: 'Solana',
  [BlockchainNetwork.SolanaDevnet]: 'Solana',
  [BlockchainNetwork.Stellar]: 'Stellar',
  [BlockchainNetwork.StellarTestnet]: 'Stellar',
  [BlockchainNetwork.Tezos]: 'Tezos',
  [BlockchainNetwork.TezosGhostnet]: 'Tezos',
  [BlockchainNetwork.Ton]: 'Ton',
  [BlockchainNetwork.TonTestnet]: 'Ton',
  [BlockchainNetwork.Tron]: 'Tron',
  [BlockchainNetwork.TronNile]: 'Tron',
  [BlockchainNetwork.Westend]: 'Polkadot',
  [BlockchainNetwork.XrpLedger]: 'XrpLedger',
  [BlockchainNetwork.XrpLedgerTestnet]: 'XrpLedger',
  [BlockchainNetwork.KeyECDSA]: 'KeyECDSA',
  [BlockchainNetwork.KeyEdDSA]: 'KeyEdDSA',
  [BlockchainNetwork.KeyECDSAStark]: 'KeyECDSAStark',
}

type WalletIconSymbol = keyof typeof WALLET_ICONS

export const WALLET_ICONS = {
  Algorand: {
    name: 'Algorand',
    color: '#627eea',
  },
  ArbitrumOne: {
    name: 'Arbitrum One',
    color: '#627eea',
  },
  Avalanche: {
    name: 'Avalanche C',
    color: '#627eea',
  },
  Base: {
    name: 'Arbitrum One',
    color: '#627eea',
  },
  Bitcoin: {
    name: 'Bitcoin',
    color: '#627eea',
  },
  Bsc: {
    name: 'Bsc',
    color: '#627eea',
  },
  Cardano: {
    name: 'Cardano',
    color: '#627eea',
  },
  Celo: {
    name: 'Celo',
    color: '#627eea',
  },
  Ethereum: {
    name: 'Ethereum',
    color: '#627eea',
  },
  FantomOpera: {
    name: 'Fantom Opera',
    color: '#627eea',
  },
  InternetComputer: {
    name: 'Internet Computer',
    color: '#627eea',
  },
  Kaspa: {
    name: 'Kaspa',
    color: '#627eea',
  },
  Kusama: {
    name: 'Kusama',
    color: '#627eea',
  },
  Litecoin: {
    name: 'Litecoin',
    color: '#627eea',
  },
  Optimism: {
    name: 'Optimism',
    color: '#627eea',
  },
  Origyn: {
    name: 'Origyn',
    color: '#627eea',
  },
  Polkadot: {
    name: 'Polkadot',
    color: '#627eea',
  },
  Polygon: {
    name: 'Polygon',
    color: '#627eea',
  },
  Race: {
    name: 'Race',
    color: '#627eea',
  },
  Sei: {
    name: 'Sei',
    color: '#627eea',
  },
  Solana: {
    name: 'Solana',
    color: '#627eea',
  },
  Stellar: {
    name: 'Stellar',
    color: '#627eea',
  },
  Tezos: {
    name: 'Tezos',
    color: '#2c7df7',
  },
  Ton: {
    name: 'Ton',
    color: '#627eea',
  },
  Tron: {
    name: 'Tron',
    color: '#627eea',
  },
  XrpLedger: {
    name: 'XrpLedger',
    color: '#627eea',
  },
  KeyECDSA: {
    name: 'KeyECDSA',
    color: '#627eea',
  },
  KeyECDSAStark: {
    name: 'KeyECDSAStark',
    color: '#627eea',
  },
  KeyEdDSA: {
    name: 'KeyEdDSA',
    color: '#627eea',
  },
  Testnet: {
    name: 'Testnet',
    color: '#627eea',
  },
}
