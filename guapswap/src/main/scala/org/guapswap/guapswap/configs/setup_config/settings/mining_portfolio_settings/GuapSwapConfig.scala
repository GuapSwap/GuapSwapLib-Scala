package org.guapswap.guapswap.configs.setup_config.settings.mining_portfolio_settings

import org.guapswap.guapswap.configs.setup_config.settings.mining_portfolio_settings.dex_settings.GuapSwapDexSettingsConfig


case class GuapSwapConfig(
                    tokenTicker: String,
                    percentageOfPayout: Double,
                    dexSettings: GuapSwapDexSettingsConfig
                    )