package blockchain

/**
  * Trait representing an abstract blockchain asset.
  */
trait BlockchainAsset {

  var _assetTicker: String
  var _assetId: String
  var _decimals: Int
  var _blockchain: Blockchain

}