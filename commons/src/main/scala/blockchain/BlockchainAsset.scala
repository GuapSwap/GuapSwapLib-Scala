package blockchain

/**
 * Class representing a blockchain asset.
 *
 * @param _assetTicker The ticker found on dex listings.
 * @param _assetId     The token identifier for the asset.
 * @param _decimals    The amount of decimals required for the token.
 * @param _blockchain  The blockchain where the token exists.
 */
case class BlockchainAsset(
                            private val _assetTicker: String,
                            private val _assetId: String,
                            private val _decimals: Int,
                            private val _blockchain: Blockchain
                          ) {

  /**
   * Get the asset ticker.
   * @return
   */
  def assetTicker: String = _assetTicker

  /**
   * Get the asset id.
   * @return
   */
  def assetID: String = _assetId

  /**
   * Get the asset decimals.
   * @return
   */
  def decimals: Int = _decimals

  /**
   * Get the blockchain on which the asset exists.
   * @return
   */
  def blockchain: Blockchain = _blockchain
}
