lazy val root = project
  .in(file("."))
  .settings(

    organization := "guapswap",
    name := "guapswaplib-scala",
    version := "0.1.0-beta",
    scalaVersion := "2.12.15",

    libraryDependencies ++= Seq(
      "org.scalatest" %% "scalatest" % "3.2.9" % Test,
      "org.ergoplatform" %% "ergo-appkit" % "4.0.8",
      "com.google.code.gson" % "gson" % "2.8.5",
    ),

    githubOwner := "guapswap",
    githubRepository := "guapswaplib-scala",
    githubTokenSource := TokenSource.GitConfig("github.token"),

    ThisBuild / versionScheme := Some("semver-spec"),
    assembly / assemblyJarName := s"${name.value}-${version.value}.jar",
    assembly / assemblyOutputPath := file(s"./${name.value}-${version.value}.jar/")

  )
