package dex

import blockchain.{Blockchain, BlockchainAsset}

trait DexPool {

    val _dex: Dex
    val _dexBlockchain: Blockchain
    val _dexPoolId: String
    var _dexPoolAssetX: BlockchainAsset
    var _dexPoolAssetY: BlockchainAsset

}
