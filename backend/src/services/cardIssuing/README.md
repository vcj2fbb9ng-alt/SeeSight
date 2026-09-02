# Card issuing provider interface

`index.js` exports `issueCard({ tripId, tripName, travelerName })`, which
resolves to:

```js
{
  provider: 'mock',
  providerCardId: 'ic_mock_...',
  maskedNumber: '4242 42•• •••• 4242',
  last4: '4242',
  brand: 'Visa',
  expMonth: 9,
  expYear: 2028,
  status: 'active',
}
```

Only `mockProvider.js` is implemented in this prototype. It fabricates
realistic-looking sandbox card data **locally** — no network call, no card
network involved, no real card issuing account required to run the demo.
This keeps the prototype runnable end-to-end without any API keys.

The interface is intentionally shaped like a real card-issuing sandbox
response (Stripe Issuing test mode / Marqeta sandbox both return roughly
this data) so that swapping in a real sandbox provider later is a small,
contained change:

```js
// stripeIssuingProvider.js (sketch, not implemented here)
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // sk_test_...

export async function issueCard({ tripId, tripName, travelerName }) {
  const cardholder = await stripe.issuing.cardholders.create({
    type: 'individual',
    name: travelerName,
    email: `${tripId}@example.com`,
    billing: { address: { /* ... */ } },
  });
  const card = await stripe.issuing.cards.create({
    cardholder: cardholder.id,
    currency: 'usd',
    type: 'virtual',
    spending_controls: { spending_limits: [/* trip budget */] },
    metadata: { trip_id: tripId, trip_name: tripName },
  });
  return {
    provider: 'stripe',
    providerCardId: card.id,
    maskedNumber: `•••• •••• •••• ${card.last4}`,
    last4: card.last4,
    brand: card.brand,
    expMonth: card.exp_month,
    expYear: card.exp_year,
    status: card.status,
  };
}
```

To wire it in: add the `stripe` package, implement the file above, and
add a branch for it in `index.js`'s `issueCard()` switch, selected by the
`CARD_PROVIDER` env var. No other code needs to change — routes and the
database only see the normalized shape above.
