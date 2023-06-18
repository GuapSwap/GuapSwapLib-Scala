package dex

/**
 * Trait for an abstract Dex object.
 */
trait Dex {

  var _dexName: String
  var _dexAssets: DexAssets
  var _dexPools: DexPools

  def getPoolFromAssetTicker(assetTicker: String): DexPool

}