import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

const initialForm = {
  travelerName: '',
  name: '',
  destination: '',
  startDate: '',
  endDate: '',
  budget: '',
  purpose: '',
  employerName: '',
};

export default function NewTrip() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit =
    form.travelerName && form.name && form.destination && form.startDate && form.endDate && Number(form.budget) > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await api.createTrip({ ...form, budget: Number(form.budget) });
      navigate(`/trips/${result.trip.id}`, { state: { justCreated: true } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Request a trip card</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <h2>Trip details</h2>

        <div className="field">
          <label htmlFor="travelerName">Traveler name</label>
          <input id="travelerName" type="text" value={form.travelerName} onChange={set('travelerName')} placeholder="e.g. Nino Kapanadze" required />
        </div>

        <div className="field">
          <label htmlFor="name">Trip name</label>
          <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="e.g. Berlin Client Visit" required />
        </div>

        <div className="field">
          <label htmlFor="destination">Destination</label>
          <input id="destination" type="text" value={form.destination} onChange={set('destination')} placeholder="e.g. Berlin, Germany" required />
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="startDate">Start date</label>
            <input id="startDate" type="date" value={form.startDate} onChange={set('startDate')} required />
          </div>
          <div className="field">
            <label htmlFor="endDate">End date</label>
            <input id="endDate" type="date" value={form.endDate} onChange={set('endDate')} required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="budget">Estimated budget (GEL)</label>
          <input id="budget" type="number" min="1" step="0.01" value={form.budget} onChange={set('budget')} placeholder="e.g. 1200" required />
        </div>

        <h2 style={{ marginTop: 22 }}>For the invoice</h2>

        <div className="field">
          <label htmlFor="employerName">Employer / company name</label>
          <input
            id="employerName"
            type="text"
            value={form.employerName}
            onChange={set('employerName')}
            placeholder="e.g. Acme Consulting LLC"
          />
          <div className="hint">Shown as "Prepared for" on the invoice. Optional, but recommended for finance teams.</div>
        </div>

        <div className="field">
          <label htmlFor="purpose">Business purpose</label>
          <input
            id="purpose"
            type="text"
            value={form.purpose}
            onChange={set('purpose')}
            placeholder="e.g. Client meetings and Q3 project kickoff"
          />
          <div className="hint">A short business justification for the trip — printed on the invoice.</div>
        </div>

        {error && <div className="alert error">{error}</div>}

        <div className="alert info">
          <span>💳</span>
          <span>
            One-time card issuance fee: <strong>3 GEL</strong> (mock payment — no real card is charged in this
            prototype). Submitting will charge the mock fee and issue a sandbox virtual card in one step.
          </span>
        </div>

        <button className="btn block" type="submit" disabled={!canSubmit || submitting}>
          {submitting ? (
            <>
              <span className="spinner-inline" /> Paying &amp; issuing card…
            </>
          ) : (
            'Pay 3 GEL & issue trip card'
          )}
        </button>
      </form>
    </div>
  );
}
