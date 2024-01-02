package org.guapswap.commons.dex.spectrum.spectrum_builders.contract_builders

import org.ergoplatform.appkit.{Address, BlockchainContext, ConstantsBuilder, ErgoContract, ErgoValue, JavaHelpers}
import org.guapswap.commons.dex.spectrum.{SpectrumDex, SpectrumErgoPool}
import org.guapswap.commons.utils.CommonUtils
import org.guapswap.commons.ergo.ErgoBlockchainAssets

import sigmastate.{SType, Values}
import sigmastate.Values.ErgoTree
import sigmastate.basics.DLogProtocol.ProveDlog
import sigmastate.serialization.ErgoTreeSerializer
import special.collection.Coll
import special.sigma.SigmaProp

case class SpectrumERG2TokenContractBuilder(
                                           baseAmount: ErgoValue[java.lang.Long],
                                           poolFeeNum: ErgoValue[java.lang.Integer],
                                           refundProp: ErgoValue[SigmaProp],
                                           poolId: ErgoValue[Coll[java.lang.Byte]],
                                           quoteId: ErgoValue[Coll[java.lang.Byte]],
                                           minQuoteAmount: ErgoValue[java.lang.Long],
                                           poolFeeDenom: ErgoValue[java.lang.Integer],
                                           minerPropBytes: ErgoValue[Coll[java.lang.Byte]],
                                           maxMinerFee: ErgoValue[java.lang.Long],
                                           dexFeePerTokenNum: ErgoValue[java.lang.Long],
                                           dexFeePerTokenDenom: ErgoValue[java.lang.Long]
                                           ) extends AbstractSpectrumSwapContractBuilder {

  override val script: String = SpectrumDex.SPECTRUM_ERGO_N2T_SWAPSELL_SCRIPT

  override def toErgoContract(implicit ctx: BlockchainContext): ErgoContract = {

    val ergotree = JavaHelpers.decodeStringToErgoTree(SpectrumERG2TokenContractBuilder.n2t_v3_swapsell_ergotree)
    var constants = ergotree.constants
    constants = constants.updated(0, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(refundProp))
    constants = constants.updated(9, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(quoteId))
    constants = constants.updated(14, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(poolFeeNum))
    constants = constants.updated(18, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(poolFeeNum))
    constants = constants.updated(8, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(poolId))
    constants = constants.updated(10, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(minQuoteAmount))
    constants = constants.updated(11, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(dexFeePerTokenNum))
    constants = constants.updated(12, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(dexFeePerTokenDenom))
    constants = constants.updated(2, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(baseAmount))
    constants = constants.updated(17, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(baseAmount))
    constants = constants.updated(22, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(maxMinerFee))
    constants = constants.updated(19, AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.inverse.to(minerPropBytes))

    val newTreeProp = ErgoTree.substConstants(ergotree.root.right.get, constants).toSigmaProp
    val newTree = ErgoTree.fromProposition(newTreeProp)

    ctx.newContract(newTree)

//    ctx.compileContract(
//      ConstantsBuilder.create()
//        .item("ExFeePerTokenDenom", exFeePerTokenDenom)
//        .item("Delta", delta)
//        .item("BaseAmount", baseAmount)
//        .item("FeeNum", feeNum)
//        .item("RefundProp", refundProp.getValue)
//        .item("SpectrumIsQuote", spectrumIsQuote)
//        .item("MaxExFee", maxExFee)
//        .item("PoolNFT", poolNFT.getValue)
//        .item("RedeemerPropBytes", redeemerPropBytes.getValue)
//        .item("QuoteId", quoteId.getValue)
//        .item("MinQuoteAmount", minQuoteAmount)
//        .item("SpectrumId", spectrumId.getValue)
//        .item("FeeDenom", feeDenom)
//        .item("MinerPropBytes", minerPropBytes.getValue)
//        .item("MaxMinerFee", maxMinerFee)
//        .build(),
//      script
//    )

  }

}

object SpectrumERG2TokenContractBuilder {

  final val n2t_v3_swapsell_ergotree: String = "19f8031808cd0279aed8dea2b2a25316d5d49d13bf51c0b2c1dc696974bb4b0c07b5894e998e5604000580f085da2c040404060402040004000e209916d75132593c8b07fe18bd8d583bda1652eed7565cf41a4738ddd90fc992ec0e2003faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf0405920f05faafadfef9e2ff150580c0a8ca9a3a040404c60f06010104d00f0580f085da2c04c60f0e691005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a5730405000500058092f4010100d803d6017300d602b2a4730100d6037302eb027201d195ed92b1a4730393b1db630872027304d804d604db63087202d605b2a5730500d606b2db63087205730600d6077e8c72060206edededededed938cb2720473070001730893c27205d07201938c72060173099272077e730a06927ec172050699997ec1a7069d9c72077e730b067e730c067e720306909c9c7e8cb27204730d0002067e7203067e730e069c9a7207730f9a9c7ec17202067e7310067e9c73117e7312050690b0ada5d90108639593c272087313c1720873147315d90108599a8c7208018c72080273167317"
  final val n2t_v3_swapsell_template: String = "d803d6017300d602b2a4730100d6037302eb027201d195ed92b1a4730393b1db630872027304d804d604db63087202d605b2a5730500d606b2db63087205730600d6077e8c72060206edededededed938cb2720473070001730893c27205d07201938c72060173099272077e730a06927ec172050699997ec1a7069d9c72077e730b067e730c067e720306909c9c7e8cb27204730d0002067e7203067e730e069c9a7207730f9a9c7ec17202067e7310067e9c73117e7312050690b0ada5d90108639593c272087313c1720873147315d90108599a8c7208018c72080273167317"

  def apply(explorerUrl: String,
          swapAssetTicker: String,
          baseAmountIncludingFees: Long,
          slippageTolerancePercentage: Double,
          nitro: Double,
          spectrumMinerFee: Long,
          refundAddress: String
         ): SpectrumERG2TokenContractBuilder = {

    val refundPropBytes: ErgoValue[SigmaProp] = ErgoValue.of(Address.create(refundAddress).getSigmaBoolean)

    val swapBuyContract: ErgoTree = JavaHelpers.decodeStringToErgoTree(n2t_v3_swapsell_ergotree)
    val swapBuyConstants: IndexedSeq[Values.Constant[SType]] = swapBuyContract.constants

    val assetPool: SpectrumErgoPool = SpectrumDex.getPoolFromAssetTicker(swapAssetTicker).asInstanceOf[SpectrumErgoPool]
    val assetAmounts: (Long, Long) = assetPool.getPoolInfo(explorerUrl)
    val minExecutionFee: Long = AbstractSpectrumSwapContractBuilder.calcMinExecutionFee(spectrumMinerFee)
    val maxExecutionFee: Long = AbstractSpectrumSwapContractBuilder.calcMaxExecutionFee(minExecutionFee, nitro).toLong
    val baseAmount: Long = baseAmountIncludingFees - maxExecutionFee
    val minQuoteAmount: Long = AbstractSpectrumSwapContractBuilder.calcMinOutputAmount(baseAmount, slippageTolerancePercentage, assetAmounts._1, assetAmounts._2, assetPool.feeNum, SpectrumDex.SPECTRUM_ERGO_POOL_FEE_DENOM)
    val swapExtremums: Option[(Double, (Long, Long, Long, Long))] = AbstractSpectrumSwapContractBuilder.calcSwapExtremums(minExecutionFee, nitro, minQuoteAmount)
    val dexFeePerTokenFraction: (BigInt, BigInt) = CommonUtils.decimalToFraction(BigDecimal(swapExtremums.get._1))
    val poolId: ErgoValue[Coll[java.lang.Byte]] = ErgoValue.of(assetPool.getPoolIdAsErgoId.getBytes)
    val quoteId: ErgoValue[Coll[java.lang.Byte]] = ErgoValue.of(assetPool.assetY.getAssetIdAsErgoId.getBytes)
    val minerPropBytes: ErgoValue[Coll[java.lang.Byte]] = AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.to(swapBuyConstants(19)).asInstanceOf[ErgoValue[Coll[java.lang.Byte]]]
    val maxMinerFee: Long = spectrumMinerFee
    val poolFeeNum: Int = assetPool.feeNum.toInt
    val poolFeeDenom: Int = SpectrumDex.SPECTRUM_ERGO_POOL_FEE_DENOM.toInt

    new SpectrumERG2TokenContractBuilder(
      ErgoValue.of(baseAmount),
      ErgoValue.of(poolFeeNum),
      refundPropBytes,
      poolId,
      quoteId,
      ErgoValue.of(minQuoteAmount),
      ErgoValue.of(poolFeeDenom),
      minerPropBytes,
      ErgoValue.of(maxMinerFee),
      ErgoValue.of(dexFeePerTokenFraction._1.toLong),
      ErgoValue.of(dexFeePerTokenFraction._2.toLong)
    )

  }

}
