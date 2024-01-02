package org.guapswap.commons.dex.spectrum

import org.guapswap.commons.dex.{DexPool, DexPools}

object SpectrumErgoPools extends DexPools {

    val ERG_2_SigUSD: DexPool = SpectrumErgoPool(
        "9916d75132593c8b07fe18bd8d583bda1652eed7565cf41a4738ddd90fc992ec",
        SpectrumErgoAssets.ERG,
        SpectrumErgoAssets.SigUSD,
        995L
    )

    val ERG_2_SPF: DexPool = SpectrumErgoPool(
        "f40afb6f877c40a30c8637dd5362227285738174151ce66d6684bc1b727ab6cf",
        SpectrumErgoAssets.ERG,
        SpectrumErgoAssets.SPF,
        997L
    )

    val ERG_2_EPOS: DexPool = SpectrumErgoPool(
        "04f468174eddbc68bce3f0965dd14bc6ed1443f5a405ec7f7f9925d999370b97",
        SpectrumErgoAssets.ERG,
        SpectrumErgoAssets.EPOS,
        997L
    )


}
