package contracts

import org.ergoplatform.appkit.ErgoContract

trait GuapSwapContractBuilder {

  def toErgoContract: ErgoContract

}
