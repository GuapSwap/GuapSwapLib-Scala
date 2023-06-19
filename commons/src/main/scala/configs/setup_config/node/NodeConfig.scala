package configs.setup_config.node

import org.ergoplatform.appkit.NetworkType

case class NodeConfig(
                       nodeApi: NodeApiConfig,
                       wallet: WalletConfig,
                       networkType: NetworkType
                     )
