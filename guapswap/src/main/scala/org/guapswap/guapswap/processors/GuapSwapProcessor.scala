package org.guapswap.guapswap.processors

import org.guapswap.guapswap.configs.setup_config.GuapSwapSetupConfig
import org.guapswap.commons.dex.spectrum.spectrum_builders.contract_builders.SpectrumERG2TokenContractBuilder


import org.ergoplatform.appkit.{OutBox, UnsignedTransactionBuilder}


case class GuapSwapProcessor(
                              config: GuapSwapSetupConfig,
                              totalProxyBoxesValue: Long
                            )(implicit txBuilder: UnsignedTransactionBuilder)extends {

  def getOutputs(): Array[OutBox] = {

    val outputs: Array[OutBox] = config.guapswapSettings.miningPortfolioSettings.guapswaps.map(guapswap => {

      val dexChoice: String = guapswap.dexSettings.dexChoice

      dexChoice match {

        case "SpectrumDex" => {

          val payoutVal: Long = (guapswap.percentageOfPayout * totalProxyBoxesValue).toLong

          val outBoxBuilder = txBuilder.outBoxBuilder()
          val contract = SpectrumERG2TokenContractBuilder(
            config.node.nodeApiUrl,
            guapswap.tokenTicker,
            payoutVal,
            guapswap.dexSettings.spectrumDexSettings.slippageTolerancePercentage,
            guapswap.dexSettings.spectrumDexSettings.nitro,
            guapswap.dexSettings.spectrumDexSettings.spectrumMinerFeeInNanoERG,

          )

        }

      }

    })

  }

}
