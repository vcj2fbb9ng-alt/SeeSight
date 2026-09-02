import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../db.js';
import { issueCard } from '../services/cardIssuing/index.js';
import { chargeCardIssuanceFee } from '../services/mockPayment.js';
import { serializeTrip, serializeCard, serializeTransaction, serializeInvoice } from '../serializers.js';
import { generateInvoiceForTrip } from './invoices.js';

export const tripsRouter = Router();

const CARD_FEE_AMOUNT = 3;
const CARD_FEE_CURRENCY = 'GEL';

// Create a trip: mock-charges the one-time card fee, then issues a
// sandbox virtual card scoped to the trip, in one call for a smooth demo.
tripsRouter.post('/', async (req, res) => {
  const { travelerName, name, destination, startDate, endDate, budget, purpose, employerName } = req.body || {};

  const missing = ['travelerName', 'name', 'destination', 'startDate', 'endDate', 'budget'].filter(
    (field) => req.body?.[field] === undefined || req.body?.[field] === null || req.body?.[field] === ''
  );
  if (missing.length) {
    return res.status(400).json({ error: `Missing required field(s): ${missing.join(', ')}` });
  }
  if (Number.isNaN(Number(budget)) || Number(budget) <= 0) {
    return res.status(400).json({ error: 'budget must be a positive number' });
  }

  const tripId = uuid();
  const now = new Date().toISOString();

  // Step 1: mock "Pay 3 GEL" — stubbed, no real payment processor.
  const payment = await chargeCardIssuanceFee({ amount: CARD_FEE_AMOUNT, currency: CARD_FEE_CURRENCY });

  db.prepare(
    `INSERT INTO trips (id, traveler_name, name, destination, start_date, end_date, budget, purpose, employer_name, status, fee_paid, fee_amount, fee_currency, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)`
  ).run(
    tripId,
    travelerName,
    name,
    destination,
    startDate,
    endDate,
    Number(budget),
    purpose || '',
    employerName || '',
    payment.status === 'succeeded' ? 1 : 0,
    CARD_FEE_AMOUNT,
    CARD_FEE_CURRENCY,
    now
  );

  // Step 2: issue the sandbox virtual card for this trip.
  const issued = await issueCard({ tripId, tripName: name, travelerName });
  const cardId = uuid();
  db.prepare(
    `INSERT INTO cards (id, trip_id, provider, provider_card_id, masked_number, last4, brand, exp_month, exp_year, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    cardId,
    tripId,
    issued.provider,
    issued.providerCardId,
    issued.maskedNumber,
    issued.last4,
    issued.brand,
    issued.expMonth,
    issued.expYear,
    issued.status,
    now
  );

  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(tripId);
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);

  res.status(201).json({ trip: serializeTrip(trip), card: serializeCard(card), payment });
});

tripsRouter.get('/', (req, res) => {
  const trips = db.prepare('SELECT * FROM trips ORDER BY created_at DESC').all();
  res.json(trips.map(serializeTrip));
});

tripsRouter.get('/:id', (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  const card = db.prepare('SELECT * FROM cards WHERE trip_id = ?').get(trip.id);
  const transactions = card
    ? db.prepare('SELECT * FROM transactions WHERE card_id = ? ORDER BY occurred_at DESC').all(card.id)
    : [];
  const invoices = db
    .prepare('SELECT * FROM invoices WHERE trip_id = ? ORDER BY generated_at DESC')
    .all(trip.id);

  res.json({
    trip: serializeTrip(trip),
    card: serializeCard(card),
    transactions: transactions.map(serializeTransaction),
    invoices: invoices.map(serializeInvoice),
  });
});

tripsRouter.post('/:id/complete', (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  db.prepare("UPDATE trips SET status = 'completed' WHERE id = ?").run(trip.id);
  const updated = db.prepare('SELECT * FROM trips WHERE id = ?').get(trip.id);
  res.json(serializeTrip(updated));
});

// Generate (or regenerate) the invoice for a trip — allowed any time, per
// the "at the end of a trip, or on demand" requirement.
tripsRouter.post('/:id/invoice', async (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  try {
    const invoice = await generateInvoiceForTrip(trip);
    res.status(201).json(serializeInvoice(invoice));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
