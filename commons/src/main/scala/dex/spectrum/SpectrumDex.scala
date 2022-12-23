package dex.spectrum

import blockchain.cardano.CardanoBlockchainAssets
import blockchain.ergo.ErgoBlockchainAssets
import blockchain.{Blockchain, Cardano, Ergo}
import dex.{Dex, DexBlockchainAssets}

/**
 * Object representing Spectrum dex.
 */
case object SpectrumDex extends Dex {
  override protected var _dexName: String = "Spectrum Dex"
  override protected val _dexBlockchains: List[Blockchain] = List(Ergo, Cardano)
  override protected val _dexAssets: Map[Blockchain, DexBlockchainAssets] = Map((Ergo, ErgoBlockchainAssets), (Cardano, CardanoBlockchainAssets))
  override protected val _isMultiChain: Boolean = true
}