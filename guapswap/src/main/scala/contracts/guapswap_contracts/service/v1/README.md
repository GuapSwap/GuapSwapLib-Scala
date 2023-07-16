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
- R4: Long MinerFee

### Relevant Transactions
1. GuapSwap Service Tx
- Inputs: GuapSwapService
- DataInputs: None
- Outputs: GuapSwapDexService1, ... , GuapSwapDexServiceM, ... MinerFee
- Context Variables: None

### Compile Time Constants ($)
- $userPK
- $spectrumDexServiceContractBytesHash: Coll[Byte]

### Context Variables (@)
- $guapswapServiceData: Coll[(Long, Long)]

