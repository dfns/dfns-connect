import { BlockchainNetwork } from '../../utils/blockchain/networks'

export const getNetworkExplorerTransactionUrl = (bk: BlockchainNetwork, txHash: string): string | undefined => {
  const getTxUrl = TRANSACTION_EXPLORERS_PER_BLOCKCHAIN_NETWORK[bk]

  if (!getTxUrl) return

  return getTxUrl(txHash)
}

export const getNetworkExplorerAddressUrl = (bk: BlockchainNetwork, address: string): string | undefined => {
  const getAddressUrl = ADDRESS_EXPLORERS_PER_BLOCKCHAIN_NETWORK[bk]

  if (!getAddressUrl) return

  return getAddressUrl(address)
}

const TRANSACTION_EXPLORERS_PER_BLOCKCHAIN_NETWORK: Record<BlockchainNetwork, (key: string) => string> = {
  [BlockchainNetwork.Algorand]: (tx) => `https://explorer.perawallet.app/tx/${tx}`,
  [BlockchainNetwork.AlgorandTestnet]: (tx) => `https://testnet.explorer.perawallet.app/tx/${tx}`,
  [BlockchainNetwork.ArbitrumOne]: (tx) => `https://arbiscan.io/tx/${tx}`,
  [BlockchainNetwork.ArbitrumGoerli]: (tx) => `https://goerli.arbiscan.io/tx/${tx}`,
  [BlockchainNetwork.ArbitrumSepolia]: (tx) => `https://sepolia.arbiscan.io/tx/${tx}`,
  [BlockchainNetwork.AvalancheC]: (tx) => `https://snowtrace.io/tx/${tx}`,
  [BlockchainNetwork.AvalancheCFuji]: (tx) => `https://testnet.snowtrace.io/tx/${tx}`,
  [BlockchainNetwork.Base]: (tx) => `https://basescan.org/tx/${tx}`,
  [BlockchainNetwork.BaseGoerli]: (tx) => `https://goerli.basescan.org/tx/${tx}`,
  [BlockchainNetwork.BaseSepolia]: (tx) => `https://sepolia.basescan.org/tx/${tx}`,
  [BlockchainNetwork.Bitcoin]: (tx) => `https://blockexplorer.one/bitcoin/mainnet/tx/${tx}`,
  [BlockchainNetwork.BitcoinTestnet3]: (tx) => `https://blockexplorer.one/bitcoin/testnet/tx/${tx}`,
  [BlockchainNetwork.Bsc]: (tx) => `https://bscscan.com/tx/${tx}`,
  [BlockchainNetwork.BscTestnet]: (tx) => `https://testnet.bscscan.com/tx/${tx}`,
  [BlockchainNetwork.Cardano]: (tx) => `https://beta.explorer.cardano.org/en/transaction/${tx}`,
  [BlockchainNetwork.CardanoPreprod]: (tx) => `https://preprod.beta.explorer.cardano.org/en/transaction/${tx}`,
  [BlockchainNetwork.Celo]: (tx) => `https://celoscan.io/tx/${tx}`,
  [BlockchainNetwork.CeloAlfajores]: (tx) => `https://alfajores.celoscan.io/tx/${tx}`,
  [BlockchainNetwork.Ethereum]: (tx) => `https://etherscan.io/tx/${tx}`,
  [BlockchainNetwork.EthereumGoerli]: (tx) => `https://goerli.etherscan.io/tx/${tx}`,
  [BlockchainNetwork.EthereumSepolia]: (tx) => `https://sepolia.etherscan.io/tx/${tx}`,
  [BlockchainNetwork.EthereumHolesky]: (tx) => `https://holesky.etherscan.io/tx/${tx}`,
  [BlockchainNetwork.FantomOpera]: (tx) => `https://ftmscan.com/tx/${tx}`,
  [BlockchainNetwork.FantomTestnet]: (tx) => `https://testnet.ftmscan.com/tx/${tx}`,
  [BlockchainNetwork.InternetComputer]: (tx) => `https://www.icpexplorer.org/#/tx/${tx}`,
  [BlockchainNetwork.Litecoin]: (tx) => `https://blockexplorer.one/litecoin/mainnet/tx/${tx}`,
  [BlockchainNetwork.LitecoinTestnet]: (tx) => `https://blockexplorer.one/litecoin/testnet/tx/${tx}`,
  [BlockchainNetwork.Kaspa]: (tx) => `https://explorer.kaspa.org/txs/${tx}`,
  [BlockchainNetwork.Kusama]: (tx) => `https://kusama.subscan.io/tx/${tx}`,
  [BlockchainNetwork.Optimism]: (tx) => `https://optimistic.etherscan.io//tx/${tx}`,
  [BlockchainNetwork.OptimismGoerli]: (tx) => `https://goerli-optimism.etherscan.io/tx/${tx}`,
  [BlockchainNetwork.OptimismSepolia]: (tx) => `https://sepolia-optimism.etherscan.io/tx/${tx}`,
  [BlockchainNetwork.Origyn]: (tx) => `https://dashboard.origyn.com/explorer/transactions/${tx}`,
  [BlockchainNetwork.Polkadot]: (tx) => `https://polkadot.subscan.io/tx/${tx}`,
  [BlockchainNetwork.Polygon]: (tx) => `https://polygonscan.com/tx/${tx}`,
  [BlockchainNetwork.PolygonMumbai]: (tx) => `https://mumbai.polygonscan.com/tx/${tx}`,
  [BlockchainNetwork.PolygonAmoy]: (tx) => `https://amoy.polygonscan.com/tx/${tx}`,
  [BlockchainNetwork.XrpLedger]: (tx) => `https://blockexplorer.one/xrp/mainnet/tx/${tx}`,
  [BlockchainNetwork.XrpLedgerTestnet]: (tx) => `https://blockexplorer.one/xrp/testnet/tx/${tx}`,
  [BlockchainNetwork.Race]: (tx) => `https://racescan.io/tx/${tx}`,
  [BlockchainNetwork.RaceSepolia]: (tx) => `https://testnet.racescan.io/tx/${tx}`,
  [BlockchainNetwork.SeiAtlantic2]: (tx) => `https://seitrace.com/tx/${tx}?chain=atlantic-2`,
  [BlockchainNetwork.SeiPacific1]: (tx) => `https://seitrace.com/tx/${tx}?chain=pacific-1`,
  [BlockchainNetwork.Solana]: (tx) => `https://explorer.solana.com/tx/${tx}`,
  [BlockchainNetwork.SolanaDevnet]: (tx) => `https://explorer.solana.com/tx/${tx}?cluster=devnet`,
  [BlockchainNetwork.Stellar]: (tx) => `https://stellarchain.io/transactions/${tx}`,
  [BlockchainNetwork.StellarTestnet]: (tx) => `https://testnet.stellarchain.io/transactions/${tx}`,
  [BlockchainNetwork.Tezos]: (tx) => `https://tzkt.io/${tx}`,
  [BlockchainNetwork.TezosGhostnet]: (tx) => `https://ghostnet.tzkt.io//#/transaction/${tx}`,
  [BlockchainNetwork.Ton]: (tx) => `https://tonscan.org/tx/${tx}`,
  [BlockchainNetwork.TonTestnet]: (tx) => `https://testnet.tonscan.org/tx/${tx}`,
  [BlockchainNetwork.Tron]: (tx) => `https://tronscan.org/#/transaction/${tx}`,
  [BlockchainNetwork.TronNile]: (tx) => `https://nile.tronscan.org/#/transaction/${tx}`,
  [BlockchainNetwork.Westend]: (tx) => `https://westend.subscan.io/tx/${tx}`,
  [BlockchainNetwork.KeyECDSA]: (tx) => '',
  [BlockchainNetwork.KeyEdDSA]: (tx) => '',
  [BlockchainNetwork.KeyECDSAStark]: (tx) => '',
}

const ADDRESS_EXPLORERS_PER_BLOCKCHAIN_NETWORK: Record<BlockchainNetwork, (key: string) => string> = {
  [BlockchainNetwork.Algorand]: (address) => `https://explorer.perawallet.app/address/${address}`,
  [BlockchainNetwork.AlgorandTestnet]: (address) => `https://testnet.explorer.perawallet.app/address/${address}`,
  [BlockchainNetwork.ArbitrumOne]: (address) => `https://arbiscan.io/address/${address}`,
  [BlockchainNetwork.ArbitrumGoerli]: (address) => `https://goerli.arbiscan.io/address/${address}`,
  [BlockchainNetwork.ArbitrumSepolia]: (address) => `https://sepolia.arbiscan.io/address/${address}`,
  [BlockchainNetwork.AvalancheC]: (address) => `https://snowtrace.io/address/${address}`,
  [BlockchainNetwork.AvalancheCFuji]: (address) => `https://testnet.snowtrace.io/address/${address}`,
  [BlockchainNetwork.Base]: (address) => `https://basescan.org/address/${address}`,
  [BlockchainNetwork.BaseGoerli]: (address) => `https://goerli.basescan.org/address/${address}`,
  [BlockchainNetwork.BaseSepolia]: (address) => `https://sepolia.basescan.org/address/${address}`,
  [BlockchainNetwork.Bitcoin]: (address) => `https://blockexplorer.one/bitcoin/mainnet/address/${address}`,
  [BlockchainNetwork.BitcoinTestnet3]: (address) => `https://blockexplorer.one/bitcoin/testnet/address/${address}`,
  [BlockchainNetwork.Bsc]: (address) => `https://bscscan.com/address/${address}`,
  [BlockchainNetwork.BscTestnet]: (address) => `https://testnet.bscscan.com/address/${address}`,
  [BlockchainNetwork.Cardano]: (address) => `https://beta.explorer.cardano.org/en/address/${address}`,
  [BlockchainNetwork.CardanoPreprod]: (address) => `https://preprod.beta.explorer.cardano.org/en/address/${address}`,
  [BlockchainNetwork.Celo]: (address) => `https://celoscan.io/address/${address}`,
  [BlockchainNetwork.CeloAlfajores]: (address) => `https://alfajores.celoscan.io/address/${address}`,
  [BlockchainNetwork.Ethereum]: (address) => `https://etherscan.io/address/${address}`,
  [BlockchainNetwork.EthereumGoerli]: (address) => `https://goerli.etherscan.io/address/${address}`,
  [BlockchainNetwork.EthereumSepolia]: (address) => `https://sepolia.etherscan.io/address/${address}`,
  [BlockchainNetwork.EthereumHolesky]: (address) => `https://holesky.etherscan.io/address/${address}`,
  [BlockchainNetwork.FantomOpera]: (address) => `https://ftmscan.com/address/${address}`,
  [BlockchainNetwork.FantomTestnet]: (address) => `https://testnet.ftmscan.com/address/${address}`,
  [BlockchainNetwork.InternetComputer]: (address) => `https://www.icpexplorer.org/#/acct/${address}`,
  [BlockchainNetwork.Litecoin]: (address) => `https://blockexplorer.one/litecoin/mainnet/address/${address}`,
  [BlockchainNetwork.LitecoinTestnet]: (address) => `https://blockexplorer.one/litecoin/testnet/address/${address}`,
  [BlockchainNetwork.Kaspa]: (address) => `https://explorer.kaspa.org/addresses/${address}`,
  [BlockchainNetwork.Kusama]: (address) => `https://kusama.subscan.io/account/${address}`,
  [BlockchainNetwork.Optimism]: (address) => `https://optimistic.etherscan.io//address/${address}`,
  [BlockchainNetwork.OptimismGoerli]: (address) => `https://goerli-optimism.etherscan.io/address/${address}`,
  [BlockchainNetwork.OptimismSepolia]: (address) => `https://sepolia-optimism.etherscan.io/address/${address}`,
  [BlockchainNetwork.Polkadot]: (address) => `https://polkadot.subscan.io/account/${address}`,
  [BlockchainNetwork.Polygon]: (address) => `https://polygonscan.com/address/${address}`,
  [BlockchainNetwork.PolygonMumbai]: (address) => `https://mumbai.polygonscan.com/address/${address}`,
  [BlockchainNetwork.PolygonAmoy]: (address) => `https://amoy.polygonscan.com/address/${address}`,
  [BlockchainNetwork.Origyn]: (address) => `https://dashboard.origyn.com/explorer/transactions/accounts/${address}`,
  [BlockchainNetwork.XrpLedger]: (address) => `https://blockexplorer.one/xrp/mainnet/address/${address}`,
  [BlockchainNetwork.XrpLedgerTestnet]: (address) => `https://blockexplorer.one/xrp/testnet/address/${address}`,
  [BlockchainNetwork.Race]: (address) => `https://racescan.io/address/${address}`,
  [BlockchainNetwork.RaceSepolia]: (address) => `https://testnet.racescan.io/address/${address}`,
  [BlockchainNetwork.SeiAtlantic2]: (address) => `https://seitrace.com/address/${address}?chain=atlantic-2`,
  [BlockchainNetwork.SeiPacific1]: (address) => `https://seitrace.com/address/${address}?chain=pacific-1`,
  [BlockchainNetwork.Solana]: (address) => `https://explorer.solana.com/address/${address}`,
  [BlockchainNetwork.SolanaDevnet]: (address) => `https://explorer.solana.com/address/${address}?cluster=devnet`,
  [BlockchainNetwork.Stellar]: (address) => `https://stellarchain.io/accounts/${address}`,
  [BlockchainNetwork.StellarTestnet]: (address) => `https://testnet.stellarchain.io/accounts/${address}`,
  [BlockchainNetwork.Tezos]: (address) => `https://tzkt.io/${address}`,
  [BlockchainNetwork.TezosGhostnet]: (address) => `https://ghostnet.tzkt.io/${address}`,
  [BlockchainNetwork.Ton]: (address) => `https://tonscan.org/address/${address}`,
  [BlockchainNetwork.TonTestnet]: (address) => `https://testnet.tonscan.org/address/${address}`,
  [BlockchainNetwork.Tron]: (address) => `https://tronscan.org/#/address/${address}`,
  [BlockchainNetwork.TronNile]: (address) => `https://nile.tronscan.org/#/address/${address}`,
  [BlockchainNetwork.Westend]: (address) => `https://westend.subscan.io/account/${address}`,
  [BlockchainNetwork.KeyECDSA]: (address) => '',
  [BlockchainNetwork.KeyEdDSA]: (address) => '',
  [BlockchainNetwork.KeyECDSAStark]: (address) => '',
}
