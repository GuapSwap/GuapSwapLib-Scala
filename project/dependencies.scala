import sbt.Keys.libraryDependencies
import sbt._

object dependencies {

  val Ergo: List[ModuleID] = List(
    "org.scorexfoundation" %% "scrypto" % "2.1.10",
    "org.ergoplatform" %% "ergo-appkit" % "4.0.11",
    "org.scorexfoundation" %% "sigma-state" % "4.0.3"
  )

  val Testing: List[ModuleID] = List(
    "org.scalactic" %% "scalactic" % "3.2.14",
    "org.scalatest" %% "scalatest" % "3.2.14" % "test"
  )

  val Edge: List[ModuleID] = List(
    "io.github.ergo-lend" % "edge_2.12" % "0.1-SNAPSHOT"
  )

  val Gson: List[ModuleID] = List(
    "com.google.code.gson" % "gson" % "2.8.5"
  )

}