# GuapDrop: Service Contract - v1.0.0

## Contract

[ErgoScript](ergoscript/guapdrop_v1_service.es)

## Documentation

### Description
This is the service contract guarding the box for the GuapDrop protocol, which is used to ensure that all recipients are correct and receive the appropriate amount of ERG.

### Box Contents
Tokens
- None

Registers
- R4: (Long, Long)                      GuapDropFee
- R5: Coll[Byte]                        GuapDropFeeAddressBytes
- R6: Long                              MinerFee
- R7: SigmaProp                         UserPK
- R8: Coll[(SigmaProp, (Long, Long))]   ReceiverData

### Relevant Transactions
1. GuapDrop Tx
- Inputs: GuapDropService
- DataInputs: None
- Outputs: Receiver1, ... , ReceiverM, GuapDropFee, MinerFee
- Context Variables: None

### Compile Time Constants ($)
- None

### Context Variables (@)
- None

