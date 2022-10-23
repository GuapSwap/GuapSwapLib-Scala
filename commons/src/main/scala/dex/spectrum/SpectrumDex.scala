package dex.spectrum

import blockchain.{Cardano, Ergo}
import dex.Dex

/**
 * Object representing Spectrum dex.
 */
case object SpectrumDex extends Dex(
  "Spectrum Dex",
  List(Ergo, Cardano),
  Map((Ergo, SpectrumErgoAssets), (Cardano, SpectrumCardanoAssets)),
  true
) {}