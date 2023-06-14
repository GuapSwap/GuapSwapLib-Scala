package dex

import blockchain.{Blockchain, BlockchainAsset}

/**
 * Trait representing abstract dex blockchain assets.
 */
trait DexBlockchainAssets {

  val _dexBlockchain: Blockchain

}
