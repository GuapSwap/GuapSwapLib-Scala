package dex.spectrum.spectrum_builders.contract_builders

import ergo.ErgoBlockchainAssets
import dex.spectrum.{SpectrumDex, SpectrumErgoPool}
import org.ergoplatform.appkit.{BlockchainContext, ConstantsBuilder, ErgoContract, ErgoValue, JavaHelpers}
import sigmastate.{SType, Values}
import sigmastate.Values.ErgoTree
import sigmastate.basics.DLogProtocol.ProveDlog
import special.collection.Coll

case class SpectrumERG2TokenContractBuilder(
                                           exFeePerTokenDenom: Long,
                                           delta: Long,
                                           baseAmount: Long,
                                           feeNum: Int,
                                           refundProp: ErgoValue[ProveDlog],
                                           spectrumIsQuote: Boolean,
                                           maxExFee: Long,
                                           poolNFT: ErgoValue[Coll[java.lang.Byte]],
                                           redeemerPropBytes: ErgoValue[Coll[java.lang.Byte]],
                                           quoteId: ErgoValue[Coll[java.lang.Byte]],
                                           minQuoteAmount: Long,
                                           spectrumId: ErgoValue[Coll[java.lang.Byte]],
                                           feeDenom: Int,
                                           minerPropBytes: ErgoValue[Coll[java.lang.Byte]],
                                           maxMinerFee: Long
                                           ) extends AbstractSpectrumSwapContractBuilder {

  override val script: String = SpectrumDex.SPECTRUM_ERGO_N2T_SWAPSELL_SCRIPT

  override def toErgoContract(implicit ctx: BlockchainContext): ErgoContract = {

    ctx.compileContract(
      ConstantsBuilder.create()
        .item("ExFeePerTokenDenom", exFeePerTokenDenom)
        .item("Delta", delta)
        .item("BaseAmount", baseAmount)
        .item("FeeNum", feeNum)
        .item("RefundProp", refundProp.getValue)
        .item("SpectrumIsQuote", spectrumIsQuote)
        .item("MaxExFee", maxExFee)
        .item("PoolNFT", poolNFT.getValue)
        .item("RedeemerPropBytes", redeemerPropBytes.getValue)
        .item("QuoteId", quoteId.getValue)
        .item("MinQuoteAmount", minQuoteAmount)
        .item("SpectrumId", spectrumId.getValue)
        .item("FeeDenom", feeDenom)
        .item("MinerPropBytes", minerPropBytes.getValue)
        .item("MaxMinerFee", maxMinerFee)
        .build(),
      script
    )

  }

}

object SpectrumERG2TokenContractBuilder {

  final val n2t_v3_swapsell_ergotree: String = "19fe04210400059cdb0205cead0105e01204c80f08cd02217daf90deb73bdf8b6709bb42093fdfaff6573fd47b630e2d3fdd4a8193a74d0404040604020400010105f01504000e2002020202020202020202020202020202020202020202020202020202020202020e2001010101010101010101010101010101010101010101010101010101010101010e20040404040404040404040404040404040404040404040404040404040404040405c00c0101010105f015060100040404020e2003030303030303030303030303030303030303030303030303030303030303030101040406010104d00f0e691005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a573040500050005a09c010100d804d601b2a4730000d6027301d6037302d6049c73037e730405eb027305d195ed92b1a4730693b1db630872017307d806d605db63087201d606b2a5730800d607db63087206d608b27207730900d6098c720802d60a95730a9d9c7e997209730b067e7202067e7203067e720906edededededed938cb27205730c0001730d93c27206730e938c720801730f92720a7e7310069573117312d801d60b997e7313069d9c720a7e7203067e72020695ed91720b731492b172077315d801d60cb27207731600ed938c720c017317927e8c720c0206720b7318909c7e8cb2720573190002067e7204069c9a720a731a9a9c7ec17201067e731b067e72040690b0ada5d9010b639593c2720b731cc1720b731d731ed9010b599a8c720b018c720b02731f7320"
  final val n2t_v3_swapsell_template: String = "d804d601b2a4730000d6027301d6037302d6049c73037e730405eb027305d195ed92b1a4730693b1db630872017307d806d605db63087201d606b2a5730800d607db63087206d608b27207730900d6098c720802d60a95730a9d9c7e997209730b067e7202067e7203067e720906edededededed938cb27205730c0001730d93c27206730e938c720801730f92720a7e7310069573117312d801d60b997e7313069d9c720a7e7203067e72020695ed91720b731492b172077315d801d60cb27207731600ed938c720c017317927e8c720c0206720b7318909c7e8cb2720573190002067e7204069c9a720a731a9a9c7ec17201067e731b067e72040690b0ada5d9010b639593c2720b731cc1720b731d731ed9010b599a8c720b018c720b02731f7320"

  /**
   *
   * @param apiUrl
   * @param swapAssetTicker
   * @param baseAmount The raw amount of ERG actually being swapped for another token.
   * @param slippageTolerancePercentage
   * @param nitro
   * @param spectrumMinerFee
   * @param redeemerPropBytes
   * @param refundPropBytes
   * @param ctx
   * @return
   */
  def apply(apiUrl: String,
            swapAssetTicker: String,
            baseAmount: Long,
            slippageTolerancePercentage: Double,
            nitro: Double,
            spectrumMinerFee: Long,
            redeemerPropBytes: ErgoValue[Coll[java.lang.Byte]],
            refundPropBytes: ErgoValue[ProveDlog]
           )(implicit ctx: BlockchainContext): SpectrumERG2TokenContractBuilder = {

    val swapBuyContract: ErgoTree = JavaHelpers.decodeStringToErgoTree(n2t_v3_swapsell_ergotree)
    val swapBuyConstants: IndexedSeq[Values.Constant[SType]] = swapBuyContract.constants

    val assetPool: SpectrumErgoPool = SpectrumDex.getPoolFromAssetTicker(swapAssetTicker).asInstanceOf[SpectrumErgoPool]
    val assetAmounts: (Long, Long) = assetPool.getPoolInfo(apiUrl)
    val minQuoteAmount: Long = AbstractSpectrumSwapContractBuilder.calcMinOutputAmount(baseAmount, slippageTolerancePercentage, assetAmounts._1, assetAmounts._2, assetPool.feeNum, SpectrumDex.SPECTRUM_ERGO_POOL_FEE_DENOM)
    val minExecutionFee: Long = AbstractSpectrumSwapContractBuilder.calcMinExecutionFee(spectrumMinerFee)
    val swapExtremums: Option[(Double, (Long, Long, Long, Long))] = AbstractSpectrumSwapContractBuilder.calcSwapExtremums(minExecutionFee, nitro, minQuoteAmount)
    //val dexFeePerTokenFraction: (BigInt, BigInt) = GuapSwapUtils.decimalToFraction(BigDecimal(swapExtremums.get._1))
    val exFeePerTokenDenom: Long = AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.to(swapBuyConstants(1)).getValue.asInstanceOf[Long]
    val delta: Long = AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.to(swapBuyConstants(2)).getValue.asInstanceOf[Long]
    val spectrumIsQuote: Boolean = false
    val maxExFee: Long = swapExtremums.get._2._2
    val poolNFT: ErgoValue[Coll[java.lang.Byte]] = ErgoValue.of(assetPool.getPoolIdAsErgoId.getBytes)
    val quoteId: ErgoValue[Coll[java.lang.Byte]] = ErgoValue.of(assetPool.assetY.getAssetIdAsErgoId.getBytes)
    val spectrumId: ErgoValue[Coll[java.lang.Byte]] = ErgoValue.of(ErgoBlockchainAssets.SPF.getAssetIdAsErgoId.getBytes)
    val minerPropBytes: ErgoValue[Coll[java.lang.Byte]] = AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.to(swapBuyConstants(28)).asInstanceOf[ErgoValue[Coll[java.lang.Byte]]]
    val maxMinerFee: Long = AbstractSpectrumSwapContractBuilder.isoSConstantToErgoValue.to(swapBuyConstants(31)).getValue.asInstanceOf[Long]
    val feeNum: Int = assetPool.feeNum.toInt
    val feeDenom: Int = SpectrumDex.SPECTRUM_ERGO_POOL_FEE_DENOM.toInt

    new SpectrumERG2TokenContractBuilder(
      exFeePerTokenDenom,
      delta,
      baseAmount,
      feeNum,
      refundPropBytes,
      spectrumIsQuote,
      maxExFee,
      poolNFT,
      redeemerPropBytes,
      quoteId,
      minQuoteAmount,
      spectrumId,
      feeDenom,
      minerPropBytes,
      maxMinerFee
    )

  }

}
