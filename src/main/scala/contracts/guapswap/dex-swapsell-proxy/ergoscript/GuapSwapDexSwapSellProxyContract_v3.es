{
    // ===== Contract Information =====  //
    // Name: GuapSwapDexSwapSellProxyContract
    // Description: Proxy contract that holds the miner's payout from the mining pool and will perform a swap-sell with a dex or a refund.
    // Version: 3.0
    // Author: Luca D'Angelo

    // ===== GuapSwap Proxy Box ===== //
    // Value: MinerPayout (ERG)
    // Registers: None
    // Tokens: None
    
    // ===== Mining Pool Payout Tx ===== //
    // Description: This tx sends the miner their share of the mining profits for the block(s) found by the mining pool.
    // Inputs: MiningPoolBox
    // DataInputs: None
    // Context Extension Variables: None
    // Outputs: DexSwapSellProxyBox

    // ===== GuapSwap Tx ===== //
    // Description: The miner is able to swap their ERG for a maximum of 10 unique tokens. The amount of each token can be in any percentage ratio of the input payout, and sent to anyone. 
    // Inputs: DexSwapSellProxyBox(es)
    // DataInputs: None
    // Context Extension Variables: TxTypeID: Int, ProtocolMinerFee: Long, GuapSwapDatums: Coll((((recipientAddress: SigmaProp, propBytes: Coll[Byte]), (payoutPercentageNum: Long, payoutPercentageDenom: Long)), ((dexID: Int, dexFee: Long), tokenID: Coll[Byte])))
    // Outputs: DexSwapSellBox(es) => (ERG, DEX_1, DEX_2, ... , DEX_N), ProtocolFeeBox, ProtocolMinerFeeBox

    // ===== Refund Tx ===== //
    // Description: Refund the mining payout funds locked within this proxy contract back to the user. 
    // Inputs: DexSwapSellProxyBox(es)
    // DataInputs: None
    // Context Extension Variables: None
    // Outputs: RefundBox, ProtocolMinerFeeBox

    // ===== GuapSwap Tx Types ===== //
    // 0 => Refund
    // 1 => GuapSwap Tx

    // ===== GuapSwap Dex Datum IDs ===== //
    // 0 => ERG
    // 1 => ErgoDex

    // ===== Hard-Coded Constants ===== //
    val UserPK: SigmaProp = _UserPK
    val ProtocolFeePercentageNum: Long = _ProtocolFeePercentageNum
    val ProtocolFeePercentageDenom: Long = _ProtocolFeePercentageDenom
    val ProtocolFeeContractHash: Coll[Byte] = _ProtocolFeeContractHash

    val ERG_TokenID: Coll[Byte] = _ERG_TokenID
    val SigUSD_TokenID: Coll[Byte] = _SigUSD_TokenID
    val SigRSV_TokenID: Coll[Byte] = _SigRSV_TokenID
    val tokenIDCollection: Coll[Coll[Byte]] = Coll(ERG_TokenID, SigUSD_TokenID, SigRSV_TokenID)
    
    // ===== Initial Context Extension Variables ===== //
    val TxTypeID: Int = getVar[Int](0).get
    val ProtocolMinerFee: Long = getVar[Long](1).get

    // ===== Initial Variables ===== //
    val totalPayout: Long = INPUTS.fold(0L. {(acc: Long, input: Box) => acc + input.value})

    // Check tx type based on ID
    if (TxTypeID == 0) {

        // ===== Perform Refund Tx ===== //

        // Check conditions for a valid refund tx
        val validRefundTx: Boolean = {

            // Check that the inputs are only DexSwapSellProxyBoxes
            val validDexSwapSellProxyBoxes: Boolean = {

                // All inputs to the tx must have the DexSwapSellProxy contract
                (INPUTS.forall({(input: Box) => input.propositionBytes == SELF.propositionBytes}))

            }

            // Check for a valid refund box
            val validRefundBox: Boolean = {

                val refundBox: Box = OUTPUTS(0)                          // The first output box should be the refund box
                val refundAmount: Long = totalPayout - ProtocolMinerFee  // The refund amount takes into account the protocol miner fee

                allOf(Coll(
                    (refundBox.value == refundAmount)                 // The refund box must have the correct refund amount value in it   
                    (refundBox.propositionBytes == UserPK.propBytes)  // The refund must go back to the user
                ))

            }

            // Check for valid output size
            val validOutputSize: Boolean = {
                (OUTPUTS.size == 2)
            }

            allOf(Coll(
                validDexSwapSellProxyBoxes,
                validRefundBox,
                validOutputSize
            ))

        }

        sigmaProp(validRefundTx) && UserPK

    } else if (TxTypeID == 1) {

        // ===== Perform GuapSwap Tx ===== //

        // Additional Context Extension Variables
        val GuapSwapDatums: Coll((((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) = getVar[Coll((((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Int)))].getOrElse(Coll((((UserPK, UserPK.propBytes), (1L, 1L)), ((0, 1L), Coll(0.toByte))))) = Coll((((recipientAddress: SigmaProp, propBytes: Coll[Byte]), (payoutPercentageNum: Long, payoutPercentageDenom: Long)), ((dexID: Int, dexFee: Long), tokenID: Coll[Byte])))

        // ===== ERG Datums ===== //
        val ergDatumID: Int = 0
        val ergDatums: Coll((((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) = GuapSwapDatums.filter({(datum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) => dexDatumFilter(datum, ergDatumID)})
        val ergPayoutPercentageFractions: Coll[(Long, Long)] = ergDatums.flatMap({(ergDatum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) => ergDatum._1._2})


        // ===== Ergo Dex Datums ===== //
        val ergodexDatumID: Int = 1
        val ergodexDatums: Coll((((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) = GuapSwapDatums.filter({(datum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) => dexDatumFilter(datum, ergodexDatumID)})
        val ergodexErgoTreeBytesANDRecipientAddressPairs: Coll[(SigmaProp, Coll[Byte])] = ergodexDatums.flatMap({(ergodexDatum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) => ergodexDatum._1._1})
        val ergodexPayoutPercentageFractions: Coll[(Long, Long)] = ergodexDatums.flatMap({(ergodexDatum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) => ergodexDatum._1._2})
        val ergodexIndividualTotalDexFees: Coll[Long] = ergodexDatums.flatMap({(ergodexDatum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) => ergodexDatum._2._1._2})

        val payoutPercentageFractions: Coll[(Long, Long)] = SwapTokenParams.flatMap({(swapTokenParam: ((Long, Long), SigmaProp)) => swapTokenParam._1})
        val recipientAddresses: Coll[SigmaProp] = SwapTokenParams.flatMap({(swapTokenParam: ((Long, Long), SigmaProp)) => swapTokenParam._2})
        val ergoTreeTemplateBytesANDrecipientAddressesPair: Coll[(Coll[Byte], SigmaProp)] = DexSwapSellErgoTreeTemplateBytes.zip(recipientAddresses)

        // Fee variables for GuapSwap Tx
        val protocolFee: Long = (ProtocolFeePercentageNum * totalPayout) / ProtocolFeePercentageDenom
        val serviceFee: Long = protocolFee + ProtocolMinerFee
        val totalDexFees: Long = IndividualTotalDexFees.fold(0L, {(acc: Long, individualTotalDexFee: Long) => acc + individualTotalDexFee})
        val totalFees: Long = serviceFee + totalDexFees
        val totalPayoutAfterServiceFee: Long = totalPayout - serviceFee


        val validGuapSwapTx: Boolean = {
            
            val validDexSwapSellProxyBoxes: Boolean = {

                // All inputs to the tx must have the DexSwapSellProxy contract
                (INPUTS.forall({(input: Box) => input.propositionBytes == SELF.propositionBytes}))
                
            }

            val validDexSwapBoxes: Boolean = {

            }

            val validProtocolFeeBox: Boolean = {

            }

            val validOutputSize: Boolean = {

                val minDexSwapBoxesAmount: Int = 1
                val maxDexSwapBoxesAmount: Int = 10
                val minOutputSize: Int = minDexSwapBoxesAmount + 2
                val maxOutputSize: Int = maxDexSwapBoxesAmount + 2
                val protocolFeeBoxIndex: Int = OUTPUTS.indexOf(OUTPUTS.size-2)
                val dexSwapBoxesAmount: Int = // TODO: insert sum here

                val validDexSwapBoxesAmount: Boolean = {
                    allOf(Coll(

                    ))
                }

                val validOutputAmounts: Boolean = {
                    allOf(Coll(
                        (OUTPUTS.size >= minOutputSize),
                        (OUTPUTS.size <= maxOutputSize)
                    ))
                }

                allOf(Coll(
                    validDexSwapBoxesAmount,
                    validMinOutputSize,
                    validMaxOutputSize
                ))

            }

            allOf(Coll(
                validDexSwapSellProxyBoxes,
                validDexSwapBoxes,
                validProtocolFeeBox,
                validOutputSize
            ))

        }

        sigmaProp(validGuapSwapTx) && UserPK

    } else {
        sigmaProp(false)
    }

    // Check that the total percentages inserted into contract sum to 1 (i.e. all outputs are dex swap boxes, no ERG output via a change box)
    val isValidPayoutPercentages: Boolean = isValidPayoutPercentages(payoutPercentageFractions)

    // Check the amount of dex boxes
    val dexSwapSellBoxAmount: Int = {      

        if (isValidPayoutPercentages) {

            // ERG IS NOT an output token type
            OUTPUTS.size-2

        } else {

            // ERG IS an output token type (i.e. there will be a change box)
            OUTPUTS.size-3

        }

    }



    // (INPUTS.forAll({(input: Box) => input.propositionBytes == SELF.propositionBytes}) && (OUTPUTS.size == 2): Boolean => Refund
    // (INPUTS.forAll({(input: Box) => input.propositionBytes == SELF.propositionBytes}) && (OUTPUTS.size >= 3 && OUTPUTS.size <= 12): Boolean => GuapSwap Tx

    // Payout percentage calculation
    val payoutPercentageValues: Coll[Long] = payoutPercentages.map({(payoutPercentageFraction: (Long, Long)) => calculatePayoutPercentage((payoutPercentageFraction, totalPayoutAfterServiceFee))})
    val payoutPercentageValuesAndIndividualTotalDexFeesPair: Coll[(Long, Long)] = payoutPercentageValues.zip(IndividualTotalDexFees)

    // Substituion of constants in ErgoTree template bytes 
    val newDexSwapSellErgoTreeBytes: Coll[Coll[Byte]] = ergoTreeTemplateBytesAndRecipientAddressesPair.map({tuple: (Coll[Byte], SigmaProp) => getNewDexSwapSellErgoTreeBytes(tuple)})
    val newDexSwapSellErgoTreeBytesAndPayoutPercentageValuesPair: Coll[(Coll[Byte], Long)] = newDexSwapSellErgoTreeBytes.zip(payoutPercentageValues)

    // Check the tx type
    if (TxTypeID.isDefined) {
        
        if (TxTypeID.get == 0) {
            
            // ===== Perform Refund Tx ===== //

            // Check conditions for a valid Refund Tx
            val validRefund: Boolean = {

                // Check for valid input
                val validInputs: Boolean = {
                    INPTUS.forall({(input: Box) => input.propositionBytes == SELF.propositionBytes})
                }

                // Check that a valid refund box is an output
                val validRefundBox: Boolean = {

                    // The refund box must be the first output box
                    val refundBox: Box = OUTPUTS(0)

                    allOf(Coll(
                        (refundBox.value == totalPayout - GuapSwapProtocolMinerFee),    // The refund box amount contains the total payout minus the miner fee
                        (refundBox.propositionBytes == UserPK.propBytes),               // The refund box must be in the users wallet 
                        (OUTPUTS.size == 2)                                             // There are only two outputs   
                    ))

                }

                allOf(Coll(
                    validInputs,
                    validRefundBox
                ))
            }

            // User must sign the transaction
            sigmaProp(validRefund) && UserPK

        } else {
            
            // ===== Perform GuapSwap Tx ===== //

            // Check conditions for a valid GuapSwap Tx
            val validGuapSwap: Boolean = {

                // Check conditions for valid output dex swap boxes
                val validDexSwapBoxes: Boolean = {

                    val dexSwapBoxes: Coll[Box] = OUTPUTS.slice(0, dexBoxAmount)
                    val dexSwapBoxesAndNewDexSwapSellErgoTreeBytesAndPayoutPercentageValuesPair: Coll[(Box, (Coll[Byte], Long))] = dexSwapBoxes.zip(newDexSwapSellErgoTreeBytesAndPayoutPercentageValuesPair)
                    
                    allOf(Coll(
                        
                        // Check that total payout of the inputs to be greater than the total fees needed to be paid.
                        (totalPayout > totalFees),                                       
                        
                        // Check that the payout value is greater than the total dex fee for that particular swap
                        payoutPercentageValuesAndIndividualTotalDexFeesPair.forall({tuple: (Long, Long) => tuple._1 > tuple._2}),

                        // Check that the dex box value equals the payout percentage value
                        dexSwapBoxesAndNewDexSwapSellErgoTreeBytesAndPayoutPercentageValuesPair.forall({(element: (Box, (Coll[Byte], Long))) => element._1.value == element._2._2}),

                        // Check that the dex box propopsition bytes equals the recipient substitute ErgoTree bytes
                        dexSwapBoxesAndNewDexSwapSellErgoTreeBytesAndPayoutPercentageValuesPair.forall({(element: (Box, (Coll[Byte], Long))) => element._1.propositionBytes == element._2._1})

                    ))

                }

                // Check conditions for a valid output protocol fee box
                val validProtocolFeeBox: Boolean = {

                    val guapswapProtocolFeeBox: Box = OUTPUTS(dexSwapSellBoxAmount)
                    
                    allOf(Coll(
                        (protocolFeeBox.value == protocolFee),
                        (blake2b256(protocolFeeBox.propositionBytes) == GuapSwapProtocolFeeContractHash)
                    ))
                    
                }

                // Check that the outputs size is constrained: A minimum of 1 box (i.e. a refund) or a maximum of 10 boxes (i.e. one box containing ERG the other 9 being different tokens)
                val validOutputSize: Boolean = {
                    (OUTPUTS.size >= 3) && (OUTPUTS.size <= 12)
                }

                // All conditions must be valid
                allOf(Coll(
                    validDexSwapBoxes,
                    validProtocolFeeBox,
                    validOutputSize
                ))
                
            }

            // User must sign the transaction
            sigmaProp(validGuapSwap) && UserPK

        }

    } else {

        // Contract fails
        sigmaProp(false)

    }

    // ===== Helper Methods ===== //

    // Filter for dex datums
    def dexDatumFilter(_datum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Int)), _dexDatumID: Int): Boolean = {

        // Parameter parsing
        val dexData = _datum._2._1._2

        (dexID == _dexDatumID)

    }

    // Get recipient address and ErgoTree bytes pairs
    def getRecipientAddressANDErgoTreeBytesPairs(_datums: Coll((((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte])))): Coll((SigmaProp, Coll[Byte])) = { }
    val ergodexRecipientAddressANDErgoTreeBytePairs: Coll[(SigmaProp, Coll[Byte])] = ergodexDatums.flatMap({(ergodexDatum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) => ergodexDatum._1._1})
    val ergodexPayoutPercentageFractions: Coll[(Long, Long)] = ergodexDatums.flatMap({(ergodexDatum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) => ergodexDatum._1._2})
    val ergodexIndividualTotalDexFees: Coll[Long] = ergodexDatums.flatMap({(ergodexDatum: (((SigmaProp, Coll[Byte]), (Long, Long)), ((Int, Long), Coll[Byte]))) => ergodexDatum._2._1._2})

    // Perform constants substitution on collection of ErgoTree bytes
    def getNewDexSwapSellErgoTreeBytes(_tuple: (Coll[Byte], SigmaProp)): Coll[Byte] = {

        // Tuple parameters
        val ergoTreeTemplateBytes: Coll[Byte] = _tuple._1
        val recipientAddress: SigmaProp = _tuple._2

        // Position within ErgoTree constants collection to replace
        val positions_SigmaProp: Coll[Int] = Coll(0)

        // Values representing the SigmaProp type
        val newValues_SigmaProp: Coll[SigmaProp] = Coll(recipientAddress)

        // Insert the new constants into the ErgoTree constants collection
        val newDexSwappSellErgoTreeBytes_SigmaProp: Coll[Byte] = substConstants(ergoTreeTemplateBytes, positions_SigmaProp, newValues_SigmaProp)
        
        newDexSwappSellErgoTreeBytes_SigmaProp

    }

    // Check that the sum of the percentages is 1
    def isValidPayoutPercentages(_payoutPercentageFractions: Coll[(Long, Long)]): Boolean = {

        // Calculate the product of the payout percentage denominators
        val productOfPayoutPercentageDenoms: Long = _payoutPercentages.fold(1L, {(prod: Long, tuple: (Long, Long)) => prod * tuple._2})

        // Calculate the sum of the products of the payout percentages and the product of the payout percentage denominators
        val sumOfProductsOfPayoutPercentagesAndProductOfPayoutPercentageDenoms: Long = _payoutPercentages.fold(0L {(acc: Long, tuple: (Long, Long)) => acc + ((tuple._1 * productOfPayoutPercentageDenoms) / tuple._2)})

        // Check for equality
        sumOfProductsOfPayoutPercentagesAndProductOfPayoutPercentageDenoms == productOfPayoutPercentageDenoms

    }

    // Calculate the payout ratio for each token to swap => assumes valid percentage ratios
    def calculatePayoutPercentage(_tuple: ((Long, Long), Long)): Long = {

        // Tuple parameters
        val payoutPercentageFraction: (Long, Long) = _tuple._1
        val totalPayoutAfterServiceFee: Long = _tuple._2

        // Extract values from fraction tuple
        val payoutPercentageNum: Long = payoutPercentageFraction._1
        val payoutPercentageDenom: Long= payoutPercentageFraction._2

        // Multiply the total payout with the payout percentage ratio
        (payoutPercentageNum * totalPayoutAfterServiceFee) / payoutPercentageDenom

    }

    // Check if the value is in the range
    def isValueInRange(_value: (Long, Long)): Boolean = {
        
        // Tuple parameters
        val onchainValue: Long = _value._1
        val offchainValue: Long = _value._2

        // Compute the percentage error
        val error: Long = (onchainValue - offchainValue) * 100L
        val percentageError: Long = error / offchainValue

        // Check that percentage error falls within margins
        allOf(Coll(
            (percentageError < 3L),
            (percentageError > -3L)
        ))  
    
    }
   
}