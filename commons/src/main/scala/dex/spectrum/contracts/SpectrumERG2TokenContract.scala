package dex.spectrum.contracts

import org.ergoplatform.appkit.NetworkType

/**
 * Class representing the Spectrum dex ERG2Token swap contract.
 * @param version
 * @param ergoscript
 * @param constants
 * @param networkType
 */
case class SpectrumERG2TokenContract(
                                      override val version: String,
                                      override val ergoscript: String,
                                      override val constants: Map[String, Object],
                                      override val networkType: NetworkType
                                    ) extends SpectrumSwapContract(version, ergoscript, constants, networkType) {



}
