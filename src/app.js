import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';

import notesRouter from './routes/notes.js';
import notFoundMiddleware from './middlewares/notFound.js';
import errorHandlerMiddleware from './middlewares/errorHandler.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

// routes
app.use('/notes', notesRouter);

app.get('/test-error', (req, res) => {
  throw new Error('Test error');
});

// 404
app.use(notFoundMiddleware);

// 500
app.use(errorHandlerMiddleware);

export default app;
