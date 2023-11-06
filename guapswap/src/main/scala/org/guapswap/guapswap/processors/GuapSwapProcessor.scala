package org.guapswap.guapswap.processors

import org.guapswap.guapswap.configs.setup_config.GuapSwapSetupConfig
import org.guapswap.commons.dex.spectrum.spectrum_builders.contract_builders.SpectrumERG2TokenContractBuilder
import org.ergoplatform.appkit.{Address, BlockchainContext, Mnemonic, NetworkType, OutBox, OutBoxBuilder, SecretString, UnsignedTransactionBuilder}
import org.guapswap.commons.dex.spectrum.spectrum_builders.box_builders.SpectrumERG2TokenSwapBoxBuilder
import org.scalatest.tagobjects.Network


case class GuapSwapProcessor(
                              config: GuapSwapSetupConfig,
                              totalProxyBoxesValue: Long
                            )(implicit ctx: BlockchainContext, txBuilder: UnsignedTransactionBuilder) extends {

  def getOutputs: Array[OutBox] = {

    val outputs: Array[OutBox] = config.guapswapSettings.miningPortfolioSettings.guapswaps.map(guapswap => {

      val dexChoice: String = guapswap.dexSettings.dexChoice

      dexChoice match {

        case "spectrum" => {

          val payoutVal: Long = (guapswap.percentageOfPayout * totalProxyBoxesValue).toLong
          val userAddress: Address = Address.createEip3Address(config.node.mnemonicIndex, NetworkType.fromValue(config.node.networkType), SecretString.create(config.node.mnemonic), SecretString.empty(), false)

          implicit val outBoxBuilder: OutBoxBuilder = txBuilder.outBoxBuilder()

          val contract = SpectrumERG2TokenContractBuilder(
            config.node.nodeApiUrl,
            guapswap.tokenTicker,
            payoutVal,
            guapswap.dexSettings.spectrumDexSettings.slippageTolerancePercentage,
            guapswap.dexSettings.spectrumDexSettings.nitro,
            guapswap.dexSettings.spectrumDexSettings.spectrumMinerFeeInNanoERG,
            guapswap.dexSettings.spectrumDexSettings.redeemerAddress,
            userAddress.asP2PK().toString()
          ).toErgoContract

          val spectrumSwapBox = SpectrumERG2TokenSwapBoxBuilder(payoutVal, contract).toOutBox
          spectrumSwapBox

        }

      }

    })

    outputs

  }

}
