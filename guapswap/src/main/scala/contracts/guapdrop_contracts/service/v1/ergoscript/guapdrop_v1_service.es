{

    // ===== Contract Information ===== //
    // Name: GuapDrop Service
    // Description: This is the service contract guarding the box for the GuapDrop protocol,
    //              which is used to ensure that all recipients are correct and receive the appropriate amount of ERG.
    // Version: 1.0.0
    // Author: Luca D'Angelo (luca.dangelo@guapswap.org)

    // ===== Box Contents ===== //
    // Tokens
    // None
    // Registers
    // R4: Long MinerFee

    // ===== Relevant Transactions ===== //
    // 1. GuapDrop Tx
    // Inputs: GameDropService
    // DataInputs: None
    // Outputs: Receiver1, ... , ReceiverM, GuapDropFee, MinerFee
    // Context Variables: ReceiverData
    
    // ===== Compile Time Constants ($) ===== //
    // $userPK: SigmaProp
    // $guapdropServiceFee: (Long, Long)
    // $guapdropServiceFeeAddress: SigmaProp

    // ===== Context Variables (@) ===== //
    // @receiverData: Coll[(SigmaProp, (Long, Long))]

    // ===== Receiver Data ===== //
    // Coll(
    //         (
    //             receiverAddress,
    //             (
    //                 receiverPercentageNum,
    //                 receiverPercentageDenom
    //             )
    //         )
    // )

    // ===== Global Variables ===== //
    val minerFeeErgoTreeBytesHash: Coll[Byte] =fromBase16("e540cceffd3b8dd0f401193576cc413467039695969427df94454193dddfb375")
    val @receiverData: Coll[(SigmaProp, (Long, Long))] = getVar[Coll[(SigmaProp, (Long, Long))]](0).get
    val minerFee: Long = SELF.R4[Long].get
    val guapdropServiceFeeAmount: Long = (SELF.value * $guapdropServiceFee._1) / $guapdropServiceFee._2
    val serviceAllocation: Long = SELF.value - guapdropFeeAmount - minerFee

    // ===== GuapDrop Tx ===== //
    val validGuapDropTx: Boolean = {

        // Outputs
        val guapdropFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-2)
        val minerFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-1)

        val validReceiverBoxes: Boolean = {

            @receiverData.indices.forall({ (i: Int) => 
            
                val receiverBoxOUT: Box = OUTPUTS(i)
                val receiverDatum: (SigmaProp, (Long, Long)) = @receiverData(i)
                val receiverAddress: SigmaProp = receiverDatum._1
                val receiverPercentageNum: Long = data._2._1
                val receiverPercentageDenom: Long = data._2._1

                val validReceiverBox: Boolean = {

                    val validAllocation: Boolean = {

                        val receiverAmount: Long = (userAmount * receiverPercentageNum) / receiverPercentageDenom
                        
                        (receiverBoxOUT.value = receiverAmount)

                    }

                    val validReceiverAddress: Boolean = {

                        (receiverBoxOUT.propositionBytes = receiverAddress.propBytes)

                    }
                    
                    
                    allOf(Coll(
                        validAllocation,
                        validReceiverAddress                    
                    ))

                }

                validReceiverBox

            })

        }

        val validGuapDropFee: Boolean = {

            allOf(Coll(
                (guapdropFeeBoxOUT.value == guapdropServiceFeeAmount),
                (guapdropFeeBoxOUT.propositionBytes == $guapdropServiceFeeAddress.propBytes)
            ))

        }

        val validMinerFee: Boolean = {

            allOf(Coll(
                (minerFeeBoxOUT.value == minerFee),
                (minerFeeBoxOUT.propositionBytes == minerFeeAddress.propBytes)
            ))

        }

        allOf(Coll(
            validReceiverBoxes,
            validGuapDropFee,
            validMinerFee
        ))

    }

    (sigmaProp(validGuapDropTx) && $userPK) || $userPK

}