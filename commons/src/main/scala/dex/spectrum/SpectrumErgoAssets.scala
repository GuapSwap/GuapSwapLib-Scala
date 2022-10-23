package dex.spectrum

import dex.DexBlockchainAssets

import blockchain.Ergo
import blockchain.ergo._

/**
 * Object representing the Ergo assets available on Spectrum dex.
 */
case object SpectrumErgoAssets extends DexBlockchainAssets(Ergo) {
  protected val dexBlockchainAssets: List[ErgoBlockchainAsset] = List(
    ErgoBlockchainAssets.ERG,
    ErgoBlockchainAssets.SigUSD,
    ErgoBlockchainAssets.SigRSV,
    ErgoBlockchainAssets.ergopad,
    ErgoBlockchainAssets.Paideia,
    ErgoBlockchainAssets.NETA,
    ErgoBlockchainAssets.EXLE,
    ErgoBlockchainAssets.EGIO,
    ErgoBlockchainAssets.EPOS,
    ErgoBlockchainAssets.Flux,
    ErgoBlockchainAssets.Terahertz,
    ErgoBlockchainAssets.COMET,
  )
}
