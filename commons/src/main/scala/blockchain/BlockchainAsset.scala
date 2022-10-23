package blockchain

/**
 * Class representing a blockchain asset.
 *
 * @param assetTicker The ticker found on dex listings.
 * @param assetId     The token identifier for the asset.
 * @param decimals    The amount of decimals required for the token.
 * @param blockchain  The blockchain where the token exists.
 */
abstract case class BlockchainAsset(
                            private val assetTicker: String,
                            private val assetId: String,
                            private val decimals: Int,
                            private val blockchain: Blockchain
                          ) {

  /**
   * Get the asset ticker.
   *
   * @return
   */
  def getAssetTicker: String = this.assetTicker

  /**
   * Get the asset id.
   *
   * @return
   */
  def getAssetID: String = this.assetId

  /**
   * Get the asset decimals.
   *
   * @return
   */
  def getDecimals: Int = this.decimals

  /**
   * Get the blockchain on which the asset exists.
   *
   * @return
   */
  def getBlockchain: Blockchain = this.blockchain
}
