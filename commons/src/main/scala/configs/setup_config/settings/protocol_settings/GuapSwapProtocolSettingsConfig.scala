package configs.setup_config.settings.protocol_settings

case class GuapSwapProtocolSettingsConfig(
                                         userAddress: String,
                                         swapIntervalInHours: Int,
                                         guapswapMinerFeeInNanoERG: Long
                                         )
