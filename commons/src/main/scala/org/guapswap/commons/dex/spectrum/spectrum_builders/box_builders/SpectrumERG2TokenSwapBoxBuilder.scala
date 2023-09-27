package org.guapswap.commons.dex.spectrum.spectrum_builders.box_builders

import builders.box_builders.BoxBuilder
import org.ergoplatform.appkit.{ErgoContract, OutBox, OutBoxBuilder}

case class SpectrumERG2TokenSwapBoxBuilder(
                                          swapBoxValue: Long,
                                          spectrumERG2TokenSwapBuyContract: ErgoContract
                                          ) extends BoxBuilder {

  override val value: Long = swapBoxValue
  override val contract: ErgoContract = spectrumERG2TokenSwapBuyContract

  override def toOutBox(implicit outBoxBuilder: OutBoxBuilder): OutBox = {

    outBoxBuilder
      .value(value)
      .contract(contract)
      .build()

  }

}
