// Stubbed payment — this prototype never moves real money. A "real"
// implementation would call a payment processor (Stripe PaymentIntents,
// etc.) here and only proceed once it confirms success.
export async function chargeCardIssuanceFee({ amount, currency }) {
  return {
    status: 'succeeded',
    amount,
    currency,
    mock: true,
    chargedAt: new Date().toISOString(),
  };
}
