package dex.spectrum

import dex.{Dex, Ergo, Cardano}

/**
 * Object representing Spectrum dex.
 */
case object SpectrumDex extends Dex(
  "Spectrum Dex",
  List(Ergo, Cardano),
  Map((Ergo, SpectrumErgoAssets), (Cardano, SpectrumCardanoAssets)),
  true
) {}