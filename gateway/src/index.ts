import express, {Response , Request , NextFunction} from 'express';
import cors from 'cors';
import helmet from "helmet";
import morgan from 'morgan';
import { createProxyMiddleware } from "http-proxy-middleware";
import { CircuitBreaker } from "./utils/circuitBreaker";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.disable('x-powered-by');

// Enhanced services configuration
const services = {
    auth: {
        url: 'http://localhost:3001',
        circuitBreaker: new CircuitBreaker()
    },
    notification: {
        url: 'http://localhost:3002',
        circuitBreaker: new CircuitBreaker()
    },
    transfer: {
        url: 'http://localhost:3003',
        circuitBreaker: new CircuitBreaker()
    },
    wallet: {
        url: 'http://localhost:3004',
        circuitBreaker: new CircuitBreaker()
    }
};

// Circuit Breaker middleware
const createProxyWithCircuitBreaker = (serviceName : "auth" | "transfer" | "notification" | "wallet") : any => {
    const service = services[serviceName];
    const proxy = createProxyMiddleware({
        target: service.url,
        changeOrigin: true,
        pathRewrite: { [`^/api/${serviceName}`]: '' },
    });

    return async (req : Request, res : Response, next : NextFunction) => {
        try {
            await service.circuitBreaker.call(() => {
                return new Promise((resolve :any, reject) => {
                    // Manually handle the proxy response
                    const handler = (err :any) => {
                        if (err) return reject(err);
                        resolve();
                    };

                    // Execute proxy with custom handlers
                    proxy(req, res, handler);
                });
            });
        } catch (err) {
            return res.status(503).json({
                error: 'Service unavailable',
                service: serviceName,
                state: service.circuitBreaker.getState()
            });
        }
    };
};

// Apply circuit breaker to all routes
app.use('/api/auth', createProxyWithCircuitBreaker('auth'));
app.use('/api/notification', createProxyWithCircuitBreaker('notification'));
app.use('/api/transfer', createProxyWithCircuitBreaker('transfer'));
app.use('/api/wallet', createProxyWithCircuitBreaker('wallet'));

// Dashboard endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'API Gateway with Circuit Breakers',
        authService : services.auth.circuitBreaker.getState(),
    });
});

app.listen(3000, () => {
    console.log('🚀 API Gateway running on http://localhost:3000');
});