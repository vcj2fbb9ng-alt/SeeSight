import { Link, Route, Routes } from 'react-router-dom';
import TripList from './pages/TripList.jsx';
import NewTrip from './pages/NewTrip.jsx';
import TripDetail from './pages/TripDetail.jsx';
import InvoiceView from './pages/InvoiceView.jsx';

export default function App() {
  return (
    <>
      <div className="sandbox-banner">
        SANDBOX / TEST MODE — no real cards are issued and no real money moves
      </div>
      <header className="topbar">
        <Link to="/" className="brand">
          <strong>SeeSight</strong>
          <span>trip expense cards</span>
        </Link>
        <Link to="/new" className="btn">
          + New trip
        </Link>
      </header>

      <Routes>
        <Route path="/" element={<TripList />} />
        <Route path="/new" element={<NewTrip />} />
        <Route path="/trips/:tripId" element={<TripDetail />} />
        <Route path="/invoices/:invoiceId" element={<InvoiceView />} />
      </Routes>
    </>
  );
}
