package org.guapswap.commons.dex

/**
 * Trait for an abstract Dex object.
 */
trait Dex {

  val _dexName: String
  val _dexAssets: DexAssets
  val _dexPools: DexPools

  def getPoolFromAssetTicker(assetTicker: String): DexPool

}