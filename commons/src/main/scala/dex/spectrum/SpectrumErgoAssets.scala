package dex.spectrum

import dex.{DexBlockchainAssets, DexAsset, Ergo}

/**
 * Object representing the Ergo assets available on Spectrum dex.
 */
case object SpectrumErgoAssets extends DexBlockchainAssets(Ergo) {
  val SigUSD: DexAsset = DexAsset("SigUSD", "122334", 2, Ergo)
}
