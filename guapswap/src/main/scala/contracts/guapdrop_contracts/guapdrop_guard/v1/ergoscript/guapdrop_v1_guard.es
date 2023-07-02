{

    // ===== Contract Information ===== //
    // Name: GuapDrop Guard
    // Description: This contract represents the guard box for the GuapDrop protocol, 
    //              which is used to ensure that all recipients are correct and receive the appropriate amount of ERG.
    // Version: 1.0.0
    // Author: Luca D'Angelo (luca.dangelo@guapswap.org)

    // ===== Box Contents ===== //
    // Tokens
    // None
    // Registers
    // None

    // ===== Relevant Transactions ===== //
    // 1. GuapDrop Tx
    // Inputs: GameDropGuard
    // DataInputs: None
    // Outputs: Receiver1, ... , ReceiverM, GuapDropFee, MinerFee
    // Context Variables: None
    
    // ===== Compile Time Constants ($) ===== //
    // $guapdropFee: (Long, Long)
    // $guapdropFeeAddressBytes: Coll[Byte]
    // $minerFee: Long
    // $minerFeeAddress: Coll[Byte]
    // $userPK: SigmaProp
    // $receivers: Coll[(SigmaProp, (Long, Long))]

    // ===== Context Variables (@) ===== //
    // None

    // ===== Relevant Variables ===== //
    val userAmountAfterMinerFee: Long = (SELF.value - $minerFee)
    val guapdropFeeAmount: Long = (userAmountAfterMinerFee * $guapdropFee._1) / $guapdropFee._2
    val userAmount: Long = userAmountAfterMinerFee - guapdropFeeAmount

    // ===== GuapDrop Tx ===== //
    val validGuapDropTx: Boolean = {

        // Outputs
        val guapdropFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-2)
        val minerFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-1)

        val validReceivers: Boolean = {

            $receivers.indices.forall({ (index: Int) => 
            
                val receiverBoxOUT: Box = OUTPUTS(index)
                val data: (SigmaProp, (Long, Long)) = $receivers.get(index)
                val receiverPK: SigmaProp = data._1
                val receiverPercentage: (Long, Long) = data._2
                val receiverAmount: Long = (userAmount * receiverPercentage._1) / receiverPercentage._2
                
                allOf(Coll(
                    (receiverBoxOUT.value = receiverAmount),
                    (receiverBoxOUT.propositionBytes = receiverPK.propBytes)
                ))

            })

        }

        val validGuapDropFee: Boolean = {

            allOf(Coll(
                (guapdropFeeBoxOUT.value == guapdropFeeAmount),
                (guapdropFeeBoxOUT.propositionBytes == $guapdropFeeAddressBytes)
            ))

        }

        val validMinerFee: Boolean = {

            allOf(Coll(
                (minerFeeBoxOUT.value == $minerFee),
                (minerFeeBoxOUT.propositionBytes == $minerFeeAddress)
            ))

        }

        allOf(Coll(
            validReceivers,
            validGuapDropFee,
            validMinerFee
        ))

    }

    sigmaProp(validGuapDropTx) && $userPK

}