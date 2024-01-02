package org.guapswap.guapswap.processors

import org.guapswap.guapswap.configs.setup_config.GuapSwapSetupConfig
import org.guapswap.commons.dex.spectrum.spectrum_builders.contract_builders.SpectrumERG2TokenContractBuilder
import org.ergoplatform.appkit.{Address, BlockchainContext, ErgoContract, JavaHelpers, Mnemonic, NetworkType, OutBox, OutBoxBuilder, SecretString, UnsignedTransactionBuilder}
import org.guapswap.commons.dex.spectrum.spectrum_builders.box_builders.SpectrumERG2TokenSwapBoxBuilder
import org.scalatest.tagobjects.Network
import sigmastate.serialization.ErgoTreeSerializer


case class GuapSwapProcessor(
                              config: GuapSwapSetupConfig,
                              inputValue: Long
                            )(implicit ctx: BlockchainContext, txBuilder: UnsignedTransactionBuilder) {

  private val _serviceFeeAddress: Address = Address.create("9eqWbtoyvjMddkVq1dY1cNzTepJAjo6tB3QEkLuUfwaVXKZzifL")
  private val _serviceFeePercentage: Double = 0.05
  private val _serviceFeeValue: Long = (inputValue * 0.05).toLong

  def serviceFeeAddress: Address = _serviceFeeAddress
  def serviceFeePercentage: Double = _serviceFeePercentage
  def serviceFeeValue: Long = _serviceFeeValue

  def getServiceFeeOutBox: OutBox = {

    txBuilder.outBoxBuilder()
      .value(serviceFeeValue)
      .contract(serviceFeeAddress.toErgoContract)
      .build()

  }

  def getOutputs: Array[OutBox] = {

    val guapswapValue: Long= inputValue - this.serviceFeeValue

    val outputs: Array[OutBox] = config.guapswapSettings.miningPortfolioSettings.guapswaps.map(guapswap => {

      val dexChoice: String = guapswap.dexSettings.dexChoice

      dexChoice match {

        case "spectrum" => {

          val payoutVal: Long = (guapswap.percentageOfPayout * guapswapValue).toLong
          val userAddress: Address = Address.createEip3Address(config.node.mnemonicIndex, NetworkType.fromValue(config.node.networkType), SecretString.create(config.node.mnemonic), SecretString.empty(), false)

          implicit val outBoxBuilder: OutBoxBuilder = txBuilder.outBoxBuilder()

          val contract = SpectrumERG2TokenContractBuilder(
            config.node.explorerUrl,
            guapswap.tokenTicker,
            payoutVal,
            guapswap.dexSettings.spectrumDexSettings.slippageTolerancePercentage,
            guapswap.dexSettings.spectrumDexSettings.nitro,
            guapswap.dexSettings.spectrumDexSettings.spectrumMinerFeeInNanoERG,
            userAddress.asP2PK().toString()
          ).toErgoContract

          val spectrumSwapBox = SpectrumERG2TokenSwapBoxBuilder(payoutVal, contract).toOutBox
          spectrumSwapBox

        }

      }

    })

    outputs ++ Array(getServiceFeeOutBox)

  }

}
