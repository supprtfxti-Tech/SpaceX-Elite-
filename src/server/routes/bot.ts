import express from 'express';
import { z } from 'zod';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

router.use(authenticateToken);

// Get bot status
router.get('/', (req: any, res) => {
  try {
    let bot = db.prepare('SELECT * FROM trading_bots WHERE user_id = ?').get(req.user.userId);
    
    if (!bot) {
      // Create default bot profile
      const botId = crypto.randomUUID();
      db.prepare(`
        INSERT INTO trading_bots (id, user_id, bot_type, status, strategy, pair, allocated_amount, profit_loss)
        VALUES (?, ?, 'basic', 'inactive', 'moderate', 'BTC/USD', 0.0, 0.0)
      `).run(botId, req.user.userId);
      
      bot = db.prepare('SELECT * FROM trading_bots WHERE user_id = ?').get(req.user.userId);
    }
    
    res.json(bot);
  } catch (error) {
    console.error('Bot fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const configSchema = z.object({
  strategy: z.enum(['conservative', 'moderate', 'aggressive']),
  pair: z.string().min(1),
  allocated_amount: z.number().min(0)
});

// Update bot config
router.put('/config', (req: any, res) => {
  try {
    const validatedData = configSchema.parse(req.body);
    
    db.prepare(`
      UPDATE trading_bots 
      SET strategy = ?, pair = ?, allocated_amount = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(validatedData.strategy, validatedData.pair, validatedData.allocated_amount, req.user.userId);
    
    const updatedBot = db.prepare('SELECT * FROM trading_bots WHERE user_id = ?').get(req.user.userId);
    res.json(updatedBot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error('Bot config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const toggleSchema = z.object({
  status: z.enum(['active', 'inactive'])
});

// Toggle bot status
router.post('/toggle', (req: any, res) => {
  try {
    const { status } = toggleSchema.parse(req.body);
    
    db.prepare(`
      UPDATE trading_bots 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(status, req.user.userId);
    
    const updatedBot = db.prepare('SELECT * FROM trading_bots WHERE user_id = ?').get(req.user.userId);
    res.json(updatedBot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error('Bot toggle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const purchaseSchema = z.object({
  bot_type: z.enum(['basic', 'arbitrage', 'ai_quantum', 'gemini_champ', 'optimus_prime']),
  price: z.number().min(0)
});

// Purchase bot type
router.post('/purchase', (req: any, res) => {
  try {
    const { bot_type, price } = purchaseSchema.parse(req.body);
    
    const tx = db.transaction(() => {
      if (price > 0) {
        // Check wallet balance
        const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ? AND type = ? AND currency = ?').get(req.user.userId, 'main', 'USD') as any;
        
        if (!wallet || wallet.balance < price) {
          throw new Error('Insufficient USD balance to purchase this bot');
        }
        
        // Deduct balance
        db.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').run(price, wallet.id);
        
        // Record transaction
        const txId = crypto.randomUUID();
        db.prepare(`
          INSERT INTO transactions (id, user_id, wallet_id, type, amount, currency, status, description)
          VALUES (?, ?, ?, 'investment', ?, 'USD', 'completed', ?)
        `).run(txId, req.user.userId, wallet.id, -price, `Purchased ${bot_type} trading bot`);
      }
      
      // Update bot
      db.prepare(`
        UPDATE trading_bots 
        SET bot_type = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?
      `).run(bot_type, req.user.userId);
      
      return db.prepare('SELECT * FROM trading_bots WHERE user_id = ?').get(req.user.userId);
    });
    
    const updatedBot = tx();
    res.json(updatedBot);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error('Bot purchase error:', error);
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
