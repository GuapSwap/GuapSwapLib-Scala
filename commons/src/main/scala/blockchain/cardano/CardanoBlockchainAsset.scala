package blockchain.cardano

import blockchain.{BlockchainAsset, Cardano}

/**
 * Object representing an asset existing on the Cardano blockchain.
 * @param assetTicker The ticker found on dex listings.
 * @param assetId     The token identifier for the asset.
 * @param decimals    The amount of decimals required for the token.
 */
case class CardanoBlockchainAsset(
                                private val _assetTicker: String,
                                private val _assetId: String,
                                private val _decimals: Int,
                              ) extends BlockchainAsset(_assetTicker = _assetTicker, _assetId = _assetId, _decimals = _decimals, _blockchain = Cardano)
