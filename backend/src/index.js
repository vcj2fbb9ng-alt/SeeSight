import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db.js'; // ensures schema exists before routes touch it

import { tripsRouter } from './routes/trips.js';
import { transactionsRouter } from './routes/transactions.js';
import { invoicesRouter } from './routes/invoices.js';
import { webhooksRouter } from './routes/webhooks.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mode: 'sandbox/test — no real money moves', time: new Date().toISOString() });
});

app.use('/api/trips', tripsRouter);
app.use('/api', transactionsRouter); // /api/cards/:cardId/transactions..., /api/transactions/:id
app.use('/api/invoices', invoicesRouter);
app.use('/api/webhooks', webhooksRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`SeeSight backend (SANDBOX MODE — no real money moves) listening on http://localhost:${port}`);
});
