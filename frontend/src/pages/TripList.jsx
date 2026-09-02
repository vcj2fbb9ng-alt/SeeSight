import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function TripList() {
  const [trips, setTrips] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .listTrips()
      .then(setTrips)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Trips</h1>
        <Link to="/new" className="btn sm">
          + New trip
        </Link>
      </div>

      {error && <div className="alert error">{error}</div>}

      {trips === null && !error && <p>Loading…</p>}

      {trips && trips.length === 0 && (
        <div className="empty-state card">
          <div className="empty-icon">🧳</div>
          <p>No trips yet — request a card to get started.</p>
          <Link to="/new" className="btn">
            Request your first trip card
          </Link>
        </div>
      )}

      {trips && trips.length > 0 && (
        <div className="trip-list">
          {trips.map((trip) => (
            <Link key={trip.id} to={`/trips/${trip.id}`} className="trip-row">
              <div>
                <div>
                  <strong>{trip.name}</strong>
                </div>
                <div className="meta">
                  {trip.destination} · {trip.startDate} → {trip.endDate} · {trip.travelerName}
                </div>
              </div>
              <span className={`badge ${trip.status}`}>{trip.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
