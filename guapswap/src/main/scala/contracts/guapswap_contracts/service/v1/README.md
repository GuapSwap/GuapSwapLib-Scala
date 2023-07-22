# GuapSwap: Service Contract - v1.0.0

## Contract

[ErgoScript](ergoscript/guapswap_v1_service.es)

## Documentation

### Description
This contract guards the service box for the GuapSwap service and ensures all dex swapping services are proper outputs.

### Box Contents
Tokens
- None

Registers
- None

### Relevant Transactions
1. GuapSwap Service Tx
- Inputs: GuapSwapService
- DataInputs: None
- Outputs: GuapSwapDexService1, ... , GuapSwapDexServiceM, GuapSwapFee, MinerFee
- Context Variables: GuapSwapServiceData

### Compile Time Constants ($)
- $userPK: SigmaProp
- $dexServiceContractsBytesHash: Coll[Coll[Byte]]
- $guapswapServiceFee: (Long, Long)
- $guapswapServiceFeeAddress: SigmaProp

### Context Variables (@)
- @guapswapServiceData: Coll[(Int, (Long, Long))]
- @minerFee: Long
