package contracts

import org.ergoplatform.appkit.impl.ErgoTreeContract
import org.ergoplatform.appkit.{ErgoContract, JavaHelpers, NetworkType}
import sigmastate.Values

import scala.collection.JavaConverters._

/**
 * Abstract object representing a GuapSwap contract.
 * @param version
 * @param ergoscript
 * @param constants
 * @param networkType
 */
abstract case class GuapSwapContract(
                                    protected val version: String,
                                    protected val ergoscript: String,
                                    protected val constants: Map[String, Object],
                                    protected val networkType: NetworkType
                                    ) {

  /**
   * Convert the GuapSwap contract to an ErgoTree contract.
   * @return
   */
  def toErgoTree: Values.ErgoTree = {
    val jConstants = constants.asJava
    JavaHelpers.compile(constants.asJava, ergoscript, networkType.networkPrefix)
  }

  /**
   * Convert the GuapSwap contract to an ErgoContract.
   * @return
   */
  def toErgoContract: ErgoContract = new ErgoTreeContract(toErgoTree, networkType)

//  def ergoValue: ErgoValue[(Coll[JByte],(Coll[JByte],Coll[JByte]))] = {
//    ErgoValue.pairOf(
//      ErgoValue.of(getClass().getCanonicalName().getBytes()),
//      ErgoValue.pairOf(
//        ErgoValue.of(version.getBytes()),
//        ErgoValue.of(Blake2b256(ergoTree.bytes).array)
//      )
//    )
//  }

}