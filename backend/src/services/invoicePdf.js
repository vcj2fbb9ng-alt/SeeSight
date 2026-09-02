import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

const money = (n, currency) => `${currency} ${Number(n).toFixed(2)}`;
const PAGE_LEFT = 50;
const PAGE_RIGHT = 545;
const CONTENT_WIDTH = PAGE_RIGHT - PAGE_LEFT;

/**
 * Renders an itemized trip invoice to a PDF, written to convince a finance
 * reviewer to file it without follow-up questions: a business purpose, a
 * per-line description explaining what each charge was for, an explicit
 * "already paid, nothing to reimburse" callout, and a signature line.
 *
 * @param {object} params
 * @param {object} params.trip
 * @param {object|null} params.card
 * @param {string} params.invoiceNumber
 * @param {object[]} params.transactions
 * @param {object} params.subtotalsByCategory  { [category]: number }
 * @param {number} params.total
 * @param {string} params.currency
 * @param {string} params.outPath  absolute path to write the PDF to
 */
export function renderInvoicePdf({
  trip,
  card,
  invoiceNumber,
  transactions,
  subtotalsByCategory,
  total,
  currency,
  outPath,
}) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  function hline(y, color = '#e5e7eb') {
    doc.moveTo(PAGE_LEFT, y).lineTo(PAGE_RIGHT, y).strokeColor(color).lineWidth(1).stroke();
  }

  // ---- Header ----------------------------------------------------------
  doc.font('Helvetica-Bold').fontSize(19).fillColor('#1a1a2e').text('SeeSight', PAGE_LEFT, 50);
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('#b45309')
    .text('SANDBOX PROTOTYPE — SIMULATED DATA, NOT A REAL PAYMENT INSTRUMENT', PAGE_LEFT, doc.y);

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#6b7280')
    .text('EXPENSE INVOICE', PAGE_LEFT, 50, { width: CONTENT_WIDTH, align: 'right' });
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor('#111827')
    .text(invoiceNumber, { width: CONTENT_WIDTH, align: 'right' });
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('#6b7280')
    .text(`Issued ${new Date().toISOString().slice(0, 10)}`, { width: CONTENT_WIDTH, align: 'right' });

  doc.moveDown(1.2);
  hline(doc.y);
  doc.moveDown(0.8);

  // ---- Bill-to / trip summary, two columns ------------------------------
  const colWidth = CONTENT_WIDTH / 2 - 10;
  const topY = doc.y;

  doc.font('Helvetica-Bold').fontSize(8).fillColor('#9ca3af').text('PREPARED FOR', PAGE_LEFT, topY, { width: colWidth });
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#111827')
    .text(trip.employer_name || 'Accounts Payable', { width: colWidth });
  doc.font('Helvetica').fontSize(9).fillColor('#374151').text(`Traveler: ${trip.traveler_name}`, { width: colWidth });
  doc.text(`Trip: ${trip.name}`, { width: colWidth });
  doc.text(`Destination: ${trip.destination}`, { width: colWidth });

  const rightColX = PAGE_LEFT + colWidth + 20;
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#9ca3af').text('TRIP DATES', rightColX, topY, { width: colWidth });
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#374151')
    .text(`${trip.start_date} to ${trip.end_date}`, rightColX, doc.y, { width: colWidth });
  doc.text(`Status: ${trip.status === 'completed' ? 'Completed' : 'In progress'}`, rightColX, doc.y, { width: colWidth });
  if (card) {
    doc.text(`Card on file: ${card.brand} ${card.masked_number}`, rightColX, doc.y, { width: colWidth });
  }

  doc.y = Math.max(doc.y, topY + 70);
  doc.moveDown(0.4);

  // ---- Business purpose --------------------------------------------------
  if (trip.purpose) {
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#9ca3af').text('BUSINESS PURPOSE', PAGE_LEFT, doc.y, { width: CONTENT_WIDTH });
    doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(trip.purpose, { width: CONTENT_WIDTH });
    doc.moveDown(0.5);
  }

  // ---- Payment status callout --------------------------------------------
  const calloutY = doc.y;
  const calloutText = card
    ? `PAID IN FULL — settled at time of purchase via SeeSight virtual corporate card ending ${card.last4}, issued specifically for this trip. No reimbursement is owed to the traveler; this invoice is for expense record-keeping only.`
    : `PAID IN FULL — settled at time of purchase via a SeeSight virtual corporate card issued specifically for this trip. No reimbursement is owed to the traveler.`;
  const calloutHeight = doc.heightOfString(calloutText, { width: CONTENT_WIDTH - 24, font: 'Helvetica', fontSize: 9 }) + 20;
  doc.roundedRect(PAGE_LEFT, calloutY, CONTENT_WIDTH, calloutHeight, 6).fill('#ecfdf5');
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor('#059669')
    .text(calloutText, PAGE_LEFT + 12, calloutY + 10, { width: CONTENT_WIDTH - 24 });
  doc.y = calloutY + calloutHeight + 16;

  // ---- Transactions table --------------------------------------------------
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#111827').text('Itemized transactions', PAGE_LEFT, doc.y, { width: CONTENT_WIDTH });
  doc.moveDown(0.5);

  const col = { date: PAGE_LEFT, details: PAGE_LEFT + 62, category: PAGE_LEFT + 330, amount: PAGE_LEFT + 410 };
  const detailsWidth = col.category - col.details - 10;
  const categoryWidth = col.amount - col.category - 10;
  const amountWidth = PAGE_RIGHT - col.amount;

  function drawTableHeader() {
    const y = doc.y;
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#9ca3af');
    doc.text('DATE', col.date, y, { width: 55 });
    doc.text('MERCHANT & BUSINESS PURPOSE', col.details, y, { width: detailsWidth });
    doc.text('CATEGORY', col.category, y, { width: categoryWidth });
    doc.text('AMOUNT', col.amount, y, { width: amountWidth, align: 'right' });
    doc.moveDown(0.5);
    hline(doc.y);
    doc.moveDown(0.4);
  }

  drawTableHeader();

  transactions.forEach((tx, i) => {
    doc.font('Helvetica-Bold').fontSize(9);
    const merchantHeight = doc.heightOfString(tx.merchant_name, { width: detailsWidth });
    doc.font('Helvetica').fontSize(8);
    const descHeight = tx.description
      ? doc.heightOfString(tx.description, { width: detailsWidth })
      : 0;
    const rowHeight = Math.max(merchantHeight + descHeight + 4, 22);

    if (doc.y + rowHeight > 760) {
      doc.addPage();
      drawTableHeader();
    }

    const y = doc.y;
    doc.font('Helvetica').fontSize(9).fillColor('#374151').text(tx.occurred_at.slice(0, 10), col.date, y, { width: 55 });

    doc.font('Helvetica-Bold').fontSize(9).fillColor('#111827').text(tx.merchant_name, col.details, y, { width: detailsWidth });
    if (tx.description) {
      doc.font('Helvetica').fontSize(8).fillColor('#6b7280').text(tx.description, col.details, doc.y, { width: detailsWidth });
    }

    doc.font('Helvetica').fontSize(8.5).fillColor('#374151').text(tx.category, col.category, y, { width: categoryWidth });
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor('#111827')
      .text(money(tx.amount, currency), col.amount, y, { width: amountWidth, align: 'right' });

    doc.y = y + rowHeight;
    if (i < transactions.length - 1) hline(doc.y - 6, '#f1f2f6');
  });

  doc.moveDown(0.5);
  hline(doc.y);
  doc.moveDown(0.7);

  // ---- Subtotals + total ----------------------------------------------------
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#111827').text('Subtotal by category', PAGE_LEFT, doc.y, { width: CONTENT_WIDTH });
  doc.moveDown(0.35);
  doc.font('Helvetica').fontSize(9.5);
  Object.entries(subtotalsByCategory).forEach(([category, amount]) => {
    const y = doc.y;
    doc.fillColor('#374151').text(category, col.details, y, { width: detailsWidth });
    doc.fillColor('#111827').text(money(amount, currency), col.amount, y, { width: amountWidth, align: 'right' });
    doc.moveDown(0.4);
  });

  doc.moveDown(0.3);
  {
    const y = doc.y;
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#111827').text('Total', col.details, y, { width: detailsWidth });
    doc.text(money(total, currency), col.amount, y, { width: amountWidth, align: 'right' });
  }

  doc.moveDown(2);

  // ---- Approval line ----------------------------------------------------
  if (doc.y > 700) doc.addPage();
  const signY = doc.y;
  hline(signY, '#d1d5db');
  doc.moveTo(PAGE_LEFT, signY).lineTo(PAGE_LEFT + 220, signY).strokeColor('#d1d5db').stroke();
  doc.moveTo(PAGE_LEFT + 260, signY).lineTo(PAGE_LEFT + 400, signY).strokeColor('#d1d5db').stroke();
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('#9ca3af')
    .text('Approved by (name / signature)', PAGE_LEFT, signY + 4, { width: 220 })
    .text('Date', PAGE_LEFT + 260, signY + 4, { width: 140 });

  doc.moveDown(2.5);
  doc
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor('#9ca3af')
    .text(
      'Generated by SeeSight (prototype). Card issuance, transactions, and payment shown on this invoice are simulated in sandbox/test mode for demonstration purposes — no real money moved.',
      PAGE_LEFT,
      doc.y,
      { width: CONTENT_WIDTH }
    );

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(outPath));
    stream.on('error', reject);
  });
}
