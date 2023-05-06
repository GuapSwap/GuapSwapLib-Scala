package dex.spectrum.blockchains.cardano

import dex.DexBlockchainAssets
import blockchain.{Blockchain, Cardano}

/**
 * Object representing the Cardano assets available on Spectrum dex.
 */
case object SpectrumCardanoAssets extends DexBlockchainAssets {
  override val _dexBlockchain: Blockchain = Cardano
}
