// Root project aggregating all modules
lazy val root = (project in file("."))
  .settings(
    commonSettings,
    name := "guapswaplib",
    homepage := Some(url("https://guapswap.org")),
    licenses := Seq("GPL-3.0" -> url("https://spdx.org/licenses/GPL-3.0-or-later.html")),
    description := "GuapSwapLib library written in Scala",
    versionScheme := Some("semver-spec"),
    assembly / assemblyJarName := s"${name.value}-${version.value}.jar",
    assembly / assemblyOutputPath := file(s"./${name.value}-${version.value}.jar/")
  )
  .aggregate(commons, guapswap)

// Commons module with custom settings
lazy val commons = (project in file("commons"))
  .settings(
    commonSettings,
    name := "commons",
    moduleName := "commons",
    description := "commons package for guapswaplib"
  )

// Guapswap module with custom settings
lazy val guapswap = (project in file("guapswap"))
  .settings(
    commonSettings,
    name := "guapswap",
    moduleName := "guapswap",
    description := "guapswap package for guapswaplib"
  )

//lazy val oasis = utils
//  .mkModule("oasis", "guapswap-oasis package for guapswaplib")
//  .settings(projectSettings)
//
//lazy val pay = utils
//  .mkModule("pay", "guapswap-pay package for guapswaplib")
//  .settings(projectSettings)
//
//lazy val plugin = utils
//  .mkModule("plugin", "guapswap-dapp-plugin package for guapswaplib")
//  .settings(projectSettings)
//
//lazy val payday = utils
//  .mkModule("payday", "guapswap-payday package for guapswaplib")
//  .settings(projectSettings)

// Define common settings applicable to all projects
lazy val commonSettings = Seq(
  scalaVersion := "2.12.15",
  organization := "org.guapswap",
  resolvers ++= Seq(
    "Sonatype Releases".at("https://s01.oss.sonatype.org/content/repositories/releases"),
    "Sonatype Snapshots".at("https://s01.oss.sonatype.org/content/repositories/snapshots")
  ),
  libraryDependencies ++= ergo ++ testing ++ edge ++ gson ++ sigmabuilders
)

// Dependencies
lazy val ergo: List[ModuleID] = List(
  "org.scorexfoundation" %% "scrypto" % "2.1.10",
  "org.ergoplatform" %% "ergo-appkit" % "5.0.2",
  "org.scorexfoundation" %% "sigma-state" % "4.0.3"
)

lazy val testing: List[ModuleID] = List(
  "org.scalactic" %% "scalactic" % "3.2.14",
  "org.scalatest" %% "scalatest" % "3.2.14"
)

lazy val edge: List[ModuleID] = List(
  "io.github.ergo-lend" % "edge_2.12" % "0.1-SNAPSHOT"
)

lazy val gson: List[ModuleID] = List(
  "com.google.code.gson" % "gson" % "2.8.5"
)

lazy val sigmabuilders: List[ModuleID] = List(
  "org.guapswap" %% "sigma-builders" % "0.1.1"
)