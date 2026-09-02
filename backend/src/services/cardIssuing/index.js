import { issueCard as issueMockCard } from './mockProvider.js';

const PROVIDER = process.env.CARD_PROVIDER || 'mock';

export async function issueCard(params) {
  switch (PROVIDER) {
    case 'mock':
      return issueMockCard(params);
    default:
      throw new Error(
        `Unknown CARD_PROVIDER "${PROVIDER}". Only "mock" is implemented in ` +
          'this prototype — see src/services/cardIssuing/README.md for how ' +
          'to add a real sandbox provider (Stripe Issuing test mode, Marqeta sandbox).'
      );
  }
}
