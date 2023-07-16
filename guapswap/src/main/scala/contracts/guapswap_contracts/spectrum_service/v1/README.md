# GuapSwap: Spectrum Service Contract - v1.0.0

## Contract

[ErgoScript](ergoscript/guapswap_v1_spectrum_service.es)

## Documentation

### Description
This contract guards the Spectrum Dex service contract which ensures the ERG in this box gets swapped in the appropriate way through the Spectrum Dex bots.

### Box Contents
Tokens
- None

Registers
- R4: Long MinerFee

### Relevant Transactions
1. GuapSwap Spectrum Dex Service Tx
- Inputs: GuapSwapSpectrumDexService
- DataInputs: None
- Outputs: SpectrumERG2TokenSwapBox1, ... , SpectrumERG2TokenSwapBoxM, MinerFee
- Context Variables: SpectrumData

### Compile Time Constants ($)
- $userPK: SigmaProp
- $spectrumDexERG2TokenProxyContractBytes: Coll[Byte]

### Context Variables (@)
- @spectrumData: Coll[(Coll[Long], (Coll[Long], (Coll[Int], (Coll[ProveDlog], (Coll[Boolean], Coll[Coll[Byte]])))))]

