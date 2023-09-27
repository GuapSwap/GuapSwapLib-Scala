package org.guapswap.guapswap.processors

import org.ergoplatform.appkit.{ErgoClient, NetworkType, RestApiErgoClient}
import org.guapswap.guapswap.configs.setup_config.GuapSwapSetupConfig

case class GuapSwapProcessor(
                              config: GuapSwapSetupConfig
                            )(implicit ergoClient: ErgoClient) {
 }
