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

    // ===== GuapSwap Spectrum Dex Service Tx ===== //
    val validGuapSwapSpectrumDexServiceTx: Boolean = {

        // Outputs
        val minerFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-1)

        val validSpectrumDexSwapBoxes: Boolean = {

            @spectrumData.indices.forall({ (i: Int) =>

                val spectrumDexSwapBox: Box = OUTPUTS(i)
                
                val spectrumDatum: (Coll[Long], (Coll[Long], (Coll[Int], (Coll[ProveDlog], (Coll[Boolean], Coll[Coll[Byte]]))))) = @spectrumData(i)
                
                val percentageOfServiceAllocationNum: Long = spectrumDatum._1(0)
                val percentageOfServiceAllocationDenom: Long = specturmDatum._1(1)
                val spectrumSwapParams: (Coll[Long], (Coll[Int], (Coll[ProveDlog], (Coll[Boolean], Coll[Coll[Byte]])))) = spectrumData._2

                val validSpectrumDexSwapBox: Boolean = {
                    
                    val validAllocation: Boolean = {

                        val allocationAmount: Long = (serviceAllocation * percentageOfServiceAllocationNum) / percentageOfServiceAllocationDenom
                        
                        (spectrumDexSwapBox.value == allocationAmount)

                    }

                    val validSwapContract: Boolean = {

                        val userParams_Long: Coll[Long]             = spectrumSwapParams._1
                        val userParams_Int: Coll[Int]               = spectrumSwapParams._2._1 
                        val userParams_ProveDlog: Coll[ProveDlog]   = spectrumSwapParams._2._2._1 
                        val userParams_Boolean: Coll[Boolean]       = spectrumSwapParams._2._2._2._1 
                        val userParams_ByteColl: Coll[Coll[Byte]]   = spectrumSwapParams._2._2._2._2

                        val longBytes: Coll[Byte]       = substConstants(spectrumDexERG2TokenProxyContractBytes, spectrumConstantsPositions_Long, userParams_Long)
                        val intBytes: Coll[Byte]        = substConstants(longBytes, spectrumConstantsPositions_Int, userParams_Int)
                        val proveDlogBytes: Coll[Byte]  = substConstants(intBytes, spectrumConstantsPositions_ProveDlog, userParams_ProveDlog)
                        val booleanBytes: Coll[Byte]    = substConstants(proveDlogBytes, spectrumConstantsPositions_Boolean, userParams_Boolean)
                        val byteCollBytes: Coll[Byte]   = substConstants(booleanBytes, spectrumConstantsPositions_ByteColl, userParams_ByteColl)

                        (spectrumDexSwapBox.propositionBytes == byteCollBytes)

                    }

                    allOf(Coll(
                        validAllocation,
                        validSwapContract
                    )) 

                }

                validSpectrumDexSwapBox

            })

        }

        val validMinerFee: Boolean = {

            allOf(Coll(
                (minerFeeBoxOUT.value == minerFee),
                (blake2b256(minerFeeBoxOUT.propositionBytes) == minerFeeErgoTreeBytesHash)
            ))

        }

        allOf(Coll(
            validSpectrumDexSwapBoxes,
            validMinerFee
        ))

    }

    (sigmaProp(validGuapSwapSpectrumDexServiceTx) && $userPK) || $userPK

}