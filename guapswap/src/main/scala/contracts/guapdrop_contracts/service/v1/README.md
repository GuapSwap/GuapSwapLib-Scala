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
- None

### Relevant Transactions
1. GuapDrop Tx
- Inputs: GuapDropService
- DataInputs: None
- Outputs: Receiver1, ... , ReceiverM, GuapDropFee, MinerFee
- Context Variables: ReceiverData

### Compile Time Constants ($)
- $userPK: SigmaProp
- $guapdropServiceFee: (Long, Long)
- $guapdropServiceFeeAddress: SigmaProp

### Context Variables (@)
- @receiverData: Coll[(SigmaProp, (Long, Long))]
- @minerFee: Long
