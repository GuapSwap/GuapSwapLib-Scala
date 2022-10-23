package blockchain.cardano

import blockchain.{BlockchainAsset, BlockchainAssets, Cardano}

/**
 * Object representing the assets available on the Cardano blockchain.
 */
case object CardanoBlockchainAssets extends BlockchainAssets {
  final val ADA: CardanoBlockchainAsset = CardanoBlockchainAsset("ADA", "0000000000000000000000000000000000000000000000000000000000000000", 9)
}
