export function serializeTrip(row) {
  if (!row) return null;
  return {
    id: row.id,
    travelerName: row.traveler_name,
    name: row.name,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    budget: row.budget,
    status: row.status,
    feePaid: !!row.fee_paid,
    feeAmount: row.fee_amount,
    feeCurrency: row.fee_currency,
    createdAt: row.created_at,
  };
}

export function serializeCard(row) {
  if (!row) return null;
  return {
    id: row.id,
    tripId: row.trip_id,
    provider: row.provider,
    providerCardId: row.provider_card_id,
    maskedNumber: row.masked_number,
    last4: row.last4,
    brand: row.brand,
    expMonth: row.exp_month,
    expYear: row.exp_year,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function serializeTransaction(row) {
  if (!row) return null;
  return {
    id: row.id,
    cardId: row.card_id,
    merchantName: row.merchant_name,
    mcc: row.mcc,
    amount: row.amount,
    currency: row.currency,
    category: row.category,
    rawCategoryCode: row.raw_category_code,
    manuallyRecategorized: !!row.manually_recategorized,
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
  };
}

export function serializeInvoice(row) {
  if (!row) return null;
  return {
    id: row.id,
    tripId: row.trip_id,
    generatedAt: row.generated_at,
    totalAmount: row.total_amount,
    currency: row.currency,
    pdfUrl: `/api/invoices/${row.id}/pdf`,
    sentToCompany: !!row.sent_to_company,
    sentAt: row.sent_at,
  };
}
