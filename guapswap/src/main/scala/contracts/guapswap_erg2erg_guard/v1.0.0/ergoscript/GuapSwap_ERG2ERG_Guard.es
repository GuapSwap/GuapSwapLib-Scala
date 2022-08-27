{

    // ===== Contract Information ===== //
    // Name: GuapSwap ERG-2-ERG Guard
    // Description: Contract that governs ERG-2-ERG swaps from the GuapSwap proxy contract.
    // Version: 1.0.0
    // Author: Luca D'Angelo

    // ===== ERG-2-ERG Tx ===== //
    // Description: Part of the GuapSwap tx which only deals with ERG-2-ERG sends.
    // Data Inputs: None
    // Inputs: GuapSwapProxy, ERG2ERGGuard
    // Context Extension Variables: GuapSwapData
    // Outputs: ReceiverAddresses

    // ===== Tx Swap Type Ids ===== //
    // 0: ERG-2-ERG
    // 1: ERG-2-Token
    // 2: BaseToken-2-BaseToken
    // 3: BaseToken-2-ERG
    // 4: BaseToken-2-Token

    // ===== Dex Type Ids ===== //
    // 0: Spectrum.Dex

    // ===== Dex Swap Type Ids ===== //
    // 0: ERG-2-Token
    // 1: Token-2-ERG
    // 2: Token-2-Token

    // ===== GuapSwap Data ===== //
    // Coll[
    //    (
    //        baseTokenId: Coll[Byte],
    //        Coll[
    //            (
    //                (
    //                    (
    //                        swapTokenId: Coll[Byte], 
    //                        (
    //                            percentageOfBaseTokenPayoutNum: Long, 
    //                            paercentageOfBaseTokenPayoutDenom: Long
    //                        )
    //                    ),  
    //                    (
    //                        receiverAddress: Coll[Byte], 
    //                        refundAddress: SigmaProp
    //                    )
    //                ), 
    //                (
    //                    (
    //                        dexId: Byte, 
    //                        dexSwapTypeId
    //                    ), 
    //                    (
    //                        dexSwapBoxErgoTreeBytes: Coll[Byte], 
    //                        dexFee: Long
    //                    )
    //                )
    //            )
    //        ]
    //    )
    // ]

    // ===== Hard-Coded Constants ===== //
    val UserPK: SigmaProp = _UserPK
    val GuapSwapProxyContractErgoTreeBytesHash: Coll[Byte] = blake2b256(_GuapSwapProxyContractErgoTreeBytes)
    val GuapSwapMinerFundErgoTreeBytesHash: Coll[Byte] = blake2b256(_GuapSwapMinerFundErgoTreeBytes)
    val BaseTokenId: Coll[Byte] = fromBase16("0000000000000000000000000000000000000000000000000000000000000000")
    val AssignedTxTypeId: Byte = 0 // ERG-2-ERG
    val MaxAllowedGuapSwaps: Byte = _MaxAllowedGuapSwaps

    Coll((start, stop), (start, stop), (start, stop))
    // ===== Context Extension Variables ===== //
    val NumberOfBabelBoxes: Byte = getVar[Byte](0).get
    val TxTypeId: Byte = getVar[Byte](1).get
    val IsBaseTokenSourceForGuapSwapMinerFee: Boolean = getVar[Boolean](2).get // both of these need to be context extension variables
    val GuapSwapMinerFee: Long = getVar[Long](3).get
    val GuapSwapMinerFundFeePercentageNum: Long = getVar[Long](4).get
    val GuapSwapMinerFundFeePecentageDenom Long = getVar[Long](5).get
    val guapswapData: Coll[(Coll[Byte], Coll[(((Coll[Byte], (Long, Long)), (Coll[Byte], SigmaProp)), ((Byte, Byte), (Coll[Byte], Long)))])] = getVar[Coll[(Coll[Byte], Coll[(((Coll[Byte], (Long, Long)), (Coll[Byte], SigmaProp)), ((Byte, Byte), (Coll[Byte], Long)))])]](6).get

    // ===== Relevant Variables ===== //
    val 

    val validERG2ERGuapSwap: Boolean = {

        // ===== Inputs ===== //
        val guapswapProxyIN: Box = INPUTS(NumberOfBabelBoxes)

        // ===== Outputs ===== //
        val guapswapsOUT: Coll[Box] = OUTPUTS.slice(NumberOfBabelBoxes, OUTPUTS.size-2)
        val erg2ergReceiversOUT: Coll[Box] = guapswapsOUT.slice(0, guapswapData.fold(0L, {(guapswapDatum) => guapswapDatum._2.size + acc}))
        val guapswapMinerFundBoxOUT: Box = OUTPUTS(OUTPUTS.size-2)
        val minerFeeBox: Box = OUTPUTS(OUTPUTS.size-1)
        val baseTokenGuapSwapBoxes: Coll[Coll[Box]] = guapswapData.fold(Coll[Coll[Box]](), {(guapswapDatum) => erg2ergReceiversOUT.slice(acc(acc.size).size, guapswapDatum._2.size)})

        // ===== Relevant Variables ===== //
        val totalERGPayout: Long = guapswapProxyIN.value
        val guapswapMinerFundFeeAmount: Long = totalERGPayout * GuapSwapMinerFundFeePercentageNum / GuapSwapMinerFundFeePercentageDenom
        val leftoverERGPayout: Long = if (IsBaseTokenSourceForGuapSwapMinerFee) totalERGPayout - guapswapMinerFundFeeAmount - GuapSwapMinerFee else totalERGPayout - guapswapMinerFundFeeAmount

        val validTxTypeId: Boolean = (TxTypeId == AssignedTxTypeId)

        val validErg2ErgReceivers: Boolean = {

            val guapswapsANDguapswapData = erg2ergReceiversOUT.zip(guapswapDatum)
            
            guapswapsANDguapswapData.forall({ (boxANDguapswapDatum) => 

                val validBaseTokenId: Boolean = ()

                val validBaseTokenSwaps: Boolean = {

                    boxANDguapswapDatum._2.forall({ (baseTokenSwap) =>

                        val validBaseTokenPayoutPercentage: Boolean = {

                            val baseTokenPayoutPercentageTuple: (Long, Long) = baseTokenSwap._1._1._2
                            val baseTokenPayoutPercentageNum: Long = payoutPercentageTuple._1
                            val baseTokenPayoutPercentageDenom: Long = payoutPercentageTuple._2



                        }

                        val validReceiverAddress: Boolean = {

                            

                        }

                    })

                }

            })

        }

        val validGuapSwapAmounts: Boolean = (guapswapsOUT.size <= MaxAllowedGuapSwaps)

        val validGuapSwapMinerFundFee: Boolean = {



        }

        val validGuapSwapMinerFee: Boolean = {



        }

        allOf(Coll(
            validTxTypeId,
            validErg2ErgReceivers,
            validGuapSwapAmounts
            validGuapSwapMinerFundFee,
            validGuapSwapMinerFee
        ))

    }

    sigmaProp(validERG2ERGuapSwap)

    // ===== Helper Methods ===== //


}