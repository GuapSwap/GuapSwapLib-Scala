package org.guapswap.commons.dex.spectrum

import org.ergoplatform.explorer.client.model.{ItemsA, OutputInfo}
import org.ergoplatform.explorer.client.{DefaultApi, ExplorerApiClient}
import org.guapswap.commons.dex.DexPool
import org.guapswap.commons.ergo.ErgoBlockchainAsset

import retrofit2.{Call, Response}

import scala.util.control.NonFatal

case class SpectrumErgoPool(
   poolId: String,
   assetX: ErgoBlockchainAsset,
   assetY: ErgoBlockchainAsset,
   feeNum: Long
) extends DexPool {

    override val _dexPoolId: String = poolId
    override var _dexPoolAssetX: ErgoBlockchainAsset = assetX
    override var _dexPoolAssetY: ErgoBlockchainAsset = assetY

    /**
     * Get the current Spectrum pool information from the blockchain.
     * @param apiUrl The api url of the node.
     * @return Amount of each asset from the pool.
     */
    def getPoolInfo(apiUrl: String): (Long, Long) = {

        // Search for the pool box based on the pool id, there should only be one such box
        try {

            val nodeApi: DefaultApi = new ExplorerApiClient(apiUrl).createService(classOf[DefaultApi])
            val call: Call[ItemsA] = nodeApi.getApiV1BoxesUnspentBytokenidP1(_dexPoolId, 0, 1)
            val response: Response[ItemsA] = call.execute()
            val body: ItemsA = response.body()
            val content: OutputInfo = body.getItems.get(0)

            val assetX: Long = content.getValue
            val assetY: Long = content.getAssets.get(2).getAmount

            (assetX, assetY)

        } catch {
            case NonFatal(e) => throw e
        }

    }


}