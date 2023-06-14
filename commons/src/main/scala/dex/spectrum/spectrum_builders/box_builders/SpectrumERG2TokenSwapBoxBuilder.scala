package dex.spectrum.spectrum_builders.box_builders

import common_builders.box_builders.AbstractGuapSwapBoxBuiler
import org.ergoplatform.appkit._

case class SpectrumERG2TokenSwapBoxBuilder() extends AbstractGuapSwapBoxBuiler {

  override val value: Long = _
  override val contract: ErgoContract = _

  override def toOutBox(implicit outBoxBuilder: OutBoxBuilder): OutBox = ???

}
