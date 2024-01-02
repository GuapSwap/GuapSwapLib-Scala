package org.guapswap.guapswap.functional

import org.ergoplatform.appkit.{Address, BlockchainContext, SecretString}
import org.guapswap.guapswap.configs.setup_config.GuapSwapSetupConfig
import org.guapswap.guapswap.processors.{GuapSwapProcessor, NodeProcessor}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.collection.JavaConverters._

class GuapSwapFunctionalTest extends AnyFlatSpec with Matchers {

  val config = GuapSwapSetupConfig.load("/home/luca/development/work/guap/guapswaplib/guapswap/src/test/scala/org/guapswap/guapswap/resources/config.json").get

  val node = NodeProcessor(config)

  val ergoClient = node.getErgoClient

  val userAddress = Address.create(config.guapswapSettings.protocolSettings.userAddress)

  val proxies = node.getErgoClient.getDataSource.getUnspentBoxesFor(userAddress, 0, 100).asScala.toArray
  val proxyAmounts: Long = proxies.map(proxy => proxy.getValue).sum
  val guapswapValue = proxyAmounts - 100 * config.guapswapSettings.protocolSettings.guapswapMinerFeeInNanoERG

  "GuapSwap Tx" should "return a string" in {

    val txId = ergoClient.execute((ctx: BlockchainContext) => {

      val prover = ctx.newProverBuilder()
        .withMnemonic(
          SecretString.create(config.node.mnemonic), SecretString.empty(), false
        )
        .withEip3Secret(0)
        .build()

      val guapswapTxBuilder = ctx.newTxBuilder()

      val guapswaps = GuapSwapProcessor(config, guapswapValue)(ctx, guapswapTxBuilder).getOutputs

      val tx = guapswapTxBuilder
        .addInputs(proxies:_*)
        .addOutputs(guapswaps:_*)
        .fee(config.guapswapSettings.protocolSettings.guapswapMinerFeeInNanoERG)
        .sendChangeTo(userAddress)
        .build()

      val signTx = prover.sign(tx)

      val txId = ctx.sendTransaction(signTx)

      txId

    })

    println("GuapSwap Tx Id: " + txId)

    txId shouldBe a [String]

  }

}
