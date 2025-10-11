const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8000/api',
            // target: 'https://dev-v2-hkb2.dev-diamondteam.com',
            changeOrigin: true,
        })
    );
};