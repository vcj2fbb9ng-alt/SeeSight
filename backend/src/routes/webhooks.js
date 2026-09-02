import { Router } from 'express';
import { db } from '../db.js';
import { insertTransaction } from './transactions.js';
import { serializeTransaction } from '../serializers.js';

export const webhooksRouter = Router();

// Simulates the shape of a card-issuing sandbox provider's webhook (e.g.
// Stripe Issuing's `issuing_transaction.created` event). This lets the demo
// show the "transactions arrive via webhook" path without standing up a
// real provider account — POST a payload like:
//
// {
//   "type": "issuing_transaction.created",
//   "data": {
//     "object": {
//       "card": "ic_mock_...",       // provider_card_id
//       "merchant_data": { "name": "Marriott Tbilisi", "category_code": "7011" },
//       "amount": 180,
//       "currency": "GEL",
//       "created": "2026-08-20T14:00:00Z"
//     }
//   }
// }
webhooksRouter.post('/provider', (req, res) => {
  const expectedSecret = process.env.WEBHOOK_SHARED_SECRET;
  if (expectedSecret && req.get('X-SeeSight-Webhook-Secret') !== expectedSecret) {
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }

  const event = req.body || {};
  if (event.type !== 'issuing_transaction.created') {
    return res.status(400).json({ error: 'Unsupported event type' });
  }

  const obj = event.data?.object;
  if (!obj?.card || !obj?.merchant_data?.name || obj?.amount === undefined) {
    return res.status(400).json({ error: 'Malformed event payload' });
  }

  const card = db.prepare('SELECT * FROM cards WHERE provider_card_id = ?').get(obj.card);
  if (!card) return res.status(404).json({ error: `No card found for provider_card_id ${obj.card}` });

  const tx = insertTransaction({
    cardId: card.id,
    merchantName: obj.merchant_data.name,
    mcc: obj.merchant_data.category_code,
    amount: Number(obj.amount),
    currency: obj.currency,
    occurredAt: obj.created,
  });

  res.status(201).json({ received: true, transaction: serializeTransaction(tx) });
});
