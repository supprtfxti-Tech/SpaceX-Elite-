import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

router.use(authenticateToken);

// Get user transactions
router.get('/', (req: any, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const transactions = db.prepare(`
      SELECT * FROM transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset);

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM transactions WHERE user_id = ?
    `).get(userId) as { count: number };

    res.json({
      transactions,
      total: total.count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a transaction (deposit/withdraw)
router.post('/', (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { walletId, type, amount, currency, status, details, description } = req.body;
    const desc = description || details || null;
    const dbType = type === 'withdraw' ? 'withdrawal' : type;

    if (!walletId || !type || !amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Begin transaction
    const createTx = db.transaction(() => {
      // Check wallet exists and belongs to user
      const wallet = db.prepare('SELECT * FROM wallets WHERE id = ? AND user_id = ?').get(walletId, userId) as any;
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // If withdrawal, check balance
      if (type === 'withdraw' && wallet.balance < Math.abs(amount)) {
        throw new Error('Insufficient funds');
      }

      // Update wallet balance
      db.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').run(amount, walletId);

      // Insert transaction
      const result = db.prepare(`
        INSERT INTO transactions (id, user_id, wallet_id, type, amount, currency, status, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        userId,
        walletId,
        dbType,
        amount,
        currency,
        status || 'completed',
        desc
      );

      return result;
    });

    createTx();
    res.status(201).json({ message: 'Transaction successful' });
  } catch (error: any) {
    console.error('Create transaction error:', error);
    res.status(400).json({ error: error.message || 'Transaction failed' });
  }
});

export default router;
