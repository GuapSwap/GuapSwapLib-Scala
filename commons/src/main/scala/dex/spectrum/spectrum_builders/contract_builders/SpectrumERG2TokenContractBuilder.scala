package dex.spectrum.spectrum_builders.contract_builders

import dex.spectrum.SpectrumDex
import org.ergoplatform.appkit.{BlockchainContext, ConstantsBuilder, ErgoContract, ErgoTreeTemplate, ErgoValue}
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
                                           poolNFT: ErgoValue[Coll[Byte]],
                                           redeemerPropBytes: ErgoValue[Coll[Byte]],
                                           quoteId: ErgoValue[Coll[Byte]],
                                           minQuoteAmount: Long,
                                           spectrumId: ErgoValue[Coll[Byte]],
                                           feeDenom: Int,
                                           minerPropBytes: ErgoValue[Coll[Byte]],
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
        .item("RefundProp", refundProp)
        .item("SpectrumIsQuote", spectrumIsQuote)
        .item("MaxExFee", maxExFee)
        .item("PoolNFT", poolNFT)
        .item("RedeemerPropBytes", redeemerPropBytes)
        .item("QuoteId", quoteId)
        .item("MinQuoteAmount", minQuoteAmount)
        .item("SpectrumId", spectrumId)
        .item("FeeDenom", feeDenom)
        .item("MinerPropBytes", minerPropBytes)
        .item("MaxMinerFee", maxMinerFee)
        .build(),
      script
    )

  }

}

object SpectrumERG2TokenContractBuilder {

  final val n2t_v3_swapsell_ergotree: String = "19fe04210400059cdb0205cead0105e01204c80f08cd02217daf90deb73bdf8b6709bb42093fdfaff6573fd47b630e2d3fdd4a8193a74d0404040604020400010105f01504000e2002020202020202020202020202020202020202020202020202020202020202020e2001010101010101010101010101010101010101010101010101010101010101010e20040404040404040404040404040404040404040404040404040404040404040405c00c0101010105f015060100040404020e2003030303030303030303030303030303030303030303030303030303030303030101040406010104d00f0e691005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a573040500050005a09c010100d804d601b2a4730000d6027301d6037302d6049c73037e730405eb027305d195ed92b1a4730693b1db630872017307d806d605db63087201d606b2a5730800d607db63087206d608b27207730900d6098c720802d60a95730a9d9c7e997209730b067e7202067e7203067e720906edededededed938cb27205730c0001730d93c27206730e938c720801730f92720a7e7310069573117312d801d60b997e7313069d9c720a7e7203067e72020695ed91720b731492b172077315d801d60cb27207731600ed938c720c017317927e8c720c0206720b7318909c7e8cb2720573190002067e7204069c9a720a731a9a9c7ec17201067e731b067e72040690b0ada5d9010b639593c2720b731cc1720b731d731ed9010b599a8c720b018c720b02731f7320"
  final val n2t_v3_swapsell_template: String = "d804d601b2a4730000d6027301d6037302d6049c73037e730405eb027305d195ed92b1a4730693b1db630872017307d806d605db63087201d606b2a5730800d607db63087206d608b27207730900d6098c720802d60a95730a9d9c7e997209730b067e7202067e7203067e720906edededededed938cb27205730c0001730d93c27206730e938c720801730f92720a7e7310069573117312d801d60b997e7313069d9c720a7e7203067e72020695ed91720b731492b172077315d801d60cb27207731600ed938c720c017317927e8c720c0206720b7318909c7e8cb2720573190002067e7204069c9a720a731a9a9c7ec17201067e731b067e72040690b0ada5d9010b639593c2720b731cc1720b731d731ed9010b599a8c720b018c720b02731f7320"

}
