package org.guapswap.guapswap.configs.setup_config.settings.mining_portfolio_settings.dex_settings

case class GuapSwapDexSettingsConfig(
                                      dexChoice: String,
                                      spectrumDexSettings: GuapSwapSpectrumDexSettingsConfig
                                    )
