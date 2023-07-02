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
- Context Variables: None

### Compile Time Constants ($)
- $guapdropFee: (Long, Long)
- $guapdropFeeAddressByte: Coll[Byte]
- $minerFee: Long
- $minerFeeAddress: Coll[Byte]
- $userPK: SigmaProp
- $receivers: Coll[(SigmaProp, (Long, Long))]

### Context Variables (@)
- None

