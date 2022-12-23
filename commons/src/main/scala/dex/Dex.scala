package dex

import blockchain.Blockchain

/**
 * Trait for an abstract Dex object.
 */
trait Dex {

  protected var _dexName: String
  protected var _dexBlockchains: List[Blockchain]
  protected var _dexAssets: Map[Blockchain, DexBlockchainAssets]
  protected var _isMultiChain: Boolean

}