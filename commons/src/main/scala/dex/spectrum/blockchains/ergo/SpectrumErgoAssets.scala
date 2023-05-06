package dex.spectrum.blockchains.ergo

import dex.DexBlockchainAssets
import blockchain.{Blockchain, BlockchainAsset, Ergo}
import blockchain.ergo._

/**
 * Object representing the Ergo assets available on Spectrum dex.
 */
case object SpectrumErgoAssets extends DexBlockchainAssets {

  override val _dexBlockchain: Blockchain = Ergo

  final val ERG = ErgoBlockchainAssets.ERG
  final val SigUSD = ErgoBlockchainAssets.SigUSD
  final val SigRSV = ErgoBlockchainAssets.SigRSV
  final val ergopad = ErgoBlockchainAssets.ergopad
  final val Paideia = ErgoBlockchainAssets.Paideia
  final val NETA = ErgoBlockchainAssets.NETA
  final val EXLE = ErgoBlockchainAssets.EXLE
  final val EGIO = ErgoBlockchainAssets.EGIO
  final val EPOS = ErgoBlockchainAssets.EPOS
  final val Flux = ErgoBlockchainAssets.Flux
  final val Terahertz = ErgoBlockchainAssets.Terahertz
  final val COMET = ErgoBlockchainAssets.COMET

}
