package dex

import blockchain.Blockchain

/**
 * Trait for an abstract Dex object.
 */
trait Dex {

  var _dexName: String
  var _dexBlockchains: List[Blockchain]
  var _dexAssets: Map[Blockchain, DexBlockchainAssets]
  var _isMultiChain: Boolean
  var _dexPools: Map[Blockchain, DexPools]

}