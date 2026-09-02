import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.resolve(__dirname, '../data/seesight.sqlite');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    traveler_name TEXT NOT NULL,
    name TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    budget REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active | completed
    fee_paid INTEGER NOT NULL DEFAULT 0,
    fee_amount REAL NOT NULL DEFAULT 3,
    fee_currency TEXT NOT NULL DEFAULT 'GEL',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES trips(id),
    provider TEXT NOT NULL,
    provider_card_id TEXT NOT NULL,
    masked_number TEXT NOT NULL,
    last4 TEXT NOT NULL,
    brand TEXT NOT NULL,
    exp_month INTEGER NOT NULL,
    exp_year INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active | closed
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    card_id TEXT NOT NULL REFERENCES cards(id),
    merchant_name TEXT NOT NULL,
    mcc TEXT,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GEL',
    category TEXT NOT NULL,
    raw_category_code TEXT,
    manually_recategorized INTEGER NOT NULL DEFAULT 0,
    occurred_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES trips(id),
    generated_at TEXT NOT NULL,
    total_amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GEL',
    pdf_path TEXT NOT NULL,
    sent_to_company INTEGER NOT NULL DEFAULT 0,
    sent_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_cards_trip_id ON cards(trip_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_card_id ON transactions(card_id);
  CREATE INDEX IF NOT EXISTS idx_invoices_trip_id ON invoices(trip_id);
`);
