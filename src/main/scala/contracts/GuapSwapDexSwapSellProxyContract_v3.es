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

    // Hard-Coded constants
    val UserPK: SigmaProp = _UserPK
    val GuapSwapProtocolFeePercentageNum: Long = _GuapSwapProtocolFeePercentageNum
    val GuapSwapProtocolFeePercentageDenom: Long = _GuapSwapProtocolFeePercentageDenom
    val GuapSwapProtocolFeeContractHash: Coll[Byte] = _GuapSwapProtocolFeeContractHash

    // TxTypeID context extension variable
    val TxTypeID: Option[Int] = getVar[Int](0)

    // Total payout of input boxes
    val totalPayout: Long = INPUTS.fold(0L. {(acc: Long, input: Box) => acc + input.value})

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

            // Context extension variables for GuapSwap Tx
            val GuapSwapProtocolMinerFee: Long = getVar[Long](1).get
            val SwapTokenParams: Coll[((Long, Long), SigmaProp)] = getVar[Coll[((Long, Long), SigmaProp)]](2).get
            val DexSwapSellErgoTreeTemplateBytes: Coll[Coll[Byte]] = getVar[Coll[Coll[Byte]]](3).get
            val IndividualTotalDexFees: Coll[Long] = getVar[Coll[Long]](4).get
            
            // Other variables derived from context extension variables for GuapSwap Tx
            val payoutPercentageFractions: Coll[(Long, Long)] = SwapTokenParams.flatMap(swapTokenParam: ((Long, Long), SigmaProp) => swapTokenParam._1)
            val recipientAddresses: Coll[SigmaProp] = SwapTokenParams.flatMap(swapTokenParam: ((Long, Long), SimgaProp) => swapTokenParam._2)
            val ergoTreeTemplateBytesANDrecipientAddressesPair: Coll[(Coll[Byte], SigmaProp)] = DexSwapSellErgoTreeTemplateBytes.zip(recipientAddresses)

            // Fee variables for GuapSwap Tx
            val protocolFee: Long = (GuapSwapProtocolFeePercentageNum * totalPayout) / GuapSwapProtocolFeePercentageDenom
            val serviceFee: Long = protocolFee + GuapSwapProtocolMinerFee
            val totalDexFees: Long = IndividualTotalDexFees.fold(0L, {(acc: Long, individualTotalDexFee: Long) => acc + individualTotalDexFee})
            val totalFees: Long = serviceFee + totalDexFees
            val totalPayoutAfterServiceFee: Long = totalPayout - serviceFee

            // Payout percentage calculation
            val payoutPercentageValues: Coll[Long] = payoutPercentages.map({(payoutPercentageFraction: (Long, Long)) => calculatePayoutPerctentage(payoutPercentageFraction, totalPayoutAfterServiceFee)})
            val payoutPercentageValuesAndIndividualTotalDexFeesPair: Coll[(Long, Long)] = payoutPercentageValues.zip(IndividualTotalDexFees)

            // Substituion of constants in ErgoTree template bytes 
            val newDexSwapSellErgoTreeBytes: Coll[Coll[Byte]] = ergoTreeTemplateBytesAndRecipientAddressesPair.map({(ergoTreeTemplateBytes: Coll[Byte], recipientAddress: SigmaProp) => getNewDexSwapSellErgoTreeBytes(ergoTreeTemplateBytes, recipientAddress)})
            val newDexSwapSellErgoTreeBytesAndPayoutPercentageValues: Coll[(Coll[Byte], Long)] = newDexSwapSellErgoTreeBytes.zip(payoutPercentageValues)

            // Check conditions for a valid GuapSwap Tx
            val validGuapSwap: Boolean = {

                // Check conditions for valid output dex swap boxes
                val validDexSwapBoxes: Boolean = {

                    val dexSwapBoxes: Coll[Box] = OUTPUTS.slice(0, OUTPUTS.size-2)
                    val dexSwapBoxesAndNewDexSwapSellErgoTreeBytesAndPayoutPercentageValuesPair: Coll[(Box, (Coll[Byte], Long))] = dexSwapBoxes.zip(newDexSwapSellErgoTreeBytesAndPayoutPercentageValues)

                    allOf(Coll(
                        
                        // Check that total payout of the inputs to be greater than the total fees needed to be paid.
                        (totalPayout > totalFees),                                

                         // Check that the total percentages inserted into contract sum to 1  
                        isValidPayoutPercentages(payoutPercentageFractions),       
                        
                        // Check that the payout value is greater than the total dex fee for that particular swap
                        payoutPercentageValuesAndIndividualTotalDexFeesPair.forAll({(payoutPercentageValue: Long, individualTotalDexFee: Long) => payoutPercentageValue > individualTotalDexFee})

                        // Check that the dex box value equals the payout percentage value
                        dexSwapBoxesAndNewDexSwapSellErgoTreeBytesAndPayoutPercentageValuesPair.forAll({(element: (Box, (Coll[Byte], Long))) => element._1.value == element._2._2}),

                        // Check that the dex box propopsition bytes equals the recipient substitue ErgoTree bytes
                        dexSwapBoxesAndNewDexSwapSellErgoTreeBytesAndPayoutPercentageValuesPair.forAll({(element: (Box, (Coll[Byte], Long))) => element._1.propositionBytes == element._2._1})
                    ))

                }

                // Check conditions for a valid output protocol fee box
                val validProtocolFeeBox: Boolean = {
                    val protocolFeeBox: Box = OUTPUTS(OUTPUTS.size-2)
                    allOf(Coll(
                        (protocolFeeBox.value == protocolFee),
                        (blake2b256(protocolFeeBox.propositionBytes) == GuapSwapProtocolFeeContractHash)
                    ))
                }

                // Check that the outputs size is constrained
                val validOutputSize: Boolean = {
                    (OUTPUTS.size >= 3) && (OUTPUTS.size <= 5)
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

        SigmaProp(false)
    }

    // ===== Helper Methods ===== //

    // Perform constants substitution on collection of ErgoTree bytes
    def getNewDexSwapSellErgoTreeBytes(_ergoTreeTemplateBytes: Coll[Byte], _recipientAddress: SigmaProp): Coll[Byte] = {

        // Position within ErgoTree constants collection to replace
        val positions_SigmaProp: Coll[Int] = Coll(0)

        // Values representing the SigmaProp type
        val newValues_SigmaProp: Coll[SigmaProp] = Coll(_recipientAddress)

        // Insert the new constants into the ErgoTree constants collection
        val newDexSwappSellErgoTreeBytes_SigmaProp: Coll[Byte] = substConstants(_ergoTreeTemplateBytes, positions_SigmaProp, newValues_SigmaProp)
        newDexSwappSellErgoTreeBytes_SigmaProp
    }

    // Check that the sum of the percentages is 1
    def isValidPayoutPercentages(_payoutPercentageFractions: Coll[(Long, Long)]): Boolean = {

        // Calculate the product of the payout percentage denominators
        val productOfPayoutPercentageDenoms: Long = _payoutPercentages.fold(1L, {(prod: Long, (payoutPercentageNum: Long, payoutPercentageDenom: Long)) => prod *  payoutPercentageDenom})

        // Calculate the sum of the products of the payout percentages
        val sumOfProductsOfPayoutPercentages: Long = _payoutPercentages.fold(0L {(acc: Long, (payoutPercentageNum: Long, payoutPercentageDenom: Long)) => acc + ((payoutPercentageNum * productOfPayoutPercentageDenoms) / payoutPercentageDenom)})

        // Check for equality
        sumOfProductsOfPayoutPercentages == productOfPayoutPercentageDenoms
    }

    // Calculate the payout ratio for each token to swap => assumes valid percentage ratios
    def calculatePayoutPerctentage(_payoutPercentageFraction: (Long, Long), _totalPayoutAfterServiceFee: Long): Long = {

        // Extract values from tuple
        val payoutPercentageNum: Long = _payoutPercentageFraction._1
        val payoutPercentageDenom: Long= _payoutPercentageFraction._2

        // Multiply the total payout with the payout percentage ratio
        (payoutPercentageNum * _totalPayoutAfterServiceFee) / payoutPercentageDenom
    }

    // Check if the value is in the range
    def isValueInRange(_onchainValue: Long, _offchainValue: Long): Boolean = {
        
        // Compute the percentage error
        val error: Long = (_onchainValue - _offchainValue) * 100L
        val percentageError: Long = error / _offchainValue
        (percentage < 3L) && (percentage > -3L)
    }
   
}