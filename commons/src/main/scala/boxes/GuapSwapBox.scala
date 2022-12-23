package boxes

import org.ergoplatform.appkit.impl.BlockchainContextImpl
import org.ergoplatform.appkit.{ErgoValue, ErgoContract, ErgoToken, ContextVar, InputBox, OutBox}

/**
  * Trait representing an abstract box used within the GuapSwap protocol.
  */
trait GuapSwapBox {

  protected var _value: Long
  protected var _contract: ErgoContract
  protected var _tokens: List[ErgoToken]
  protected var _registers: List[ErgoValue[_]]
  protected var _contextVars: List[ContextVar]
  protected var _ctx: BlockchainContextImpl

  def outBox: OutBox = {

    var box = ctx.newTxBuilder().outBoxBuilder()
      .value(value)
      .contract(contract)
    if (_tokens.size > 0) box = box.tokens(tokens: _*)
    if (_registers.size > 0) box = box.registers(registers: _*)
    box.build()

  }

  def inputBox(withTxId: String, withIndex: Short): InputBox = this.outBox.convertToInputWith(withTxId, withIndex)

  def value = _value
  def value_= (newValue: Long) = _value = newValue

  def contract = _contract
  def contract_= (newContract: ErgoContract) = _contract = newContract

  def tokens = _tokens
  def tokens_= (newTokens: List[ErgoToken]) = _tokens = newTokens

  def registers = _registers
  def registers_= (newRegisters: List[ErgoValue[_]]) = _registers = registers

  def contextVars = _contextVars
  def contextVars_= (newContextVars: List[ContextVar]) = _contextVars = newContextVars

  def ctx = _ctx
  def ctx_= (newCtx: BlockchainContextImpl) = _ctx = newCtx

}