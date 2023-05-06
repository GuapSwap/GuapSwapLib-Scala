package dex.spectrum.builders

import builders.GuapSwapBoxBuilder
import org.ergoplatform.appkit.{Eip4Token, ErgoContract, ErgoToken, ErgoValue, OutBox, OutBoxBuilder}

case class SpectrumERG2TokenSwapBoxBuilder(boxBuidler: OutBoxBuilder) extends GuapSwapBoxBuilder {

  override def value(value: Long): OutBoxBuilder = ???

  override def contract(contract: ErgoContract): OutBoxBuilder = ???

  override def tokens(tokens: ErgoToken*): OutBoxBuilder = ???

  override def mintToken(token: Eip4Token): OutBoxBuilder = ???

  override def registers(registers: ErgoValue[_]*): OutBoxBuilder = ???

  override def creationHeight(height: Int): OutBoxBuilder = ???

  override def build(): OutBox = ???

}
