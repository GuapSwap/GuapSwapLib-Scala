package dex

import blockchain.Blockchain

trait DexPools {

    val _dexBlockchain: Blockchain
    var _dexPools: Map[String, DexPool]

}


