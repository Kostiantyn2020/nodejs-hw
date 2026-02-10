import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

// ===== ROUTES =====
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// ===== TEST ERROR ROUTE =====
app.get('/test-error', (req, res) => {
  throw new Error('Simulated server error');
});

// ===== 404 MIDDLEWARE =====
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// ===== ERROR HANDLER MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: err.message,
  });
});

// ===== SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
