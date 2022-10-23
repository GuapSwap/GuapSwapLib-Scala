package dex.spectrum

import dex.DexBlockchainAssets

import blockchain.Cardano
import blockchain.cardano._

/**
 * Object representing the Cardano assets available on Spectrum dex.
 */
case object SpectrumCardanoAssets extends DexBlockchainAssets(Cardano) {
  protected val dexBlockchainAssets: List[CardanoBlockchainAsset] = List(
    CardanoBlockchainAssets.ADA
  )
}
