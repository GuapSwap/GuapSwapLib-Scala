package org.guapswap.commons.dex.spectrum.spectrum_builders.contract_builders

import builders.contract_builders.ContractBuilder
import org.ergoplatform.appkit.{ErgoValue, Iso}
import org.guapswap.commons.utils.CommonUtils
import sigmastate.{SType, Values}

import scala.math.BigDecimal.double2bigDecimal
import scala.util.control.Breaks.{break, breakable}

abstract class AbstractSpectrumSwapContractBuilder extends ContractBuilder {


}

object AbstractSpectrumSwapContractBuilder {

  def calcMinExecutionFee(minerFee: Long): Long = 3L * minerFee

  def calcAdjustedMinExecutionFee(exFeePerToken: BigDecimal, minOutputAmount: Long): BigDecimal = (exFeePerToken * BigDecimal(minOutputAmount)).setScale(0, BigDecimal.RoundingMode.FLOOR)

  def calcMaxExecutionFee(minExecutionFee: Long, nitro: Double): BigDecimal = (BigDecimal(minExecutionFee) * nitro).setScale(0, BigDecimal.RoundingMode.FLOOR)

  def calcExFeePerToken(minExecutionFee: Long, minOutputAmount: Long): BigDecimal = BigDecimal(minExecutionFee) / BigDecimal(minOutputAmount)

  def calcMaxOutputAmount(maxExecutionFee: BigDecimal, exFeePerToken: BigDecimal): BigDecimal = (maxExecutionFee / exFeePerToken).setScale(0, BigDecimal.RoundingMode.FLOOR)

  def calcMinOutputAmount(baseAmount: Long, maxSlippagePercentage: Double, xAssetAmount: Long, yAssetAmount: Long, feeNumerator: Long, feeDenominator: Long): Long = {

    val swapInputAmount: BigInt = BigInt(baseAmount)
    val xAmount: BigInt = BigInt(xAssetAmount)
    val yAmount: BigInt = BigInt(yAssetAmount)
    val feeNum: BigInt = BigInt(feeNumerator)
    val feeDenom: BigInt = BigInt(feeDenominator)

    val slippage: BigInt = BigInt((maxSlippagePercentage * 100).toLong)

    val outputAmount: BigInt = (yAmount * swapInputAmount * feeNum) / ((xAmount + (xAmount * slippage) / (BigInt(100) * BigInt(100))) * feeDenom + swapInputAmount * feeNum)
    val outputAmountLong: Long = outputAmount.toLong

    outputAmountLong

  }

  /**
   * Calculate the swap extremums
   *
   * @param minExecutionFee
   * @param nitro
   * @param minOutputAmount
   * @return Tuple containing the execution fee per token, the execution fee extremums, and the output amount extremums.
   */
  def calcSwapExtremums(minExecutionFee: Long, nitro: Double, minOutputAmount: Long): Option[(Double, (Long, Long, Long, Long))] = {

    if (minOutputAmount > 0L) {

      var exFeePerToken: BigDecimal = calcExFeePerToken(minExecutionFee, minOutputAmount)

      breakable {
        while (true) {
          val (n: BigInt, d: BigInt) = CommonUtils.decimalToFraction(exFeePerToken)
          if ((n <= Long.MaxValue) & (d <= Long.MaxValue)) {
            break()
          } else {
            val feeStr: String = exFeePerToken.toString
            val idx: Int = feeStr.indexOf(".")
            val decimalsNum: Int = feeStr.substring(idx + 1).length
            exFeePerToken = BigDecimal(exFeePerToken.setScale(decimalsNum - 1, BigDecimal.RoundingMode.HALF_DOWN).toString())
          }
        }
      }

      val adjustedMinExecutionFee: BigDecimal = calcAdjustedMinExecutionFee(exFeePerToken, minOutputAmount)
      val maxExecutionFee: BigDecimal = calcMaxExecutionFee(minExecutionFee, nitro)
      val maxOutputAmount: Long = calcMaxOutputAmount(maxExecutionFee, exFeePerToken).toLong
      val extremums = (exFeePerToken.toDouble, (adjustedMinExecutionFee.toLong, maxExecutionFee.toLong, minOutputAmount, maxOutputAmount))

      Some(extremums)

    } else {
      None
    }

  }

  val isoSConstantToErgoValue: Iso[Values.Constant[SType], ErgoValue[_]] = Iso.isoErgoValueToSValue.andThen(Iso.isoEvaluatedValueToSConstant).inverse

}
