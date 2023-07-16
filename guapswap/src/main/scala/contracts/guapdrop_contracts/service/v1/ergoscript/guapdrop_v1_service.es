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
    // R4: (Long, Long)                     GuapDropFee
    // R5: Coll[Byte]                       GuapDropFeeAddressBytes
    // R6: Long                             MinerFee
    // R7: SigmaProp                        UserPK
    // R8: Coll[(SigmaProp, (Long, Long))]  ReceiverData

    // ===== Relevant Transactions ===== //
    // 1. GuapDrop Tx
    // Inputs: GameDropService
    // DataInputs: None
    // Outputs: Receiver1, ... , ReceiverM, GuapDropFee, MinerFee
    // Context Variables: None
    
    // ===== Compile Time Constants ($) ===== //
    // None

    // ===== Context Variables (@) ===== //
    // None

    // ===== Relevant Variables ===== //
    val guapdropFee: (Long, Long) = SELF.R4[(Long, Long)].get
    val guapdropFeeAddressBytes: Coll[Byte] = SELF.R5[Coll[Byte]].get
    val minerFee: Long = SELF.R6[Long].get
    val userPK: SigmaProp = SELF.R7[SigmaProp].get
    val receiverData: Coll[(SigmaProp, (Long, Long))] = SELF.R8[Coll[(SigmaProp, (Long, Long))]].get
    val minerFeeAddress: SigmaProp = PK("2iHkR7CWvD1R4j1yZg5bkeDRQavjAaVPeTDFGGLZduHyfWMuYpmhHocX8GJoaieTx78FntzJbCBVL6rf96ocJoZdmWBL2fci7NqWgAirppPQmZ7fN9V6z13Ay6brPriBKYqLp1bT2Fk4FkFLCfdPpe")
    val userAmountAfterMinerFee: Long = (SELF.value - minerFee)
    val guapdropFeeAmount: Long = (userAmountAfterMinerFee * guapdropFee._1) / guapdropFee._2
    val userAmount: Long = userAmountAfterMinerFee - guapdropFeeAmount

    // ===== GuapDrop Tx ===== //
    val validGuapDropTx: Boolean = {

        // Outputs
        val guapdropFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-2)
        val minerFeeBoxOUT: Box = OUTPUTS(OUTPUTS.size-1)

        val validReceivers: Boolean = {

            receiverData.indices.forall({ (index: Int) => 
            
                val receiverBoxOUT: Box = OUTPUTS(index)
                val data: (SigmaProp, (Long, Long)) = receiverData.get(index)
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
                (guapdropFeeBoxOUT.propositionBytes == guapdropFeeAddressBytes)
            ))

        }

        val validMinerFee: Boolean = {

            allOf(Coll(
                (minerFeeBoxOUT.value == minerFee),
                (minerFeeBoxOUT.propositionBytes == minerFeeAddress.propBytes)
            ))

        }

        allOf(Coll(
            validReceivers,
            validGuapDropFee,
            validMinerFee
        ))

    }

    sigmaProp(validGuapDropTx) && userPK

}