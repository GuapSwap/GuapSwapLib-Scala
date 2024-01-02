package org.guapswap.guapswap.configs.setup_config.node

case class NodeConfig(
                       networkType: String,
                       nodeApiUrl: String,
                       nodeApiKey: String,
                       explorerUrl: String,
                       mnemonic: String,
                       mnemonicIndex: Int
                     )
