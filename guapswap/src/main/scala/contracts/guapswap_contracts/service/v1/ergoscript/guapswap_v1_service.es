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
    // R4: Long MinerFee

    // ===== Relevant Transactions ===== //
    // 1. GuapSwap Service Tx
    // Inputs: GuapSwapService
    // Data Inputs: None
    // Outputs: GuapSwapDexService1, ... , GuapSwapDexServiceM, MinerFee
    // Context Variables: GuapSwapService

    // ===== Compile Time Constants ($) ===== //
    // $userPK: SigmaProp
    // $serviceContractsBytesHash: Coll[Coll[Byte]]
    // $guapswapServiceFee: (Long, Long)
    // $guapswapServiceFeeAddress: SigmaProp

    // ===== Context Variables (@) ===== //
    // @guapswapServiceData: Coll[Coll[Long]]

    // ===== GuapSwap Service Data ===== //
    // Coll[
    //     Coll(
    //          dexServiceMinerFee,
    //          percentageOfServiceAllocationNum,
    //          percentageOfServiceAllocationDenom
    //     )
    // ]

    // ===== Global Variables ===== //
    val minerFeeErgoTreeBytesHash: Coll[Byte] = fromBase16("e540cceffd3b8dd0f401193576cc413467039695969427df94454193dddfb375")
    val minerFee: Long  = SELF.R4[Long].get
    val guapswapServiceFeeAmount: Long = (SELF.value * $guapswapServiceFee._1) / $guapswapServiceFee._2
    val serviceAllocation: Long = SELF.value - guapswapServiceFee - minerFee

    // ===== GuapSwap Service Tx ===== //
    val validGuapSwapServiceTx: Boolean = {

        // Outputs
        val guapswapServiceFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-2)
        val minerFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-1)

        val validDexServiceBoxes: Boolean = {

            @guapswapServiceData.indices.forall({ (i: Int) =>
            
                val dexServiceBoxOUT: Box = OUTPUTS(i)
                val guapswapDatum: Coll[Long] = @guapswapServiceData(i)
                val dexServiceContractBytesHash: Coll[Byte] = $serviceContractsBytesHash(i)

                val dexServiceMinerFee: Long = guapswapDatum(0)
                val percentageOfServiceAllocationNum: Long = guapswapDatum(1)
                val percentageOfServiceAllocationDenom: Long = guapswapDatum(2)

                val validDexServiceBox: Boolean = {

                    val validAllocation: Boolean = {

                        val allocationAmount: Long = (serviceAllocation * percentageOfServiceAllocationNum) / percentageOfServiceAllocationDenom

                        (dexServiceBoxOUT.value == allocationAmount)

                    }

                    val validDexServiceContract: Boolean = {

                        (blake2b256(dexServiceBoxOUT.propositionBytes) == dexServiceContractBytesHash)

                    }
                    
                    val validDexServiceMinerFee: Boolean = {

                        (dexServiceBoxOUT.R4[Long].get == serviceMinerFee)

                    }

                    allOf(Coll(
                        validAllocation,
                        validDexServiceContract,
                        validDexServiceMinerFee
                    ))

                }

                validDexServiceBox

            })

        }

        val validGuapSwapServiceFee: Boolean = {

            allOf(Coll(
                (guapswapServiceFeeBoxOUT.value == guapswapServiceFeeAmount),
                (guapswapServiceFeeBoxOUT.propositionBytes == guapswapServiceFeeAddress.propBytes)
            ))

        }

        val validMinerFee: Boolean = {

            allOf(Coll(
                (minerFeeBoxOUT.value == minerFee),
                (blake2b256(minerFeeBoxOUT.propositionBytes) == minerFeeErgoTreeBytesHash)
            ))

        }

        allOf(Coll(
            validDexServiceBoxes,
            validGuapSwapServiceFee,
            validMinerFee
        ))

    }

    (sigmaProp(validGuapSwapServiceTx) && $userPK) || $userPK

}