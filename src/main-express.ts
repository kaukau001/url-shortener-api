import 'reflect-metadata';
import 'dotenv/config';
import { createExpressApp } from './app-express';
import { Logger } from './app/utils/logger.util';

const app = createExpressApp();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  Logger.info(`🚀 Express application is running on port ${port}`, {
    action: 'app-startup',
    port: port.toString(),
    url: `http://localhost:${port}`
  });
  Logger.info(`📚 API Documentation available`, {
    action: 'swagger-setup',
    url: `http://localhost:${port}/docs`
  });
});
