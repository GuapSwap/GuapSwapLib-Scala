package dex.spectrum.contracts.erg2token

import dex.spectrum.contracts.AbstractSpectrumSwapContract
import org.ergoplatform.appkit.{Address, Constants, ErgoContract}
import sigmastate.Values

/**
 * Class representing the Spectrum dex ERG2Token swap contract.
 *
 * @param version
 * @param ergoscript
 * @param constants
 * @param networkType
 */
case class SpectrumERG2TokenContract(
                                      ergoContract: ErgoContract
                                    ) extends AbstractSpectrumSwapContract {


  override def getConstants: Constants = ???

  override def getErgoScript: String = ???

  override def substConstant(name: String, value: Any): ErgoContract = ???

  override def getErgoTree: Values.ErgoTree = ???

  override def toAddress: Address = ???


}
