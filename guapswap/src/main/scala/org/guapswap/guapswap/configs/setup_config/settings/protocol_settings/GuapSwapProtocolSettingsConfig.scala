package org.guapswap.guapswap.configs.setup_config.settings.protocol_settings

case class GuapSwapProtocolSettingsConfig(
                                         userAddress: String,
                                         swapIntervalInHours: Int,
                                         guapswapMinerFeeInNanoERG: Long
                                         )
