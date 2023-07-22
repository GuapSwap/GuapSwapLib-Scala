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
    // None

    // ===== Relevant Transactions ===== //
    // 1. GuapSwap Service Tx
    // Inputs: GuapSwapService
    // Data Inputs: None
    // Outputs: GuapSwapDexService1, ... , GuapSwapDexServiceM, GuapSwapFee, MinerFee
    // Context Variables: GuapSwapServiceData

    // ===== Compile Time Constants ($) ===== //
    // $userPK: SigmaProp
    // $dexServiceContractsBytesHash: Coll[Coll[Byte]]
    // $guapswapServiceFee: (Long, Long)
    // $guapswapServiceFeeAddress: SigmaProp

    // ===== Context Variables (@) ===== //
    // @guapswapServiceData: Coll[(Int, (Long, Long))]
    // @minerFee: Long

    // ===== GuapSwap Service Data ===== //
    // Coll(
    //         (
    //             serviceIndex,
    //             (
    //                  percentageOfServiceAllocationNum,
    //                  percentageOfServiceAllocationDenom
    //             )
    //         )
    // )

    // ===== Service Index ===== //
    // 0 => Spectrum Dex Service
    // More indices will be supported when other DEXs become available.

    // ===== Global Variables ===== //
    val minerFeeErgoTreeBytesHash: Coll[Byte] = fromBase16("e540cceffd3b8dd0f401193576cc413467039695969427df94454193dddfb375")
    val @guapswapServiceData: Coll[(Int, Coll[Long])] = getVar[Coll[(Int, Coll[Long])]](0).get
    val @minerFee: Long = getVar[Long](1).get
    val guapswapServiceFeeAmount: Long = (SELF.value * $guapswapServiceFee._1) / $guapswapServiceFee._2
    val serviceAllocation: Long = SELF.value - guapswapServiceFee - @minerFee

    // ===== GuapSwap Service Tx ===== //
    val validGuapSwapServiceTx: Boolean = {

        // Outputs
        val guapswapServiceFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-2)
        val minerFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-1)

        val validDexServiceBoxes: Boolean = {

            @guapswapServiceData.indices.forall({ (i: Int) =>
            
                val dexServiceBoxOUT: Box = OUTPUTS(i)
                val guapswapDatum: Coll[Long] = @guapswapServiceData(i)
                val serviceIndex: Int = guapswapDatum._1
                val dexServiceContractBytesHash: Coll[Byte] = $dexServiceContractsBytesHash(serviceIndex)

                val percentageOfServiceAllocationNum: Long = guapswapDatum._2._1
                val percentageOfServiceAllocationDenom: Long = guapswapDatum._2._2

                val validDexServiceBox: Boolean = {

                    val validAllocation: Boolean = {

                        val allocationAmount: Long = (serviceAllocation * percentageOfServiceAllocationNum) / percentageOfServiceAllocationDenom

                        (dexServiceBoxOUT.value == allocationAmount)

                    }

                    val validDexServiceContract: Boolean = {

                        (blake2b256(dexServiceBoxOUT.propositionBytes) == dexServiceContractBytesHash)

                    }
                
                    allOf(Coll(
                        validAllocation,
                        validDexServiceContract
                    ))

                }

                validDexServiceBox

            })

        }

        val validGuapSwapFee: Boolean = {

            allOf(Coll(
                (guapswapServiceFeeBoxOUT.value == guapswapServiceFeeAmount),
                (guapswapServiceFeeBoxOUT.propositionBytes == $guapswapServiceFeeAddress.propBytes)
            ))

        }

        val validMinerFee: Boolean = {

            allOf(Coll(
                (minerFeeBoxOUT.value == @minerFee),
                (blake2b256(minerFeeBoxOUT.propositionBytes) == minerFeeErgoTreeBytesHash)
            ))

        }

        allOf(Coll(
            validDexServiceBoxes,
            validGuapSwapFee,
            validMinerFee
        ))

    }

    (sigmaProp(validGuapSwapServiceTx) && $userPK) || $userPK

}