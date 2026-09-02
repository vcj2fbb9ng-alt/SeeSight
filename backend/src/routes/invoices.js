import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import path from 'node:path';
import fs from 'node:fs';
import { db } from '../db.js';
import { renderInvoicePdf } from '../services/invoicePdf.js';
import { sendInvoiceEmail } from '../services/mockEmail.js';
import { serializeInvoice } from '../serializers.js';

export const invoicesRouter = Router();

const INVOICES_DIR = process.env.INVOICES_DIR
  ? path.resolve(process.cwd(), process.env.INVOICES_DIR)
  : path.resolve(process.cwd(), 'invoices');

// Human-readable, sequential-looking invoice number — e.g. SS-202609-4F8A1C
// — the kind of reference a finance/AP system expects to file against,
// rather than a raw UUID.
function buildInvoiceNumber(trip, invoiceId) {
  const yearMonth = (trip.start_date || '').slice(0, 7).replace('-', '') || 'TRIP';
  return `SS-${yearMonth}-${invoiceId.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

export async function generateInvoiceForTrip(trip) {
  const card = db.prepare('SELECT * FROM cards WHERE trip_id = ?').get(trip.id);
  const transactions = card
    ? db.prepare('SELECT * FROM transactions WHERE card_id = ? ORDER BY occurred_at ASC').all(card.id)
    : [];

  if (transactions.length === 0) {
    throw new Error('Cannot generate an invoice for a trip with no transactions yet');
  }

  const currency = transactions[0].currency || 'GEL';
  const subtotalsByCategory = {};
  let total = 0;
  for (const tx of transactions) {
    subtotalsByCategory[tx.category] = (subtotalsByCategory[tx.category] || 0) + tx.amount;
    total += tx.amount;
  }

  const invoiceId = uuid();
  const invoiceNumber = buildInvoiceNumber(trip, invoiceId);
  const pdfPath = path.join(INVOICES_DIR, `${invoiceId}.pdf`);
  await renderInvoicePdf({
    trip,
    card,
    invoiceNumber,
    transactions,
    subtotalsByCategory,
    total,
    currency,
    outPath: pdfPath,
  });

  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO invoices (id, invoice_number, trip_id, generated_at, total_amount, currency, pdf_path, sent_to_company, sent_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL)`
  ).run(invoiceId, invoiceNumber, trip.id, now, total, currency, pdfPath);

  return db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoiceId);
}

invoicesRouter.get('/:id', (req, res) => {
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(invoice.trip_id);
  const card = db.prepare('SELECT * FROM cards WHERE trip_id = ?').get(invoice.trip_id);
  const transactions = card
    ? db.prepare('SELECT * FROM transactions WHERE card_id = ? ORDER BY occurred_at ASC').all(card.id)
    : [];

  const subtotalsByCategory = {};
  transactions.forEach((tx) => {
    subtotalsByCategory[tx.category] = (subtotalsByCategory[tx.category] || 0) + tx.amount;
  });

  res.json({
    invoice: serializeInvoice(invoice),
    trip: {
      name: trip.name,
      travelerName: trip.traveler_name,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      purpose: trip.purpose,
      employerName: trip.employer_name,
      status: trip.status,
    },
    card: card
      ? { maskedNumber: card.masked_number, last4: card.last4, brand: card.brand, provider: card.provider }
      : null,
    transactions: transactions.map((tx) => ({
      id: tx.id,
      date: tx.occurred_at,
      merchantName: tx.merchant_name,
      category: tx.category,
      description: tx.description,
      amount: tx.amount,
    })),
    subtotalsByCategory,
  });
});

invoicesRouter.get('/:id/pdf', (req, res) => {
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  if (!fs.existsSync(invoice.pdf_path)) {
    return res.status(410).json({ error: 'Invoice PDF file is no longer available; regenerate the invoice' });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="seesight-invoice-${invoice.id.slice(0, 8)}.pdf"`);
  fs.createReadStream(invoice.pdf_path).pipe(res);
});

// Mock "send to company" — logs and marks the invoice sent; no real email
// infrastructure, per the prototype's scope.
invoicesRouter.post('/:id/send', async (req, res) => {
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(invoice.trip_id);
  const to = (req.body && req.body.to) || 'expenses@company.example';

  const result = await sendInvoiceEmail({
    to,
    trip,
    invoice: { ...invoice, total_amount: invoice.total_amount },
  });

  const now = new Date().toISOString();
  db.prepare('UPDATE invoices SET sent_to_company = 1, sent_at = ? WHERE id = ?').run(now, invoice.id);
  const updated = db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoice.id);

  res.json({ invoice: serializeInvoice(updated), email: result });
});
