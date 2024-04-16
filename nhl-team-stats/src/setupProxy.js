const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.nhle.com',
      changeOrigin: true,
      pathRewrite: {'^/api' : ''}
    })
  );

  app.use(
    '/api-web',
    createProxyMiddleware({
      target: 'https://api-web.nhle.com',
      changeOrigin: true,
      pathRewrite: {'^/api-web' : ''},
	  logLevel: 'debug',
	  onProxyReq: function(proxyReq, req, res) {
        console.log('Proxying request:', req.url);
      }
    })
  );
};