{

    // ===== Contract Information ===== //
    // Name: GuapSwap Proxy
    // Description: This contract guards the proxy box which is used by miners to receiver their mining rewards and to interact with the GuapSwap protocol.
    // Version: 3.0.0
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
    // @guapswapServiceData: Coll[(Int, Coll[Long])]

    // ===== GuapSwap Service Data ===== //
    // Coll[
    //     (
    //         serviceIndex,
    //         Coll(
    //                 dexServiceMinerFee,
    //                 percentageOfServiceAllocationNum,
    //                 percentageOfServiceAllocationDenom
    //         )
    //     )
    // ]

    // ===== Service Index ===== //
    // 0 => Spectrum Dex Service
    // More indices will be supported when other DEXs become available.

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
                val serviceIndex: Int = guapswapDatum._1
                val dexServiceContractBytesHash: Coll[Byte] = $serviceContractsBytesHash(serviceIndex)

                val dexServiceMinerFee: Long = guapswapDatum._2(0)
                val percentageOfServiceAllocationNum: Long = guapswapDatum._2(1)
                val percentageOfServiceAllocationDenom: Long = guapswapDatum._2(2)

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