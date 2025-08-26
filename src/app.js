import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimiter from './middlewares/rateLimiter.js';
import postLimiter from './middlewares/postLimiter.js';
import logger from './utils/logger.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './docs/openapi.json' with { type: 'json' };

import usersRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';

const app = express();

app.set('trust proxy', 1);

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(hpp());
app.use(mongoSanitize());
app.use(compression());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

morgan.token('statusColor', (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return logger.colors.red(status);
  if (status >= 400) return logger.colors.yellow(status);
  if (status >= 300) return logger.colors.cyan(status);
  if (status >= 200) return logger.colors.green(status);
  return status;
});
app.use(morgan(':method :url :statusColor :response-time ms'));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api', rateLimiter);

const api = Router();
api.use('/users', usersRouter);
api.use('/messages', postLimiter, messageRouter);
app.use('/api', api);

app.use(notFound);
app.use(errorHandler);

export default app;