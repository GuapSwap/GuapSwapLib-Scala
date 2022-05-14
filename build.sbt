inThisBuild(List(
  
  organization := "org.guapswap",  // groupId
  name := "guapswaplib-scala",     // artifactId
  homepage := Some(url("https://github.com/GuapSwap/guapswaplib-scala")),
  licenses := Seq("MIT" -> url("https://opensource.org/licenses/MIT")),
  description := "GuapSwapLib library written in Scala.",
  developers := List(
    Developer(
      "lgd",
      "Luca D'Angelo",
      url("https://github.com/lucagdangelo")
    )
  ),
  
  sonatypeCredentialHost := "s01.oss.sonatype.org",
  sonatypeRepository := "https://s01.oss.sonatype.org/service/local",

  scalaVersion := "2.12.15",
  libraryDependencies ++= Seq(
    "org.scalameta" %% "munit" % "0.7.29" % Test,
    "org.ergoplatform" %% "ergo-appkit" % "4.0.9",
    "com.google.code.gson" % "gson" % "2.8.5",
  ),

  versionScheme := Some("semver-spec"),
  assembly / assemblyJarName := s"${name.value}-${version.value}.jar",
  assembly / assemblyOutputPath := file(s"./${name.value}-${version.value}.jar/")
  
))