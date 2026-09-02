import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../db.js';
import { categorize, CATEGORIES } from '../services/categorization.js';
import { serializeTransaction } from '../serializers.js';

export const transactionsRouter = Router();

// A handful of one-click presets for the "simulate transaction" demo button.
export const TRANSACTION_PRESETS = [
  { label: 'Hotel — Marriott Tbilisi', merchantName: 'Marriott Tbilisi', mcc: '7011', amount: 180 },
  { label: 'Flight — Georgian Airways', merchantName: 'Georgian Airways', mcc: '3070', amount: 320 },
  { label: 'Meal — Café Littera', merchantName: 'Café Littera', mcc: '5812', amount: 24.5 },
  { label: 'Transport — Bolt Taxi', merchantName: 'Bolt', mcc: '4121', amount: 8.9 },
  { label: 'Other — Duty Free Shop', merchantName: 'Duty Free Shop', mcc: '5999', amount: 45 },
];

transactionsRouter.get('/presets', (req, res) => {
  res.json(TRANSACTION_PRESETS);
});

function insertTransaction({ cardId, merchantName, mcc, amount, currency, occurredAt }) {
  const category = categorize({ merchantName, mcc });
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO transactions (id, card_id, merchant_name, mcc, amount, currency, category, raw_category_code, manually_recategorized, occurred_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
  ).run(id, cardId, merchantName, mcc || null, amount, currency || 'GEL', category, mcc || null, occurredAt || now, now);
  return db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
}
export { insertTransaction };

// Simulate a transaction landing on a card (stand-in for a provider webhook).
transactionsRouter.post('/cards/:cardId/transactions/simulate', (req, res) => {
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  const { merchantName, mcc, amount, currency, occurredAt } = req.body || {};
  if (!merchantName || amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return res.status(400).json({ error: 'merchantName and a numeric amount are required' });
  }

  const tx = insertTransaction({
    cardId: card.id,
    merchantName,
    mcc,
    amount: Number(amount),
    currency,
    occurredAt,
  });
  res.status(201).json(serializeTransaction(tx));
});

transactionsRouter.get('/cards/:cardId/transactions', (req, res) => {
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });
  const rows = db
    .prepare('SELECT * FROM transactions WHERE card_id = ? ORDER BY occurred_at DESC')
    .all(card.id);
  res.json(rows.map(serializeTransaction));
});

// Manually re-categorize a transaction.
transactionsRouter.patch('/transactions/:id', (req, res) => {
  const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  if (!tx) return res.status(404).json({ error: 'Transaction not found' });

  const { category } = req.body || {};
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(', ')}` });
  }

  db.prepare('UPDATE transactions SET category = ?, manually_recategorized = 1 WHERE id = ?').run(
    category,
    tx.id
  );
  const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(tx.id);
  res.json(serializeTransaction(updated));
});
