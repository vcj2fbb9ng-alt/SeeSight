import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';

export default function InvoiceView() {
  const { invoiceId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sentNotice, setSentNotice] = useState('');
  const [recipient, setRecipient] = useState('expenses@company.example');

  const reload = useCallback(() => {
    return api
      .getInvoice(invoiceId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [invoiceId]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleSend(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const result = await api.sendInvoice(invoiceId, recipient);
      setSentNotice(`Mock email sent to ${result.email.to} (logged on the backend — no real email infrastructure in this prototype).`);
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (error && !data) {
    return (
      <div className="container">
        <div className="alert error">{error}</div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="container">
        <p>Loading…</p>
      </div>
    );
  }

  const { invoice, trip, transactions, subtotalsByCategory } = data;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Invoice</h1>
          <div className="meta" style={{ marginTop: 4 }}>
            <Link to={`/trips/${invoice.tripId}`}>{trip.name}</Link> · {trip.travelerName} · {trip.destination}
          </div>
        </div>
        <a className="btn secondary" href={api.invoicePdfUrl(invoice.id)} target="_blank" rel="noreferrer">
          ⬇ Download PDF
        </a>
      </div>

      {error && <div className="alert error">{error}</div>}
      {sentNotice && <div className="alert success">{sentNotice}</div>}

      <div className="card">
        <h2>Summary</h2>
        <table>
          <tbody>
            <tr>
              <td className="meta">Trip</td>
              <td>{trip.name}</td>
            </tr>
            <tr>
              <td className="meta">Traveler</td>
              <td>{trip.travelerName}</td>
            </tr>
            <tr>
              <td className="meta">Dates</td>
              <td>
                {trip.startDate} → {trip.endDate}
              </td>
            </tr>
            <tr>
              <td className="meta">Generated</td>
              <td>{new Date(invoice.generatedAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>
          Transactions <span className="muted">({transactions.length})</span>
        </h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th className="amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date.slice(0, 10)}</td>
                <td>{tx.merchantName}</td>
                <td>
                  <span className={`badge category-${tx.category}`}>{tx.category}</span>
                </td>
                <td className="amount">
                  {invoice.currency} {tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Subtotal by category</h2>
        <div className="subtotal-list">
          {Object.entries(subtotalsByCategory).map(([category, amount]) => (
            <div key={category} className="row-line">
              <span>{category}</span>
              <span className="amount">
                {invoice.currency} {amount.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="total-line">
            <span>Total</span>
            <span>
              {invoice.currency} {invoice.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Send to company</h2>
        {invoice.sentToCompany ? (
          <div className="alert success">Already sent to {recipient} on {new Date(invoice.sentAt).toLocaleString()}.</div>
        ) : (
          <form className="row" onSubmit={handleSend} style={{ alignItems: 'end' }}>
            <div className="field" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
              <label htmlFor="recipient">Company email (mock)</label>
              <input id="recipient" type="email" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
              <div className="hint">This logs a mock email on the backend — no real email is sent in this prototype.</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button className="btn" type="submit" disabled={sending}>
                {sending ? 'Sending…' : '✉️ Send to company'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
