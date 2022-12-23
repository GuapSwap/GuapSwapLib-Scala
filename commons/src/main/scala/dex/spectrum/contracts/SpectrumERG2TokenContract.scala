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
    private val _version: String,
    private val _networkType: NetworkType
) extends SpectrumSwapContract {

  _version = _version
  _ergoscript = // TODO: code for converting to ergoscript
  _constants = // TODO: code for converting to constants Map[String, Object]
  
}
