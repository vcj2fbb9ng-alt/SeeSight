const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body;
}

export const api = {
  health: () => request('/health'),

  createTrip: (payload) => request('/trips', { method: 'POST', body: JSON.stringify(payload) }),
  listTrips: () => request('/trips'),
  getTrip: (id) => request(`/trips/${id}`),
  completeTrip: (id) => request(`/trips/${id}/complete`, { method: 'POST' }),
  generateInvoice: (tripId) => request(`/trips/${tripId}/invoice`, { method: 'POST' }),

  transactionPresets: () => request('/presets'),
  simulateTransaction: (cardId, payload) =>
    request(`/cards/${cardId}/transactions/simulate`, { method: 'POST', body: JSON.stringify(payload) }),
  recategorizeTransaction: (txId, category) =>
    request(`/transactions/${txId}`, { method: 'PATCH', body: JSON.stringify({ category }) }),

  getInvoice: (id) => request(`/invoices/${id}`),
  sendInvoice: (id, to) => request(`/invoices/${id}/send`, { method: 'POST', body: JSON.stringify({ to }) }),
  invoicePdfUrl: (id) => `${BASE}/invoices/${id}/pdf`,
};
