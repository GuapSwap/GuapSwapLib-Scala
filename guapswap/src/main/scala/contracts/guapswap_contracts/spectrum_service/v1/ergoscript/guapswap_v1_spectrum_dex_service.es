{

    // ===== Contract Information ===== //
    // Name: GuapSwap Spectrum Dex Service Contract
    // Description: This contract guards the Spectrum Dex service contract which ensures the ERG in this box gets swapped in the appropriate way through the Spectrum Dex bots.
    // Version: 1.0.0
    // Author: Luca D'Angelo (luca.dangelo@guapswap.org)

    // ===== Box Contents ===== //
    // Tokens
    // None
    // Registers
    // R4: Long         MinerFee

    // ===== Relevant Transactions ===== //
    // 1. GuapSwap Spectrum Dex Service Tx
    // Inputs: GuapSwapSpectrumDexService
    // Data Inputs: None
    // Outputs: SpectrumERG2TokenSwapBox1, ... , SpectrumERG2TokenSwapBoxM, MinerFee
    // Context Variables: None

    // ===== Compile Time Constants ($) ===== //
    // $userPK: SigmaProp
    // $spectrumDexERG2TokenProxyContractBytes: Coll[Byte]

    // ===== Context Variables (@) ===== //
    // @SpectrumData: Coll[(Coll[Long], (Coll[Long], (Coll[Int], (Coll[ProveDlog], (Coll[Boolean], Coll[Coll[Byte]])))))]

    // ===== Spectrum Data ===== //
    // Coll[
    //     (
    //         Coll(dexFee, percentageOfServiceAllocationNum, percentageOfServiceAllocationDenom),
    //         (
    //             Coll(exFeePerTokenDenom, delta, baseAmount, maxExFee, minQuoteAmount, maxMinerFee),
    //             (
    //                 Coll(feeNum, feeDenom),
    //                 (
    //                     Coll(refundProp),
    //                     (
    //                         Coll(spectrumIsQuote),
    //                         Coll(poolNFT, redeemerPropBytes, quoteId, spectrumId, minerPropBytes)
    //                     )
    //                 )
    //             )
    //         )
    //     )
    // ]

    // ===== Spectrum ERG2Token Constants ===== //
    // {1}  -> ExFeePerTokenDenom: Long
    // {2}  -> Delta: Long
    // {3}  -> BaseAmount: Long
    // {4}  -> FeeNum: Int
    // {5}  -> RefundProp: ProveDlog
    // {10} -> SpectrumIsQuote: Boolean
    // {11} -> MaxExFee: Long
    // {13} -> PoolNFT: Coll[Byte]
    // {14} -> RedeemerPropBytes: Coll[Byte]
    // {15} -> QuoteId: Coll[Byte]
    // {16} -> MinQuoteAmount: Long
    // {23} -> SpectrumId: Coll[Byte]
    // {27} -> FeeDenom: Int
    // {28} -> MinerPropBytes: Coll[Byte]
    // {31} -> MaxMinerFee: Long

    // ===== Relevant Variables ===== //

    // ===== GuapSwap Spectrum Dex Service Tx ===== //
    val validGuapSwapSpectrumDexServiceTx: Boolean = {



    }

    sigmaProp(validGuapSwapSpectrumDexServiceTx)

}