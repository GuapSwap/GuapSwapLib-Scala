package configs.setup_config.settings

import configs.setup_config.settings.mining_portfolio_settings.GuapSwapMiningPortfolioSettingsConfig
import configs.setup_config.settings.protocol_settings.GuapSwapProtocolSettingsConfig

case class GuapSwapSettingsConfig(
                                 protocolSettings: GuapSwapProtocolSettingsConfig,
                                 miningPortfolioSettings: GuapSwapMiningPortfolioSettingsConfig
                                 )