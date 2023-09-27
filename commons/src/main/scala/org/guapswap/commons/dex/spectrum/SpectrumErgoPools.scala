package org.guapswap.commons.dex.spectrum

import org.guapswap.commons.dex.{DexPool, DexPools}

object SpectrumErgoPools extends DexPools {

    val ERG_2_SigUSD: DexPool = SpectrumErgoPool(
        "9916d75132593c8b07fe18bd8d583bda1652eed7565cf41a4738ddd90fc992ec",
        SpectrumErgoAssets.ERG,
        SpectrumErgoAssets.SigUSD,
        995L
    )


}
