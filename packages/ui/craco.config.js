const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const reactClientPath = path.join(__dirname, "../react-client");
const reactEthPath = path.join(__dirname, "../react-eth");
const reactUtilsPath = path.join(__dirname, "../react-utils");
const reactWalletPath = path.join(__dirname, "../react-wallet");
const clientPath = path.join(__dirname, "../client");
const walletPath = path.join(__dirname, "../wallet");
const jsWalletPath = path.join(__dirname, "../wallet-backend-js");
const webWalletPath = path.join(__dirname, "../wallet-backend-web");

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
        match.loader.include = include.concat([reactClientPath, reactEthPath, reactUtilsPath, reactWalletPath, clientPath, walletPath, jsWalletPath, webWalletPath]);
      }
      return webpackConfig;
    }
  }
};