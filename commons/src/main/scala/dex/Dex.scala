package dex

import blockchain.Blockchain

/**
 * Trait for an abstract Dex object.
 */
trait Dex {

  protected var _dexName: String
  private var _dexBlockchains: List[Blockchain]
  private var _dexAssets: Map[Blockchain, DexBlockchainAssets]
  private var _isMultiChain: Boolean

  /**
   * Get the dex name.
   * @return
   */
  def dexName: String = _dexName

  /**
   * Get the dex blockchains.
   * @return
   */
  def dexBlockchains: List[Blockchain] = _dexBlockchains

  /**
   * Get dex all dex assets.
   * @return
   */
  def dexAssets: Map[Blockchain, DexBlockchainAssets] = _dexAssets

  /**
   * Get dex assets for a particular chain.
   *
   * @param blockchain The blockchain that the dex assets exists on.
   * @return
   */
  def dexAssets(blockchain: Blockchain): DexBlockchainAssets = _dexAssets(blockchain)

  /**
   * Get the dex multi-chain status.
   * @return
   */
  def isMultiChain: Boolean = _isMultiChain

}