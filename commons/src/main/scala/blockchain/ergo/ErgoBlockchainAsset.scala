package blockchain.ergo

import blockchain.{Blockchain, BlockchainAsset, Ergo}

/**
 * Object representing an asset existing on the Ergo blockchain.
 * @param _assetTicker The ticker found on dex listings.
 * @param _assetId     The token identifier for the asset.
 * @param _decimals    The amount of decimals required for the token.
 */
case class ErgoBlockchainAsset(
                                assetTicker: String,
                                assetId: String,
                                decimals: Int
                              ) extends BlockchainAsset {

  override val _assetTicker: String = assetTicker
  override val _assetId: String = assetId
  override val _decimals: Int = decimals
  override val _blockchain: Blockchain = Ergo

}
