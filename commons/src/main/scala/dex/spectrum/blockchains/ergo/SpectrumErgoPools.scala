package dex.spectrum.blockchains.ergo

import blockchain.{Blockchain, Ergo}
import dex.{DexPool, DexPools}

case object SpectrumErgoPools extends DexPools {

  override val _dexBlockchain: Blockchain = Ergo
  override var _dexPools: Map[String, DexPool] = Map(
    (
      "ERG_2_SigUSD",
      SpectrumErgoPool(
        "",
        SpectrumErgoAssets.ERG,
        SpectrumErgoAssets.SigUSD,
        ""
      )
    )
  )

}
