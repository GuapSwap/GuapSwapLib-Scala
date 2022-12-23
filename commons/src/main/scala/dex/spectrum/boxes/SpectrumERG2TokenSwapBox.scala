package dex.spectrum.boxes

import boxes.GuapSwapBox
import org.ergoplatform.appkit.{ErgoContract, ErgoToken}
import org.ergoplatform.appkit.impl.BlockchainContextImpl

/**
 * Class representing a Spectrum ERG2Token swap box.
 * @param value
 * @param contract
 * @param tokens
 * @param ctx
 */
case class SpectrumERG2TokenSwapBox(
  private val _value: Long,
  private val _contract: ErgoContract,
  private val _tokens: List[ErgoToken],
  private val _ctx: BlockchainContextImpl
) extends SpectrumSwapBox {

  _value = _value
  _contract = _contract
  _tokens = _tokens
  _ctx = _ctx

  // TODO: implement these things using the transaction config

}