package dex

import blockchain.{Blockchain, BlockchainAsset}

/**
 * Trait representing abstract dex blockchain assets.
 */
trait DexBlockchainAssets {

  protected val _blockchain: Blockchain
  protected val _dexBlockchainAssets: List[BlockchainAsset]

  /**
   * Get the blockchain which the tokens exist on.
   * @return
   */
  def blockchain: Blockchain = _blockchain

  /**
   * Get the dex blockchain assets.
   * @return
   */
  def dexBlockchainAssets: List[BlockchainAsset] = _dexBlockchainAssets

}
