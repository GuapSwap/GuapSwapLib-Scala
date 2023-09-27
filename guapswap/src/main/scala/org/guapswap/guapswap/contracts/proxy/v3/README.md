# GuapSwap Protocol: Proxy Contract - v3.0.0

## Contract
[ErgoScript](ergoscript/guapswap_v3_proxy.es)

## Documentation

### Description
This contract guards the proxy box which is used by miners to receiver their mining rewards and to interact with the GuapSwap protocol.

### Box Contents
Tokens
- None
  
Registers
- R4: Long MinerFee

### Relevant Transactions
1. Service Selection Tx
- Inputs: GuapSwapProxy
- DataInputs: None
- Outputs: Service1, ... , ServiceN, MinerFee
- Context Variables: ServiceData

### Compile Time Constants ($)
- $userPK: SigmaProp
- $serviceContractsBytesHash: Coll[Coll[Byte]]

### Context Variables (@)
- @serviceData: Coll[(Int, (Long, Long))]
- @minerFee: Long

