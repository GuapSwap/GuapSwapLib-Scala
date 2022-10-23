package dex

import blockchain.{Blockchain, BlockchainAsset}

/**
 * Class representing abstract dex blockchain assets.
 *
 * @param blockchain The blockchain where the assets exists.
 */
abstract class DexBlockchainAssets(
                                    protected val blockchain: Blockchain
                                  ) {

  protected val dexBlockchainAssets: List[BlockchainAsset]

  /**
   * Get the blockchain which the tokens exist on.
   * @return
   */
  def getBlockchain: Blockchain = this.blockchain

  /**
   * Get the dex blockchain assets.
   * @return
   */
  def getDexBlockchainAssets: List[BlockchainAsset] = this.dexBlockchainAssets

}
