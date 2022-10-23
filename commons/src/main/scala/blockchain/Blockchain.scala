package blockchain

/**
 * Enum representing different possible blockchains.
 */
sealed trait Blockchain
case object Ergo extends Blockchain
case object Cardano extends Blockchain