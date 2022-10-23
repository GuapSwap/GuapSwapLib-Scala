package blockchain.cardano

import blockchain.{BlockchainAsset, Cardano}

/**
 * Object representing an asset existing on the Cardano blockchain.
 * @param assetTicker The ticker found on dex listings.
 * @param assetId     The token identifier for the asset.
 * @param decimals    The amount of decimals required for the token.
 */
case class CardanoBlockchainAsset(
                                private val assetTicker: String,
                                private val assetId: String,
                                private val decimals: Int,
                              ) extends BlockchainAsset(assetTicker = assetTicker, assetId = assetId, decimals = decimals, blockchain = Cardano)
