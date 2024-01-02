package org.guapswap.commons.dex.spectrum


import org.guapswap.commons.dex.{Dex, DexPool}

import java.nio.file.{Files, Paths}



/**
 * Object representing Spectrum dex.
 */
object SpectrumDex extends Dex {

  override val _dexName: String = "Spectrum Dex"
  override val _dexAssets: SpectrumErgoAssets.type = SpectrumErgoAssets
  override val _dexPools: SpectrumErgoPools.type = SpectrumErgoPools

  // Pool info
  final val SPECTRUM_POOL_CONTRACT_ADDRESS: String = "5vSUZRZbdVbnk4sJWjg2uhL94VZWRg4iatK9VgMChufzUgdihgvhR8yWSUEJKszzV7Vmi6K8hCyKTNhUaiP8p5ko6YEU9yfHpjVuXdQ4i5p4cRCzch6ZiqWrNukYjv7Vs5jvBwqg5hcEJ8u1eerr537YLWUoxxi1M4vQxuaCihzPKMt8NDXP4WcbN6mfNxxLZeGBvsHVvVmina5THaECosCWozKJFBnscjhpr3AJsdaL8evXAvPfEjGhVMoTKXAb2ZGGRmR8g1eZshaHmgTg2imSiaoXU5eiF3HvBnDuawaCtt674ikZ3oZdekqswcVPGMwqqUKVsGY4QuFeQoGwRkMqEYTdV2UDMMsfrjrBYQYKUBFMwsQGMNBL1VoY78aotXzdeqJCBVKbQdD3ZZWvukhSe4xrz8tcF3PoxpysDLt89boMqZJtGEHTV9UBTBEac6sDyQP693qT3nKaErN8TCXrJBUmHPqKozAg9bwxTqMYkpmb9iVKLSoJxG7MjAj72SRbcqQfNCVTztSwN3cRxSrVtz4p87jNFbVtFzhPg7UqDwNFTaasySCqM"
  final val SPECTRUM_ERGO_POOL_FEE_DENOM: Long = 1000L // Pool fee denominator, determined from pool contract

  // Scripts
  final val SPECTRUM_ERGO_N2T_SWAPSELL_SCRIPT: String = Files.readString(Paths.get("/home/luca/development/work/guap/guapswaplib/commons/src/main/scala/org/guapswap/commons/dex/spectrum/contracts/amm/n2t/swapsell/v3/ergoscript/spectrum_v3_amm_n2t_swapsell.es")).stripMargin

  override def getPoolFromAssetTicker(assetTicker: String): DexPool = {

    assetTicker.toLowerCase() match {
      case "sigusd" => _dexPools.ERG_2_SigUSD
      case "spf" => _dexPools.ERG_2_SPF
      case "epos" => _dexPools.ERG_2_EPOS
      case _ => throw new IllegalArgumentException("Invalid asset ticker")
    }

  }

}