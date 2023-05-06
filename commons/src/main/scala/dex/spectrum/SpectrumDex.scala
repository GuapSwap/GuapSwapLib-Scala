package dex.spectrum

import blockchain.{Blockchain, Cardano, Ergo}
import dex.{Dex, DexBlockchainAssets, DexPools}
import dex.spectrum.blockchains.cardano.SpectrumCardanoAssets
import dex.spectrum.blockchains.ergo.{SpectrumErgoAssets, SpectrumErgoPools}



/**
 * Object representing Spectrum dex.
 */
case object SpectrumDex extends Dex {

  override var _dexName: String = "Spectrum Dex"
  override var _dexBlockchains: List[Blockchain] = List(Ergo, Cardano)
  override var _dexAssets: Map[Blockchain, DexBlockchainAssets] = Map((Ergo, SpectrumErgoAssets), (Cardano, SpectrumCardanoAssets))
  override var _isMultiChain: Boolean = true
  override var _dexPools: Map[Blockchain, DexPools] = Map((Ergo, SpectrumErgoPools))

}