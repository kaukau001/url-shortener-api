import 'reflect-metadata';
import 'dotenv/config';
import * as express from 'express';
import * as cors from 'cors';
import { healthCheckRouter } from './app/controller/healthcheck.controller';
import { authRouter } from './app/controller/auth.controller';
import { urlRouter } from './app/controller/url.controller';
import { requestIdMiddleware } from './app/middleware/request-id.middleware';
import { Logger } from './app/utils/logger.util';
import { setupSimpleSwagger } from './swagger/swagger-simple.config';

export function createExpressApp() {
    const app = express();

    // Add request ID middleware first
    app.use(requestIdMiddleware);

    app.use(express.json());
    app.use(cors());

    app.use('/', healthCheckRouter);
    app.use('/auth', authRouter);

    // Setup simple Swagger documentation FIRST
    setupSimpleSwagger(app);

    // Test route to debug
    app.get('/test-swagger', (req, res) => {
        res.json({ message: 'Swagger test route works!' });
    });

    // URL router with catch-all MUST be last
    app.use('/', urlRouter);

    app.use((err: any, req: any, res: express.Response, next: express.NextFunction) => {
        const requestId = req.requestId || 'no-request-id';
        Logger.error('Unhandled error in Express app', { requestId, action: 'global-error-handler' }, err);
        res.status(500).json({ message: 'Something went wrong!', requestId });
    });

    return app;
}

if (require.main === module) {
    const app = createExpressApp();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        Logger.info(`Application is running on port ${port}`, { action: 'app-startup', port: port.toString() });
        Logger.info(`📚 API Documentation available at http://localhost:${port}/docs`, { action: 'swagger-setup' });
    });
}
