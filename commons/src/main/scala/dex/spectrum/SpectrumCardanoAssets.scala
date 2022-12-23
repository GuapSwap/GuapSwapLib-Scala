package dex.spectrum

import dex.DexBlockchainAssets
import blockchain.{Blockchain, BlockchainAsset, Cardano}
import blockchain.cardano._

/**
 * Object representing the Cardano assets available on Spectrum dex.
 */
case object SpectrumCardanoAssets extends DexBlockchainAssets {
  _dexBlockchain = Cardano
  _dexBlockchainAssets = List(
    CardanoBlockchainAssets.ADA
  )
}
