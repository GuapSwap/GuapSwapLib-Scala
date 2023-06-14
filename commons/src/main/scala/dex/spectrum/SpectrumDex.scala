package dex.spectrum

import blockchain.{Blockchain, Ergo}
import dex.{Dex, DexBlockchainAssets, DexPools}
import dex.spectrum.blockchains.ergo.{SpectrumErgoAssets, SpectrumErgoPools}

import java.nio.file.{Files, Paths}



/**
 * Object representing Spectrum dex.
 */
case object SpectrumDex extends Dex {

  override var _dexName: String = "Spectrum Dex"
  override var _dexBlockchains: List[Blockchain] = List(Ergo)
  override var _dexAssets: Map[Blockchain, DexBlockchainAssets] = Map((Ergo, SpectrumErgoAssets))
  override var _isMultiChain: Boolean = true
  override var _dexPools: Map[Blockchain, DexPools] = Map((Ergo, SpectrumErgoPools))

  // scripts
  final val SPECTRUM_ERGO_N2T_SWAPSELL_SCRIPT: String = Files.readString(Paths.get("src/main/scala/dex/spectrum/contracts/amm/v3/n2t/SwapSell.es")).stripMargin

}