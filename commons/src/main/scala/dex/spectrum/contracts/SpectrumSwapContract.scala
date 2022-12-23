package dex.spectrum.contracts

import contracts.GuapSwapContract
import org.ergoplatform.appkit.NetworkType

abstract case class SpectrumSwapContract(
                                 override val version: String,
                                 override val ergoscript: String,
                                 override val constants: Map[String, Object],
                                 override val networkType: NetworkType
                               ) extends GuapSwapContract(version, ergoscript, constants, networkType) {

  /**
   * Calculate min output amount of ErgoDex LP
   *
   * @param swapInputAmount
   * @param maxSlippagePercentage
   * @param xAmount
   * @param yAmount
   * @param feeNum
   * @param feeDenom
   * @return Minimum output token amount from ErgoDex LP for given input amount.
   */
  def calculateMinOutputAmount(baseAmount: Long, maxSlippagePercentage: Double, xAssetAmount: Long, yAssetAmount: Long, feeNumerator: Long, feeDenominator: Long): Long = {

    val swapInputAmount: BigInt = BigInt.apply(baseAmount)
    val xAmount: BigInt = BigInt.apply(xAssetAmount)
    val yAmount: BigInt = BigInt.apply(yAssetAmount)
    val feeNum: BigInt = BigInt.apply(feeNumerator)
    val feeDenom: BigInt = BigInt.apply(feeDenominator)

    val slippage: BigInt = BigInt.apply((maxSlippagePercentage * 100D).toInt)
    val outputAmount: BigInt = (yAmount * swapInputAmount * feeNum) / ((xAmount + (xAmount * slippage) / (BigInt.apply(100) * BigInt.apply(100))) * feeDenom + swapInputAmount * feeNum)
    val outputAmountLong: Long = outputAmount.toLong

    outputAmountLong

  }

  /**
   * Calculate the swap extremums
   *
   * @param minExecutionFee
   * @param nitro
   * @param minOutputAmount
   * @return Tuple containing the swam extremums.
   */
  def swapExtremums(minExecutionFee: Long, nitro: Double, minOutputAmount: Long): (Double, (Long, Long, Long, Long)) = {

    val exFeePerToken: Double = minExecutionFee.toDouble / minOutputAmount.toDouble
    val adjustedMinExecutionFee: Double = Math.floor(exFeePerToken * minOutputAmount)
    val maxExecutionFee: Double = Math.floor(minExecutionFee * nitro)
    val maxOutputAmount: Double = Math.floor(maxExecutionFee / exFeePerToken)
    val extremums = (exFeePerToken, (adjustedMinExecutionFee.toLong, maxExecutionFee.toLong, minOutputAmount, maxOutputAmount.toLong))

    extremums

  }

}
