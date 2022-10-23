package dex

/**
 * Class representing abstract dex blockchain assets.
 * @param blockchain The blockchain where the assets exists.
 */
abstract class DexBlockchainAssets(
                                    private val blockchain: Blockchain
                                  ) {
  def getBlockchain: Blockchain = this.blockchain

}
