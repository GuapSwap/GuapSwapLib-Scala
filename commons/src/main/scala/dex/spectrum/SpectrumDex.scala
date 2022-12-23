package dex.spectrum

import blockchain.cardano.CardanoBlockchainAssets
import blockchain.ergo.ErgoBlockchainAssets
import blockchain.{Blockchain, Cardano, Ergo}
import dex.{Dex, DexBlockchainAssets}

/**
 * Object representing Spectrum dex.
 */
case object SpectrumDex extends Dex {

  _dexName = "Spectrum Dex"
  _dexBlockchains = List(Ergo, Cardano)
  _dexAssets = Map((Ergo, SpectrumErgoAssets), (Cardano, SpectrumCardanoAssets))
  _isMultiChain = true

}