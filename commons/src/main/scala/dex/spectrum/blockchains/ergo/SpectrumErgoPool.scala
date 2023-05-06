package dex.spectrum.blockchains.ergo

import dex.{Dex, DexPool}
import blockchain.{Blockchain, BlockchainAsset, Ergo}
import blockchain.ergo.ErgoBlockchainAsset
import dex.spectrum.SpectrumDex

final case class SpectrumErgoPool(
   poolId: String,
   assetX: ErgoBlockchainAsset,
   assetY: ErgoBlockchainAsset,
   address: String
) extends DexPool {

    override val _dex: Dex = SpectrumDex
    override val _dexBlockchain: Blockchain = Ergo
    override val _dexPoolId: String = poolId
    override var _dexPoolAssetX: BlockchainAsset = assetX
    override var _dexPoolAssetY: BlockchainAsset = assetY

}
