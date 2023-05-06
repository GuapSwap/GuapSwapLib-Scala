package blockchain

/**
  * Trait representing an abstract blockchain asset.
  */
trait BlockchainAsset {

  val _assetTicker: String
  val _assetId: String
  val _decimals: Int
  val _blockchain: Blockchain

}