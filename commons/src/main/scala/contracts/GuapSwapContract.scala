package contracts

import org.ergoplatform.appkit.impl.ErgoTreeContract
import org.ergoplatform.appkit.{ErgoContract, JavaHelpers, NetworkType}
import sigmastate.Values

import scala.collection.JavaConverters._

/**
  * Trait for an abstract GuapSwap contract.
  */
trait GuapSwapContract {

  protected var _version: String
  protected var _ergoscript: String
  protected var _constants: Map[String, Object]
  protected var _networkType: NetworkType

  def toErgoTree: Values.ErgoTree = JavaHelpers.compile(_constants.asJava, _ergoscript, _networkType.networkPrefix)

  def toErgoContract: ErgoContract = new ErgoTreeContract(toErgoTree, _networkType)

}