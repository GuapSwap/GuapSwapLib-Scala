package configs.setup_config.settings.mining_portfolio_settings

import configs.setup_config.settings.mining_portfolio_settings.dex_settings.GuapSwapDexSettingsConfig

case class GuapSwapConfig(
                    tokenTicker: String,
                    percentageOfPayout: Double,
                    receiverAddress: String,
                    dexSettings: GuapSwapDexSettingsConfig
                    )