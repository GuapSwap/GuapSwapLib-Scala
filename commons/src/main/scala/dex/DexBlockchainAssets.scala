package dex

import blockchain.{Blockchain, BlockchainAsset}

/**
 * Trait representing abstract dex blockchain assets.
 */
trait DexBlockchainAssets {

  protected var _dexBlockchain: Blockchain
  protected var _dexBlockchainAssets: List[BlockchainAsset]

}
