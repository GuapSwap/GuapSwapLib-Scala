package dex

import blockchain.Blockchain

/**
 * Class for an abstract Dex object.
 *
 * @param dexName The dex name.
 * @param dexBlockchains The blockchains which the dex is built on.
 * @param dexAssets The assets of the dex on the different blockchains.
 * @param isMultiChain Flag to know if the blockchain is multichoin.
 */
abstract class Dex(
                    protected val dexName: String,
                    protected val dexBlockchains: List[Blockchain],
                    protected val dexAssets: Map[Blockchain, DexBlockchainAssets],
                    protected val isMultiChain: Boolean
                  ) {

  /**
   * Get the dex name.
   * @return
   */
  def getDexName: String = this.dexName

  /**
   * Get the dex blockchains.
   * @return
   */
  def getDexBlockchains: List[Blockchain] = this.dexBlockchains

  /**
   * Get dex all dex assets.
   * @return
   */
  def getDexAssets: Map[Blockchain, DexBlockchainAssets] = this.dexAssets

  /**
   * Get dex assets for a particular chain.
   *
   * @param blockchain The blockchain that the dex assets exists on.
   * @return
   */
  def getDexAssets(blockchain: Blockchain): DexBlockchainAssets = this.dexAssets(blockchain)

  /**
   * Get the dex multi-chain status.
   * @return
   */
  def getMultiChainStatus: Boolean = this.isMultiChain

}