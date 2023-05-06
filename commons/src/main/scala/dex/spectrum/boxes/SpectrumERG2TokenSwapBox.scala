package dex.spectrum.boxes

import boxes.GuapSwapBox
import org.ergoplatform.appkit.{BoxAttachment, ErgoContract, ErgoToken, ErgoValue, InputBox, OutBox, UnsignedTransactionBuilder}
import org.ergoplatform.appkit.impl.BlockchainContextImpl
import sigmastate.Values

import java.util

/**
 * Class representing a Spectrum ERG2Token swap box.
 */
case class SpectrumERG2TokenSwapBox(outbox: OutBox) extends AbstractSpectrumSwapBox {


  override def getValue: Long = outbox.getValue

  override def getCreationHeight: Int = outbox.getCreationHeight

  override def getTokens: util.List[ErgoToken] = outbox.getTokens

  override def getRegisters: util.List[ErgoValue[_]] = outbox.getRegisters

  override def getErgoTree: Values.ErgoTree = outbox.getErgoTree

  override def getAttachment: BoxAttachment = outbox.getAttachment

}