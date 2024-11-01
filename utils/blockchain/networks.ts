export enum BlockchainNetwork {
  Algorand = 'Algorand',
  AlgorandTestnet = 'AlgorandTestnet',
  ArbitrumOne = 'ArbitrumOne',
  ArbitrumGoerli = 'ArbitrumGoerli',
  ArbitrumSepolia = 'ArbitrumSepolia',
  AvalancheC = 'AvalancheC',
  AvalancheCFuji = 'AvalancheCFuji',
  Base = 'Base',
  BaseGoerli = 'BaseGoerli',
  BaseSepolia = 'BaseSepolia',
  Bitcoin = 'Bitcoin',
  BitcoinTestnet3 = 'BitcoinTestnet3',
  Bsc = 'Bsc',
  BscTestnet = 'BscTestnet',
  Cardano = 'Cardano',
  CardanoPreprod = 'CardanoPreprod',
  Celo = 'Celo',
  CeloAlfajores = 'CeloAlfajores',
  Ethereum = 'Ethereum',
  EthereumGoerli = 'EthereumGoerli',
  EthereumSepolia = 'EthereumSepolia',
  EthereumHolesky = 'EthereumHolesky',
  FantomOpera = 'FantomOpera',
  FantomTestnet = 'FantomTestnet',
  InternetComputer = 'InternetComputer',
  Kaspa = 'Kaspa',
  Kusama = 'Kusama',
  Litecoin = 'Litecoin',
  LitecoinTestnet = 'LitecoinTestnet',
  Optimism = 'Optimism',
  OptimismGoerli = 'OptimismGoerli',
  OptimismSepolia = 'OptimismSepolia',
  Origyn = 'Origyn',
  Polkadot = 'Polkadot',
  Polygon = 'Polygon',
  PolygonAmoy = 'PolygonAmoy',
  PolygonMumbai = 'PolygonMumbai',
  Race = 'Race',
  RaceSepolia = 'RaceSepolia',
  SeiPacific1 = 'SeiPacific1',
  SeiAtlantic2 = 'SeiAtlantic2',
  Solana = 'Solana',
  SolanaDevnet = 'SolanaDevnet',
  Stellar = 'Stellar',
  StellarTestnet = 'StellarTestnet',
  Tezos = 'Tezos',
  TezosGhostnet = 'TezosGhostnet',
  Ton = 'Ton',
  TonTestnet = 'TonTestnet',
  Tron = 'Tron',
  TronNile = 'TronNile',
  Westend = 'Westend',
  XrpLedger = 'XrpLedger',
  XrpLedgerTestnet = 'XrpLedgerTestnet',
  KeyECDSA = 'KeyECDSA',
  KeyECDSAStark = 'KeyECDSAStark',
  KeyEdDSA = 'KeyEdDSA',
}
export enum AssetKind {
  Native = 'Native',
  Asa = 'Asa',
  Erc20 = 'Erc20',
  Spl = 'Spl',
  Spl2022 = 'Spl2022',
  Sep41 = 'Sep41',
  Trc10 = 'Trc10',
  Trc20 = 'Trc20',
  Tep74 = 'Tep74',
}

export declare type WalletAsset = {
  kind: AssetKind;
  assetId?: string;
  contract?: string;
  tokenId?: string;
  issuer?: string;
  assetCode?: string;
  mint?: string;
  master?: string;
  symbol?: string;
  decimals: number;
  verified?: boolean;
  balance: string;
};