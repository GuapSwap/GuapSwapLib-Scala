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
    // @spectrumData: Coll[(Coll[Long], (Coll[Long], (Coll[Int], (Coll[ProveDlog], (Coll[Boolean], Coll[Coll[Byte]])))))]

    // ===== Spectrum Data ===== //
    // Coll[
    //     (
    //         Coll(percentageOfServiceAllocationNum, percentageOfServiceAllocationDenom),
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

    // ===== Global Variables ===== //
    val minerFeeErgoTreeBytesHash: Coll[Byte] = fromBase16("e540cceffd3b8dd0f401193576cc413467039695969427df94454193dddfb375")
    val minerFee: Long  = SELF.R4[Long].get
    val serviceAllocation: Long = SELF.value - minerFee
    val @spectrumData: Coll[(Coll[Long], (Coll[Long], (Coll[Int], (Coll[ProveDlog], (Coll[Boolean], Coll[Coll[Byte]])))))] = getVar[Coll[(Coll[Long], (Coll[Long], (Coll[Int], (Coll[ProveDlog], (Coll[Boolean], Coll[Coll[Byte]])))))]](0).get
    val spectrumConstantsPositions_Long: Coll[Int]      = Coll(1, 2, 3, 11, 16, 31)
    val spectrumConstantsPositions_Int: Coll[Int]       = Coll(4, 27)
    val spectrumConstantsPositions_ProveDlog: Coll[Int] = Coll(5)
    val spectrumConstantsPositions_Boolean: Coll[Int]   = Coll(10)
    val spectrumConstantsPositions_ByteColl: Coll[Int]  = Coll(13, 14, 15, 23, 28)

    // ===== GuapSwap Service Tx ===== //
    val validGuapSwapServiceTx: Boolean = {

        // Outputs
        val minerFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-1)

        val validDexServiceBoxes: Boolean = {



        }

        val validMinerFee: Boolean = {

            allOf(Coll(
                (minerFeeBoxOUT.value == minerFee),
                (blake2b256(minerFeeBoxOUT.propositionBytes) == minerFeeErgoTreeBytesHash)
            ))

        }

        allOf(Coll(
            validDexServiceBoxes,
            validMinerFee
        ))

    }

    (sigmaProp(validGuapSwapServiceTx) && $userPK) || $userPK

}