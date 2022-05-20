{
    // ===== Contract Information =====  //
    // Name: GuapSwap Dex SwapSell Proxy Contract
    // Description: Proxy contract that holds the miner's payout from the mining pool and will perform a swap-sell with a dex.
    // Version: 3.0
    // Author: Luca D'Angelo
    
    // ===== Mining Pool Payout Tx ===== //
    // Inputs: Mining Pool Box
    // Outputs: GuapSwap Dex SwapSell Proxy Box

    // ===== GuapSwap Tx ===== //
    // Inputs: GuapSwap Dex SwapSell Proxy Box
    // Outputs: Dex SwapSell Box, GuapSwap Protocol Fee Box, GuapSwap Protocol Miner Fee Box

    // ===== GuapSwap Refund Tx ===== //
    // Inputs: GuapSwap Dex SwapSell Proxy Box
    // Outputs: Miner Wallet Box, GuapSwap Protocol Miner Fee Box

    // ===== GuapSwap Tx Type IDs ===== //
    // 0 => Refund
    // 1 => ERG2TokenXYZ

    // Hard-coded constants
    val UserPK: SigmaProp = _UserPK
    val GuapSwapProtocolFeePercentageNum: Long = _GuapSwapProtocolFeePercentageNum
    val GuapSwapProtocolFeePercentageDenom: Long = _GuapSwapProtocolFeePercentageDenom
    val GuapSwapProtocolFeeContractHash: Coll[Byte] = _GuapSwapProtocolFeeContractHash

    // Context extension variables
    val TxTypeID: Option[Int] = getVar[Int](0)
    val GuapSwapProtocolMinerFee: Long = getVar[Long](1).get
    val SwapTokenParams: Coll[((Long, Long), SigmaProp)] = getVar[Coll[((Long, Long), SigmaProp)]](2).get
    val DexSwapSellErgoTreeTemplateBytes: Coll[Coll[Byte]] = getVar[Coll[Coll[Byte]]](3).get
    val IndividualTotalDexFees: Coll[Long] = getVar[Coll[Long]](4).get

    // Other variables derived from context extension variables for GuapSwap Tx
    val payoutPercentageFractions: Coll[(Long, Long)] = SwapTokenParams.flatMap({(swapTokenParam: ((Long, Long), SigmaProp)) => swapTokenParam._1})
    val recipientAddresses: Coll[SigmaProp] = SwapTokenParams.flatMap({(swapTokenParam: ((Long, Long), SigmaProp)) => swapTokenParam._2})
    val ergoTreeTemplateBytesANDrecipientAddressesPair: Coll[(Coll[Byte], SigmaProp)] = DexSwapSellErgoTreeTemplateBytes.zip(recipientAddresses)

    // Check that the total percentages inserted into contract sum to 1 (i.e. all outputs are dex swap boxes, no ERG output via a change box)
    val isValidPayoutPercentages: Boolean = isValidPayoutPercentages(payoutPercentageFractions)

    // Check the amount of dex boxes
    val dexBoxAmount: Int = {      

        if (isValidPayoutPercentages) {

            // ERG IS NOT an output token type
            OUTPUTS.size-2

        } else {

            // ERG IS an output token type (i.e. there will be a change box)
            OUTPUTS.size-3

        }
    }

    // Fee variables for GuapSwap Tx
    val totalPayout: Long = INPUTS.fold(0L. {(acc: Long, input: Box) => acc + input.value})
    val protocolFee: Long = (GuapSwapProtocolFeePercentageNum * totalPayout) / GuapSwapProtocolFeePercentageDenom
    val serviceFee: Long = protocolFee + GuapSwapProtocolMinerFee
    val totalDexFees: Long = IndividualTotalDexFees.fold(0L, {(acc: Long, individualTotalDexFee: Long) => acc + individualTotalDexFee})
    val totalFees: Long = serviceFee + totalDexFees
    val totalPayoutAfterServiceFee: Long = totalPayout - serviceFee

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

                // Check that a valid refund box is an output
                val validRefundBox: Boolean = {

                    val refundBox: Box = OUTPUTS(0)

                    allOf(Coll(
                        (refundBox.value == totalPayout - GuapSwapProtocolMinerFee),
                        (refundBox.propositionBytes == UserPK.propBytes)
                    ))

                }
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

                        // Check that the dex box propopsition bytes equals the recipient substitue ErgoTree bytes
                        dexSwapBoxesAndNewDexSwapSellErgoTreeBytesAndPayoutPercentageValuesPair.forall({(element: (Box, (Coll[Byte], Long))) => element._1.propositionBytes == element._2._1})

                    ))

                }

                // Check conditions for a valid output protocol fee box
                val validProtocolFeeBox: Boolean = {

                    val protocolFeeBox: Box = OUTPUTS(dexBoxAmount)
                    
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
        (percentageError < 3L) && (percentageError > -3L)
    
    }
   
}