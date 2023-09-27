package org.guapswap.guapswap.processors

import org.ergoplatform.appkit.{ErgoClient, NetworkType, RestApiErgoClient}
import org.guapswap.guapswap.configs.setup_config.GuapSwapSetupConfig

case class DappProcessor(
                              config: GuapSwapSetupConfig
                            ) {

  def getNetworkType: NetworkType = NetworkType.fromValue(config.node.networkType)
  def getErgoClient: ErgoClient = RestApiErgoClient.create(config.node.nodeApiUrl, NetworkType.fromValue(config.node.networkType), config.node.nodeApiKey, config.node.explorerUrl)

}
