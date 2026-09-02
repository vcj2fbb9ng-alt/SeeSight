import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';

const CATEGORIES = ['Hotel', 'Flight', 'Meals', 'Transport', 'Other'];

export default function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [presets, setPresets] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [customTx, setCustomTx] = useState({ merchantName: '', amount: '', mcc: '' });

  const reload = useCallback(() => {
    return api
      .getTrip(tripId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [tripId]);

  useEffect(() => {
    reload();
    api.transactionPresets().then(setPresets).catch(() => {});
  }, [reload]);

  async function withBusy(fn) {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function simulate(preset) {
    withBusy(async () => {
      await api.simulateTransaction(data.card.id, preset);
      setNotice(`Simulated: ${preset.merchantName} — ${data.trip.feeCurrency} ${preset.amount}`);
      await reload();
    });
  }

  function simulateCustom(e) {
    e.preventDefault();
    if (!customTx.merchantName || !customTx.amount) return;
    simulate({
      merchantName: customTx.merchantName,
      amount: Number(customTx.amount),
      mcc: customTx.mcc || undefined,
    });
    setCustomTx({ merchantName: '', amount: '', mcc: '' });
  }

  function recategorize(txId, category) {
    withBusy(async () => {
      await api.recategorizeTransaction(txId, category);
      await reload();
    });
  }

  function completeTrip() {
    withBusy(async () => {
      await api.completeTrip(tripId);
      await reload();
    });
  }

  function generateInvoice() {
    withBusy(async () => {
      const invoice = await api.generateInvoice(tripId);
      navigate(`/invoices/${invoice.id}`);
    });
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

  const { trip, card, transactions, invoices } = data;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>{trip.name}</h1>
          <div className="meta" style={{ marginTop: 4 }}>
            {trip.destination} · {trip.startDate} → {trip.endDate} · {trip.travelerName}
          </div>
          {(trip.purpose || trip.employerName) && (
            <div className="meta" style={{ marginTop: 2 }}>
              {trip.purpose && <>Purpose: {trip.purpose}</>}
              {trip.purpose && trip.employerName && ' · '}
              {trip.employerName && <>For: {trip.employerName}</>}
            </div>
          )}
        </div>
        <span className={`badge ${trip.status}`}>{trip.status}</span>
      </div>

      {error && <div className="alert error">{error}</div>}
      {notice && <div className="alert success">{notice}</div>}

      <div className="card">
        <h2>Trip card</h2>
        {card ? (
          <>
            <div className="card-visual">
              <div className="card-brand">
                <span>SeeSight · {card.brand}</span>
                <span>{card.status === 'active' ? 'Active' : card.status}</span>
              </div>
              <div className="card-number">{card.maskedNumber}</div>
              <div className="card-foot">
                <div>
                  <span className="label">Cardholder</span>
                  {trip.travelerName}
                </div>
                <div>
                  <span className="label">Expires</span>
                  {String(card.expMonth).padStart(2, '0')}/{card.expYear}
                </div>
              </div>
            </div>
            <div className="actions-row" style={{ marginTop: 12 }}>
              <button type="button" className="btn secondary" disabled title="Wallet provisioning is mocked in this prototype">
                🍎 Add to Apple Pay
              </button>
            </div>
            <div className="wallet-note">
              <span>ℹ️</span>
              <span>
                Adding to Apple Pay is mocked here — real wallet provisioning requires the card-issuing bank's own
                agreement with Apple, which is outside this prototype's scope. Provider: <code>{card.provider}</code>
                {' · '}sandbox card id <code>{card.providerCardId}</code>.
              </span>
            </div>
          </>
        ) : (
          <p>No card issued for this trip.</p>
        )}
      </div>

      <div className="card">
        <h2>
          Simulate a transaction <span className="muted">(stands in for a provider webhook)</span>
        </h2>
        <div className="preset-grid">
          {presets.map((p) => (
            <button key={p.label} type="button" className="preset-btn" disabled={busy} onClick={() => simulate(p)}>
              {p.label} · {trip.feeCurrency} {p.amount}
            </button>
          ))}
        </div>
        <form onSubmit={simulateCustom} className="row" style={{ alignItems: 'end' }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Merchant name</label>
            <input
              type="text"
              value={customTx.merchantName}
              onChange={(e) => setCustomTx((c) => ({ ...c, merchantName: e.target.value }))}
              placeholder="e.g. Local Grocery"
            />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={customTx.amount}
              onChange={(e) => setCustomTx((c) => ({ ...c, amount: e.target.value }))}
              placeholder="e.g. 12.50"
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button className="btn secondary block" type="submit" disabled={busy || !customTx.merchantName || !customTx.amount}>
              Simulate custom transaction
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>
          Transactions <span className="muted">({transactions.length})</span>
        </h2>
        {transactions.length === 0 ? (
          <p className="meta">No transactions yet — simulate one above.</p>
        ) : (
          <div className="table-wrap">
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
                    <td>{tx.occurredAt.slice(0, 10)}</td>
                    <td>
                      <div>{tx.merchantName}</div>
                      {tx.description && <div className="meta" style={{ fontSize: 11, marginTop: 2 }}>{tx.description}</div>}
                    </td>
                    <td>
                      <select
                        value={tx.category}
                        onChange={(e) => recategorize(tx.id, e.target.value)}
                        disabled={busy}
                        style={{ width: 'auto', padding: '4px 8px', fontSize: 12.5 }}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {tx.manuallyRecategorized && (
                        <span className="meta" style={{ marginLeft: 6, fontSize: 11 }}>
                          (edited)
                        </span>
                      )}
                    </td>
                    <td className="amount">
                      {tx.currency} {tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Invoice</h2>
        <div className="actions-row">
          {trip.status === 'active' && (
            <button className="btn secondary" onClick={completeTrip} disabled={busy}>
              Mark trip complete
            </button>
          )}
          <button className="btn" onClick={generateInvoice} disabled={busy || transactions.length === 0}>
            Generate invoice
          </button>
        </div>
        {transactions.length === 0 && <p className="meta" style={{ marginTop: 10 }}>Add at least one transaction first.</p>}

        {invoices.length > 0 && (
          <>
            <div className="section-title">Previously generated</div>
            <div className="trip-list">
              {invoices.map((inv) => (
                <Link key={inv.id} to={`/invoices/${inv.id}`} className="trip-row">
                  <div>
                    <strong>
                      {inv.currency} {inv.totalAmount.toFixed(2)}
                    </strong>
                    <div className="meta">{new Date(inv.generatedAt).toLocaleString()}</div>
                  </div>
                  <span className={`badge ${inv.sentToCompany ? 'active' : ''}`}>
                    {inv.sentToCompany ? 'Sent' : 'View'}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
