package blockchain.ergo

import blockchain.{BlockchainAsset, Ergo}

/**
 * Object representing an asset existing on the Ergo blockchain.
 * @param _assetTicker The ticker found on dex listings.
 * @param _assetId     The token identifier for the asset.
 * @param _decimals    The amount of decimals required for the token.
 */
case class ErgoBlockchainAsset(
  private val assetTicker: String,
  private val assetId: String,
  private val decimals: Int,
) extends BlockchainAsset {

  _assetTicker = assetTicker
  _assetId = assetId
  _decimals = decimals
  _blockchain = Ergo

}
