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
    // 1. Service Selection Tx
    // Inputs: GuapSwapProxy
    // Data Inputs: None
    // Outputs: Service1, ... , ServiceN, MinerFee
    // Context Variables: ServiceData

    // ===== Compile Time Constants ($) ===== //
    // $userPK: SigmaProp
    // $serviceContractsBytesHash: Coll[Coll[Byte]]

    // ===== Context Variables (@) ===== //
    // @serviceData: Coll[(Int, Coll[Long])]
    // @minerFee: Long

    // ===== Service Data ===== //
    // Coll[
    //     (
    //         serviceIndex,
    //         Coll(   
    //                 serviceMinerFee,
    //                 percentageOfServiceAllocationNum,
    //                 percentageOfServiceAllocationDenom
    //         )
    //     )
    // ]

    // ===== Service Index ===== //
    // 0 => GuapSwap Service
    // 1 => GuapDrop Service
    // More indices will be supported when other DEXs become available.

    // ===== Global Variables ===== //
    val minerFeeErgoTreeBytesHash: Coll[Byte] = fromBase16("e540cceffd3b8dd0f401193576cc413467039695969427df94454193dddfb375")
    val @serviceData: Coll[(Int, Coll[Long])] = getVar[Coll[(Int, Coll[Long])]](0).get
    val @minerFee: Long = getVar[Long](1).get
    val serviceAllocation: Long = OUTPUTS.map({ (output: Box) => output.value }).fold(0L, { (acc: Long, curr: Long) => acc + curr }) - @minerFee

    // ===== Service Selection Tx ===== //
    val validServiceSelectionTx: Boolean = {

        // Outputs
        val minerFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-1)

        val validServiceContractBoxes: Boolean = {

             @serviceData.indices.forall({ (i: Int) =>
            
                val serviceContractBoxOUT: Box = OUTPUTS(i)
                val serviceDatum: Coll[Long] = @serviceData(i)
                val serviceIndex: Int = serviceDatum._1
                val serviceContractBytesHash: Coll[Byte] = $serviceContractsBytesHash(serviceIndex)

                val serviceMinerFee: Long = serviceDatum._2(0)
                val percentageOfServiceAllocationNum: Long = serviceDatum._2(1)
                val percentageOfServiceAllocationDenom: Long = serviceDatum._2(2)

                val validServiceContractBox: Boolean = {

                    val validAllocation: Boolean = {

                        val allocationAmount: Long = (serviceAllocation * percentageOfServiceAllocationNum) / percentageOfServiceAllocationDenom

                        (serviceContractBoxOUT.value == allocationAmount)

                    }

                    val validServiceContract: Boolean = {

                        (blake2b256(serviceContractBoxOUT.propositionBytes) == serviceContractBytesHash)

                    }
                    
                    val validServiceMinerFee: Boolean = {

                        (serviceContractBoxOUT.R4[Long].get == serviceMinerFee)

                    }

                    allOf(Coll(
                        validAllocation,
                        validServiceContract,
                        validServiceMinerFee
                    ))

                }

                validServiceContractBox

            })

        }

        val validMinerFee: Boolean = {

            allOf(Coll(
                (minerFeeBoxOUT.value == @minerFee),
                (blake2b256(minerFeeBoxOUT.propositionBytes) == minerFeeErgoTreeBytesHash)
            ))

        }

        allOf(Coll(
            validServiceContractBoxes,
            validMinerFee
        ))

    }

    (sigmaProp(validServiceSelectionTx) && $userPK) || $userPK

}