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
                                     override val value: Long,
                                     override val contract: ErgoContract,
                                     override val tokens: List[ErgoToken],
                                     override implicit val ctx: BlockchainContextImpl
                                   ) extends GuapSwapBox(value, contract, tokens, registers = null, contextVars = null, ctx) {
}