package org.guapswap.commons.utils

import java.text.DecimalFormat

object CommonUtils {

  /**
   * Method to convert a decimal number to a rational fraction.
   *
   * @param number The number to convert into a fraction.
   * @return Tuple of the numerator and denominator representing the decimal number.
   */
  def decimalToFraction(number: BigDecimal): (BigInt, BigInt) = {
    val formatOptions: DecimalFormat = new DecimalFormat("#.##")
    val fmtN: String = formatOptions.format(number)
    val Array(whole: String, decimals: String) = fmtN.split("\\.")
    val numDecimals: Int = decimals.length
    val denominator: BigInt = BigInt(10).pow(numDecimals)
    val numerator: BigInt = BigInt(whole) * denominator + BigInt(decimals)
    (numerator, denominator)
  }

}
