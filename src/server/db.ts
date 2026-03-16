import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../database.sqlite');

const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    role TEXT DEFAULT 'investor',
    kyc_status TEXT DEFAULT 'not_started',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS wallets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'main', 'investment', 'profit', 'referral'
    balance REAL DEFAULT 0.0,
    currency TEXT DEFAULT 'USD',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    device_info TEXT,
    ip_address TEXT,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    wallet_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'investment', 'profit', 'transfer'
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id)
  );

  CREATE TABLE IF NOT EXISTS trading_bots (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    bot_type TEXT DEFAULT 'basic', -- 'basic', 'arbitrage', 'ai_quantum'
    status TEXT DEFAULT 'inactive', -- 'active', 'inactive'
    strategy TEXT DEFAULT 'moderate', -- 'conservative', 'moderate', 'aggressive'
    pair TEXT DEFAULT 'BTC/USD',
    allocated_amount REAL DEFAULT 0.0,
    profit_loss REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS investments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    amount REAL NOT NULL,
    daily_roi REAL NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    total_profit REAL DEFAULT 0.0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS real_estate_properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    roi_percentage REAL NOT NULL,
    status TEXT DEFAULT 'available', -- 'available', 'sold_out'
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS real_estate_investments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    property_id TEXT NOT NULL,
    amount REAL NOT NULL,
    shares INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES real_estate_properties(id)
  );
`);

// Handle schema migrations
try {
  db.prepare("ALTER TABLE trading_bots ADD COLUMN bot_type TEXT DEFAULT 'basic'").run();
} catch (e) {
  // Column already exists
}

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Seed admin user
const adminEmail = 'teslaprimeadmai@gmail.com';
const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

if (!adminExists) {
  const adminId = crypto.randomUUID();
  const passwordHash = bcrypt.hashSync('Richie1@', 10);
  
  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, kyc_status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(adminId, adminEmail, passwordHash, 'Admin', 'admin', 'verified');

  const insertWallet = db.prepare(`
    INSERT INTO wallets (id, user_id, type, balance)
    VALUES (?, ?, ?, ?)
  `);
  
  const transaction = db.transaction(() => {
    insertWallet.run(crypto.randomUUID(), adminId, 'main', 0.0);
    insertWallet.run(crypto.randomUUID(), adminId, 'investment', 0.0);
    insertWallet.run(crypto.randomUUID(), adminId, 'profit', 0.0);
  });
  
  transaction();
} else {
  // Ensure existing admin is upgraded to admin
  db.prepare('UPDATE users SET role = ? WHERE email = ?').run('admin', adminEmail);
}

export default db;
