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
    // 2: Token-2-Token (never actually used, this type of swap is simulated using Token-2-ERG and ERG-2-Token)

    // ===== GuapSwap Data ===== //
    // Coll[
    //    (
    //        baseTokenId: Coll[Byte],
    //        Coll[
    //            (
    //                (
    //                    (
    //                        (
    //                          swapTokenId: Coll[Byte],
    //                          outputIndex: Int 
    //                        ), 
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
    val ERGTokenId: Coll[Byte] = fromBase16("0000000000000000000000000000000000000000000000000000000000000000")
    val AssignedTxTypeId: Byte = 0 // ERG-2-ERG
    val MaxAllowedGuapSwaps: Byte = _MaxAllowedGuapSwaps

    // ===== Context Extension Variables ===== //
    val NumberOfBabelBoxes: Byte = getVar[Byte](0).get
    val TxTypeId: Byte = getVar[Byte](1).get
    val IsBaseTokenSourceForGuapSwapMinerFee: Boolean = getVar[Boolean](2).get
    val GuapSwapMinerFee: Long = getVar[Long](3).get
    val GuapSwapMinerFundFeePercentageNum: Long = getVar[Long](4).get
    val GuapSwapMinerFundFeePecentageDenom Long = getVar[Long](5).get
    val guapswapDatum = getVar[(Coll[Byte], Coll[((((Coll[Byte], Int), (Long, Long)), (Coll[Byte], SigmaProp)), ((Byte, Byte), (Coll[Byte], Long)))])](6).get

    val validERG2TokenGuapSwap: Boolean = {

        // ===== Relevant Inputs ===== //
        val guapswapProxyIN: Box = INPUTS(NumberOfBabelBoxes)

        // ===== Relevant Outputs ===== //
        val guapswapMinerFundBoxOUT: Box = OUTPUTS(OUTPUTS.size-2)
        val minerFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-1)

        // ===== Relevant Variables ===== //
        val totalERGPayout: Long = guapswapProxyIN.value
        val guapswapMinerFundFeeAmount: Long = totalERGPayout * GuapSwapMinerFundFeePercentageNum / GuapSwapMinerFundFeePercentageDenom
        val leftoverERGPayout: Long = if (IsBaseTokenSourceForGuapSwapMinerFee) totalERGPayout - guapswapMinerFundFeeAmount - GuapSwapMinerFee else totalERGPayout - guapswapMinerFundFeeAmount
        val totalDexFees: Long = guapswapDatum._2.fold(0L, { (erg2TokenSwap) => acc + erg2TokenSwap._2._2._2 })
        val totalPayoutAfterFees: Long = leftoverERGPayout - totalDexFees

        val validGuapSwapProxy: Boolean = (blake2b256(guapswapProxyIN.propositionBytes) == GuapSwapProxyContractErgoTreeBytesHash)

        val validTxTypeId: Boolean = (TxTypeId == AssignedTxTypeId)

        val validPayout: Boolean = if (IsBaseTokenSourceForGuapSwapMinerFee) (totalERGPayout > totalDexFees + guapswapMinerFundFeeAmount + GuapSwapMinerFee) else (totalERGPayout > totalDexFees + guapswapMinerFundFeeAmount)

        val validErg2TokenReceivers: Boolean = {

            val validErgTokenId: Boolean = (guapswapDatum._1 == BaseTokenID)

            val validErg2TokenSwaps: Boolean = {

                guapswapDatum._2.forall({ (erg2TokenSwap) =>
                
                    // Relevant variables for the receiver output box
                    val outputIndex: Int = erg2TokenSwap._1._1._1._2
                    val erg2TokenReceiverOUT: Box = OUTPUTS(outputIndex)
                    
                    val baseTokenPayoutPercentageTuple: (Long, Long) = erg2TokenSwap._1._1._2
                    val baseTokenPayoutPercentageNum: Long = payoutPercentageTuple._1
                    val baseTokenPayoutPercentageDenom: Long = payoutPercentageTuple._2
                    val baseTokenPayoutPercentage: Long = (totalPayoutAfterFees * baseTokenPayoutPercentageNum) / baseTokenPayoutPercentageDenom
                    val dexFee: Long = erg2TokenSwap._2._2._2

                    val receiverAddress: Coll[Byte] = erg2TokenSwap._1._2._1
                    val refundAddress: SigmaProp = erg2TokenSwap._1._2._1
                    val dexSwapBoxErgoTreeBytes: Coll[Byte] = erg2TokenSwap._2._2._1

                    val validBaseTokenPayoutPercentage: Boolean = (baseTokenPayoutPercentage > dexFee)

                    val validReceiverAddress: Boolean = {

                        // Position within ErgoTree constants collection to replace
                        val positions_SigmaProp: Coll[Int] = Coll(0)

                        // Values representing the SigmaProp type
                        val newValues_SigmaProp: Coll[SigmaProp] = Coll(refundAddress)

                        // Insert the new constants into the ErgoTree constants collection
                        val newDexSwapBoxErgoTreeBytes: Coll[Byte] = substConstants(dexSwapBoxErgoTreeBytes, positions_SigmaProp, newValues_SigmaProp)

                        (newDexSwapBoxErgoTreeBytes == erg2TokenReceiverOUT.propositionBytes)

                    }

                    val validRefundAddress: Boolean = (refundAddress == UserPK)

                    val validDexSwapBoxERGValue: Boolean = (erg2TokenReceiverOUT.value ==  baseTokenPayoutPercentage)

                    allOf(Coll(
                        validBaseTokenPayoutPercentage,
                        validReceiverAddress,
                        validRefundAddress,
                        validDexSwapBoxERGValue
                    ))

                })

            }

            allOf(Coll(
                validErgTokenId,
                validErg2TokenSwaps
            ))

        }

        val validGuapSwapMinerFundBox: Boolean = {

            val validGuapSwapMinerFundFee: Boolean = (guapswapMinerFundBoxOUT.value == guapswapMinerFundFeeAmount)
            val validGuapSwapMinerFundContract: Boolean = (blake2b256(guapswapMinerFundBoxOUT.propositionBytes) == GuapSwapMinerFundErgoTreeBytesHash)
            
            allOf(Coll(
                validGuapSwapMinerFundFee,
                validGuapSwapMinerFundContract
            ))

        }

        val validGuapSwapMinerFee: Boolean = (minerFeeBoxOUT.value == GuapSwapMinerFee)

        allOf(Coll(
            validGuapSwapProxy,
            validTxTypeId,
            validPayout,
            validErg2TokenReceivers,
            validGuapSwapMinerFundBox,
            validGuapSwapMinerFee
        ))

    }

    sigmaProp(validERG2TokenGuapSwap)

}