package org.guapswap.guapswap.configs.setup_config

import com.google.gson.{Gson, GsonBuilder}
import org.guapswap.guapswap.configs.setup_config.node.NodeConfig
import org.guapswap.guapswap.configs.setup_config.settings.GuapSwapSettingsConfig

import java.io.{File, FileReader}
import scala.util.Try

case class GuapSwapSetupConfig(
                               node: NodeConfig,
                               guapswapSettings: GuapSwapSettingsConfig
                        )

object GuapSwapSetupConfig {

  def load(configFilePath: String): Try[GuapSwapSetupConfig] = Try {

    // Load the file
    val configFile: File = new File(configFilePath)

    // Read the file
    val configReader: FileReader = new FileReader(configFile)

    // Create Gson object to parse json
    val gson: Gson = new GsonBuilder().create()

    // Parse the json and create the config object
    val config: GuapSwapSetupConfig = gson.fromJson(configReader, classOf[GuapSwapSetupConfig])
    configReader.close()
    config

  }

}
