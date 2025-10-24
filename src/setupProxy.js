const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            // target: 'http://localhost:8000/api',
            target: 'https://budgettracker-api.onrender.com',
            changeOrigin: true,
        })
    );
};
