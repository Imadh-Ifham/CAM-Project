const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Suppress SafeAreaView deprecation warning from dependencies
config.resolver.platforms = ["ios", "android"];

module.exports = withNativeWind(config, { input: "./app/globals.css" });
