package org.guapswap.guapswap.configs.setup_config.settings

import org.guapswap.guapswap.configs.setup_config.settings.mining_portfolio_settings.GuapSwapMiningPortfolioSettingsConfig
import org.guapswap.guapswap.configs.setup_config.settings.protocol_settings.GuapSwapProtocolSettingsConfig

case class GuapSwapSettingsConfig(
                                 protocolSettings: GuapSwapProtocolSettingsConfig,
                                 miningPortfolioSettings: GuapSwapMiningPortfolioSettingsConfig
                                 )