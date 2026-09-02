// Stubbed "send to company" action — logs what would be emailed instead of
// wiring up real email infrastructure, per the prototype's scope.
export async function sendInvoiceEmail({ to, trip, invoice }) {
  const subject = `Expense invoice ${invoice.invoice_number || ''} — ${trip.name} (${trip.traveler_name})`.trim();
  // eslint-disable-next-line no-console
  console.log(
    `[mock email] To: ${to}\nSubject: ${subject}\nBody: Attached is the itemized invoice for ` +
      `${trip.name} (${trip.start_date} to ${trip.end_date}). Already paid via SeeSight corporate travel card — ` +
      `no reimbursement owed to traveler. Total: ${invoice.currency} ${invoice.total_amount.toFixed(2)}.\n` +
      `PDF: ${invoice.pdf_path}`
  );
  return { sent: true, to, subject, sentAt: new Date().toISOString() };
}
