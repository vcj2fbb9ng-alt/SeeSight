# SeeSight — travel expense card prototype

> **⚠️ SANDBOX / TEST-MODE PROTOTYPE. NO REAL MONEY EVER MOVES.**
> Card issuance is fabricated locally (no real card-issuing account, no real
> card network). Payment is a stub. Apple Pay provisioning is a mocked
> button. Emailing the invoice is a stub that logs to the server console.
> See [Sandbox / mock boundaries](#sandbox--mock-boundaries) below for the
> full list of what's real vs. simulated.

SeeSight lets a business traveler request a virtual card for a trip,
simulates purchases on that card getting auto-categorized, and generates a
clean itemized PDF invoice for the employer — end to end, with no real bank
credentials required. The UI is mobile-first (built and tested at
iPhone-width viewports first, then progressively enhanced for desktop), and
invoices are written to be self-explanatory to a finance reviewer: a
business purpose, a plain-English line per charge, and an explicit
"already paid, nothing to reimburse" statement.

## Flow

1. **Request a trip card** — fill in trip name, destination, dates, budget,
   employer name, and a short business purpose; "pay" a 3 GEL one-time
   issuance fee (mock); a sandbox virtual card is issued for the trip.
2. **Transactions come in** — click a preset button (or fill a custom
   merchant/amount) to simulate a purchase on the card, or POST a
   webhook-shaped payload to `/api/webhooks/provider` to simulate the
   provider pushing a transaction. Each transaction is auto-categorized
   into Hotel / Flight / Meals / Transport / Other using merchant-category
   code (MCC) and merchant-name rules, and gets a plain-English business
   description (e.g. "Lodging — accommodation at Hilton Vienna during
   business travel"). Re-categorize any transaction by hand from a
   dropdown — its description regenerates to match.
3. **Generate the invoice** — on demand, or after marking the trip
   complete: a clean itemized PDF is generated (invoice number, employer,
   business purpose, card used, a "paid in full — no reimbursement owed"
   callout, per-transaction descriptions, subtotals by category, total,
   and a signature line) and can be downloaded or "sent to the company"
   (mock — logs to the backend console).

## Tech stack

- **Backend**: Node.js + Express, SQLite (`better-sqlite3`), `pdfkit` for
  invoice PDFs.
- **Frontend**: React (Vite), plain CSS (mobile-first, no framework),
  `react-router-dom`.
- **Card issuing**: a pluggable provider interface with a `mock` sandbox
  implementation (fabricates card data locally — see
  [`backend/src/services/cardIssuing/README.md`](backend/src/services/cardIssuing/README.md)
  for how a real sandbox provider like Stripe Issuing test mode or Marqeta
  sandbox would plug in behind the same interface).

## Data model

- **Trip**: id, traveler name, name, destination, start/end date, budget,
  business purpose, employer name, status (`active`/`completed`), fee paid.
- **Card**: id, trip id, provider, provider card id, masked number, last4,
  brand, expiry, status.
- **Transaction**: id, card id, merchant name, MCC, amount, category, a
  generated business-purpose description, raw category code,
  manually-recategorized flag, timestamp.
- **Invoice**: id, invoice number, trip id, generated at, total amount, PDF
  path, sent flag.

## Running it locally

Requires Node.js 20+.

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
# → SeeSight backend listening on http://localhost:4000
```

The SQLite database file and generated invoice PDFs are created
automatically under `backend/data/` and `backend/invoices/` on first run.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:4000`, so just
open http://localhost:5173.

### 3. Try the flow

1. Open http://localhost:5173, click **+ New trip**, fill in the form
   (including the employer name and business purpose, used on the
   invoice), and submit — this mock-charges the 3 GEL fee and issues a
   sandbox card in one step.
2. On the trip page, click a few of the **Simulate a transaction** preset
   buttons (Hotel / Flight / Meal / Transport / Other) — watch each land in
   the transactions table, already categorized.
3. Try re-categorizing one from its dropdown.
4. Click **Generate invoice** to get an itemized PDF; download it or click
   **Send to company** (check the backend terminal for the logged mock
   email).

## API overview

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/trips` | Create a trip, mock-charge the fee, issue a sandbox card |
| GET | `/api/trips` | List trips |
| GET | `/api/trips/:id` | Trip + card + transactions + invoices |
| POST | `/api/trips/:id/complete` | Mark a trip completed |
| POST | `/api/trips/:id/invoice` | Generate (or regenerate) the trip's invoice |
| GET | `/api/presets` | Demo transaction presets for the "simulate" buttons |
| POST | `/api/cards/:cardId/transactions/simulate` | Simulate a transaction landing on a card |
| GET | `/api/cards/:cardId/transactions` | List a card's transactions |
| PATCH | `/api/transactions/:id` | Manually re-categorize a transaction |
| POST | `/api/webhooks/provider` | Simulated sandbox-provider webhook (`issuing_transaction.created`) |
| GET | `/api/invoices/:id` | Invoice detail (JSON) |
| GET | `/api/invoices/:id/pdf` | Invoice PDF |
| POST | `/api/invoices/:id/send` | Mock "send to company" (logs an email) |

## Categorization rules

Simple, transparent, and prototype-appropriate — see
[`backend/src/services/categorization.js`](backend/src/services/categorization.js):

1. Match the transaction's merchant category code (MCC) against known
   ranges (e.g. `7011` → Hotel, `3000`–`3299` → Flight, `5812`–`5814` →
   Meals, taxi/transit/rental/fuel codes → Transport).
2. If there's no MCC or no match, fall back to keyword matching on the
   merchant name (e.g. "hotel", "airlines", "cafe", "uber").
3. Otherwise, default to Other.

A traveler can always override the result — that override is recorded (
`manuallyRecategorized`) and never gets clobbered by re-running
categorization.

## Mobile-first design

The traveler-facing UI (`frontend/src/index.css`) is written mobile-first:
base styles target a small viewport, wrapped in touch-sized controls
(44px-tall inputs/buttons, 16px input font to stop iOS auto-zoom, full-width
stacked primary actions), and a single `@media (min-width: 640px)` block
opts into a roomier two-column desktop layout on top of that base — never
the other way around. Wide tables (transaction lists) scroll horizontally
within their own card instead of squeezing illegible columns onto a phone
screen. Tested at iPhone viewport widths with Playwright throughout
development.

## Making the invoice credible to a finance reviewer

An itemized list of amounts alone tends to draw follow-up questions. Each
invoice instead answers them up front:

- **Invoice number, "prepared for" employer, and business purpose** at the
  top, so it reads as a discrete filed document, not a raw transaction dump.
- **A plain-English description on every line** (e.g. "Airfare — business
  travel booked with Austrian Airlines"), generated from the category — see
  `describeTransaction()` in `categorization.js` — so no line item needs a
  follow-up email to explain itself.
- **An explicit "PAID IN FULL … no reimbursement is owed to the traveler"
  callout**, naming the card used. This is the single biggest thing that
  separates a SeeSight invoice from a typical reimbursement expense report:
  the money already moved (in this prototype, in simulation) at time of
  purchase, so the invoice is pure record-keeping, not a payment request.
- **A signature line** ("Approved by … / Date"), so the PDF is ready to be
  filed as-is once a manager signs off.

## Sandbox / mock boundaries

Being explicit about what's simulated, per the prototype's scope:

| Piece | What happens here |
|---|---|
| Card issuance | **Mocked.** `mockProvider.js` fabricates a card number, expiry, and provider id locally — no card network, no card-issuing account. Swappable behind the same interface for a real sandbox (Stripe Issuing test mode / Marqeta sandbox) — see the cardIssuing README. |
| Card fee payment | **Mocked.** `mockPayment.js` always returns success — no payment processor is called. |
| Apple Pay / wallet | **Mocked UI only.** The "Add to Apple Pay" button is disabled with an explanatory note — real wallet provisioning needs the issuing bank's own agreement with Apple, out of scope here. |
| Transactions | **Simulated**, via a "simulate transaction" button/preset, or a webhook-shaped POST to `/api/webhooks/provider` that mimics a sandbox provider's transaction webhook. No real purchases occur. |
| Categorization | **Real rule-based logic**, run against the (simulated) transaction data — this part genuinely works, just on fake input. |
| Invoice PDF | **Real PDF generation** (`pdfkit`) from real (simulated) data in the local database. |
| "Send to company" | **Mocked.** Logs the would-be email to the backend console and marks the invoice sent — no real email infrastructure. |

## Out of scope (by design)

Matches the prototype brief: real Apple Pay wallet provisioning, real money
movement, a company-side login/dashboard, AI receipt scanning, and any
actual bank API integration (e.g. Bank of Georgia). A generic sandbox-style
provider interface is used instead so the app isn't blocked on real bank
API access.
