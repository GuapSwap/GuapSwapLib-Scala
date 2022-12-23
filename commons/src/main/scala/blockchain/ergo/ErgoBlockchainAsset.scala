package blockchain.ergo

import blockchain.{BlockchainAsset, Ergo}

/**
 * Object representing an asset existing on the Ergo blockchain.
 * @param _assetTicker The ticker found on dex listings.
 * @param _assetId     The token identifier for the asset.
 * @param _decimals    The amount of decimals required for the token.
 */
case class ErgoBlockchainAsset(
                                private val _assetTicker: String,
                                private val _assetId: String,
                                private val _decimals: Int,
                              ) extends BlockchainAsset(_assetTicker = _assetTicker, _assetId = _assetId, _decimals = _decimals, _blockchain = Ergo)
