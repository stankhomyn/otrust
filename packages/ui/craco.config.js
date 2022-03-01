const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const reactClientPath = path.join(__dirname, "../react-client");
const reactUtilsPath = path.join(__dirname, "../react-utils");
const reactKeplrPath = path.join(__dirname, "../react-keplr");
const clientPath = path.join(__dirname, "../client");

module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat([reactClientPath, reactUtilsPath, reactKeplrPath, clientPath]);
      }
      return webpackConfig;
    }
  }
};