const { createProxyMiddleware } = require('http-proxy-middleware');

const {
  KEPLR_RPC = 'http://64.227.98.168:26657',
  KEPLR_REST = 'http://64.227.98.168:9091',
  COSMOS_REST = 'http://157.245.90.45:1317',
} = process.env;

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/keplr_rest', {
      target: KEPLR_REST,
      pathRewrite: {
        '^/keplr_rest/': '/',
      },
    })
  );
  app.use(
    createProxyMiddleware('/keplr_rpc', {
      target: KEPLR_RPC,
      pathRewrite: {
        '^/keplr_rpc/': '/',
      },
    })
  );
  app.use(
    createProxyMiddleware('/cosmos_rest', {
      target: COSMOS_REST,
      pathRewrite: {
        '^/cosmos_rest/': '/',
      },
    })
  );
};
