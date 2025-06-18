import express from 'express';
import cors from 'cors';
import helmet from "helmet";
import morgan from 'morgan';
import { createProxyMiddleware }  from "http-proxy-middleware"
import {CircuitBreaker} from "./utils/circuitBreaker";


const app = express();

app.use(cors()); // enable CORS
app.use(helmet()); // add security headers
app.use(morgan('combined')); // log HTTP requests
app.disable('x-powered-by'); // Hide Express server information


// Define routes and corresponding microservices

const services = {
    auth: { url: 'http://localhost:3001', circuitBreaker: new CircuitBreaker() },
    notification: { url: 'http://localhost:3002', circuitBreaker: new CircuitBreaker() },
    transfer: { url: 'http://localhost:3003', circuitBreaker: new CircuitBreaker() },
    wallet: { url: 'http://localhost:3004', circuitBreaker: new CircuitBreaker() }
};

app.use('/api/auth', createProxyMiddleware({
    target: services.auth.url,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' }
}));

app.use('/api/notification', createProxyMiddleware({
    target: services.notification.url,
    changeOrigin: true,
    pathRewrite: { '^/api/notification': '' }
}));

app.use('/api/transfer', createProxyMiddleware({
    target: services.transfer.url,
    changeOrigin: true,
    pathRewrite: { '^/api/transfer': '' }
}));

app.use('/api/wallet', createProxyMiddleware({
    target: services.wallet.url,
    changeOrigin: true,
    pathRewrite: { '^/api/wallet': '' }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: Date.now() });
});

app.use("/" , (req, res, next) => {
    res.send("Circuit Breaker States: " + JSON.stringify({
        auth: services['auth'].circuitBreaker.getState(),
        notification: services['notification'].circuitBreaker.getState(),
        transfer: services['transfer'].circuitBreaker.getState(),
        wallet: services['wallet'].circuitBreaker.getState()
    }));
})

app.listen(3000, () => {
    console.log('🚀 API Gateway running on http://localhost:3000');

});
