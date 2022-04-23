val scala3Version = "3.1.2"
val scala2Version = "2.12.15"

lazy val root = project
  .in(file("."))
  .settings(

    organization := "guapswap",
    name := "guapswaplib-scala",
    version := "0.1.0-beta",
    scalaVersion := scala3Version,
    crossScalaVersions := Seq(scala3Version, scala2Version),

    libraryDependencies ++= Seq(
      "org.scalameta" %% "munit" % "0.7.29" % Test,
      "org.ergoplatform" %% "ergo-appkit" % "4.0.8",
      "com.google.code.gson" % "gson" % "2.8.5",
    ),

    scmInfo := Some(
      ScmInfo(url("https://github.com/guapswap/guapswaplib-scala"), "scm:git@github.com:guapswap/guapswaplib-scala.git")
    ),

    githubOwner := "guapswap",
    githubRepository := "guapswaplib-scala",
    githubTokenSource := TokenSource.GitConfig("github.token"),

    ThisBuild / versionScheme := Some("semver-spec"),
    assembly / assemblyJarName := s"${name.value}-${version.value}.jar",
    assembly / assemblyOutputPath := file(s"./${name.value}-${version.value}.jar/")

  )
