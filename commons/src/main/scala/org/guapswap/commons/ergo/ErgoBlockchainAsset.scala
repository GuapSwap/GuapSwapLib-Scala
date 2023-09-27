package org.guapswap.commons.ergo

import org.ergoplatform.appkit.ErgoId

/**
 * Object representing an asset existing on the Ergo blockchain.
 * @param assetTicker The ticker found on dex listings.
 * @param assetId     The token identifier for the asset.
 * @param decimals    The amount of decimals required for the token.
 */
case class ErgoBlockchainAsset(
                                assetTicker: String,
                                assetId: String,
                                decimals: Int
                              ) {

  val _assetTicker: String = assetTicker
  val _assetId: String = assetId
  val _decimals: Int = decimals

  def getAssetIdAsErgoId: ErgoId = {
    ErgoId.create(_assetId)
  }
}
