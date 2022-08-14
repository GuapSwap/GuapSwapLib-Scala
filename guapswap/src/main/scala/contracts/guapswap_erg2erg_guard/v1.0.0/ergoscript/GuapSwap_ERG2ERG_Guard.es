{

    // ===== Contract Information ===== //
    // Name: GuapSwap ERG-2-ERG Guard
    // Description: Contract that governs ERG-2-ERG swaps from the GuapSwap proxy contract.
    // Version: 1.0.0
    // Author: Luca D'Angelo

    // ===== ERG2ERG Tx ===== //
    // Description: Part of the GuapSwap tx which only deals with ERG-2-ERG sends.
    // Data Inputs: None
    // Inputs: GuapSwapProxy, ERG2ERGGuard
    // Context Extension Variables: GuapSwapData
    // Outputs: ReceiverAddresses

    // ===== Hard-Coded Constants ===== //
    val UserPK: SigmaProp = _UserPK
    val GuapSwapMinerFundFeePercentageNum: Long = _GuapSwapMinerFundFeePercentageNum
    val GuapSwapMinerFundFeePecentageDenom Long = _GuapSwapMinerFundFeePercentageDenom
    val MinerFee: Long = _MinerFee
    val IsBaseTokenSourceForMinerFee: Boolean = _IsBaseTokenSourceForMinerFee // both of these need to be context extension variables
    val GuapSwapProxyContractErgoTreeBytesHash: Coll[Byte] = blake2b256(_GuapSwapProxyContractErgoTreeBytes)
    
    // ===== Context Extension Variables ===== //
    val guapswapData: 

}