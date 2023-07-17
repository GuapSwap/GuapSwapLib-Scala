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
1. GuapSwap Service Tx
- Inputs: GuapSwapProxy
- DataInputs: None
- Outputs: GuapSwapService1, ... , GuapSwapServiceN
- Context Variables: GuapSwapServiceData

### Compile Time Constants ($)
- $userPK: SigmaProp
- $serviceContractsBytesHash: Coll[Coll[Byte]]
- $guapswapServiceFee: (Long, Long)
- $guapswapServiceFeeAddress: SigmaProp

### Context Variables (@)
- @guapswapServiceData: Coll[Coll[Long]]

