import { v4 as uuid } from 'uuid';

// Fabricates a sandbox-shaped virtual card locally — no network call, no
// real card network, no card-issuing account needed. See ./README.md.
//
// Card numbers use the well-known Stripe/Visa test PAN prefix (4242 4242
// 4242 ####) so nobody mistakes the masked digits for a real card, and the
// full PAN is never generated or stored at all — only a masked display
// string and last4, which is all a real card-issuing sandbox would ever
// hand back to a non-PCI-scoped server.
export async function issueCard({ tripId, tripName, travelerName }) {
  const last4 = String(Math.floor(1000 + Math.random() * 9000));
  const now = new Date();
  const expiry = new Date(now.getFullYear() + 2, now.getMonth(), 1);

  return {
    provider: 'mock',
    providerCardId: `ic_mock_${uuid().replace(/-/g, '').slice(0, 24)}`,
    maskedNumber: `4242 42•• •••• ${last4}`,
    last4,
    brand: 'Visa',
    expMonth: expiry.getMonth() + 1,
    expYear: expiry.getFullYear(),
    status: 'active',
    // kept only for local debugging/demo context, not a real network field
    _meta: { tripId, tripName, travelerName },
  };
}
