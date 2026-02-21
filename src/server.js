import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { connectMongoDB } from './db/connectMongoDB.js';
import dotenv from 'dotenv';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3030;

const startServer = async () => {
  await connectMongoDB();

  app.use(logger);
  app.use(express.json());
  app.use(cors());
  app.use(pinoHttp());

  app.use(notesRoutes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
startServer();
