package dex

import blockchain.{Blockchain, BlockchainAsset}

/**
 * Trait representing abstract dex blockchain assets.
 */
trait DexBlockchainAssets {

  var _dexBlockchain: Blockchain
  var _dexBlockchainAssets: List[BlockchainAsset]

}
