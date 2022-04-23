lazy val root = project
  .in(file("."))
  .settings(

    organization := "GuapSwap",
    name := "guapswaplib-scala",
    version := "0.1.0-beta",
    scalaVersion := "2.12.15",

    libraryDependencies ++= Seq(
      "org.scalatest" %% "scalatest" % "3.2.9" % Test,
      "org.ergoplatform" %% "ergo-appkit" % "4.0.8",
      "com.google.code.gson" % "gson" % "2.8.5",
    ),

    githubOwner := "GuapSwap",
    githubRepository := "guapswaplib-scala",
    githubTokenSource := TokenSource.Environment("GUAPSWAP_GITHUB_TOKEN"),

    ThisBuild / versionScheme := Some("semver-spec"),
    assembly / assemblyJarName := s"${name.value}-${version.value}.jar",
    assembly / assemblyOutputPath := file(s"./${name.value}-${version.value}.jar/")

  )
