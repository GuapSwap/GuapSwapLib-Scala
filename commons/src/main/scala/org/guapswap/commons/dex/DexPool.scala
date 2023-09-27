package org.guapswap.commons.dex

import org.ergoplatform.appkit.ErgoId
import org.guapswap.commons.ergo.ErgoBlockchainAsset

trait DexPool {

    val _dexPoolId: String
    var _dexPoolAssetX: ErgoBlockchainAsset
    var _dexPoolAssetY: ErgoBlockchainAsset

    def getPoolIdAsErgoId: ErgoId = {
        ErgoId.create(_dexPoolId)
    }

}
