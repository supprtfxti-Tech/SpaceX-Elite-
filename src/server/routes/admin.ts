import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

router.use(authenticateToken);

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

router.use(requireAdmin);

// Run system maintenance
router.post('/maintenance', (req: any, res) => {
  try {
    // Clean up expired sessions
    db.prepare('DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP').run();
    
    // Optimize database
    db.pragma('optimize');
    db.exec('VACUUM');
    db.exec('ANALYZE');
    
    res.json({ success: true, message: 'System maintenance completed successfully' });
  } catch (error) {
    console.error('Maintenance error:', error);
    res.status(500).json({ error: 'Failed to run maintenance' });
  }
});

// Get all users
router.get('/users', (req: any, res) => {
  try {
    const users = db.prepare(`
      SELECT id, email, full_name, role, kyc_status, created_at 
      FROM users 
      ORDER BY created_at DESC
    `).all();
    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system stats
router.get('/stats', (req: any, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const totalAum = db.prepare('SELECT SUM(balance) as total FROM wallets').get() as { total: number };
    const activeSessions = db.prepare('SELECT COUNT(*) as count FROM sessions WHERE expires_at > CURRENT_TIMESTAMP').get() as { count: number };
    
    const activeInvestments = db.prepare("SELECT COUNT(*) as count FROM investments WHERE status = 'active'").get() as { count: number };
    const totalInvestmentAmount = db.prepare("SELECT SUM(amount) as total FROM investments WHERE status = 'active'").get() as { total: number };
    
    const activeBots = db.prepare("SELECT COUNT(*) as count FROM trading_bots WHERE status = 'active'").get() as { count: number };
    const totalBotAllocation = db.prepare("SELECT SUM(allocated_amount) as total FROM trading_bots WHERE status = 'active'").get() as { total: number };
    
    const totalProperties = db.prepare('SELECT COUNT(*) as count FROM real_estate_properties').get() as { count: number };
    
    const recentTransactions = db.prepare(`
      SELECT t.id, t.type, t.amount, t.status, t.created_at, u.full_name, u.email
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `).all();

    res.json({
      totalUsers: totalUsers.count,
      totalAum: totalAum.total || 0,
      activeSessions: activeSessions.count,
      activeInvestments: activeInvestments.count,
      totalInvestmentAmount: totalInvestmentAmount.total || 0,
      activeBots: activeBots.count,
      totalBotAllocation: totalBotAllocation.total || 0,
      totalProperties: totalProperties.count,
      recentTransactions
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role
router.put('/users/:id/role', (req: any, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can change roles' });
    }

    if (!['investor', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user KYC status
router.put('/users/:id/kyc', (req: any, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['not_started', 'pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid KYC status' });
    }

    db.prepare('UPDATE users SET kyc_status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Update KYC error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manage user balance
router.post('/users/:id/balance', (req: any, res) => {
  try {
    const { amount, type, walletType = 'main' } = req.body; // type: 'add' or 'deduct'
    const { id } = req.params;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const wallet = db.prepare('SELECT id, balance FROM wallets WHERE user_id = ? AND type = ?').get(id, walletType) as any;
    
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const newBalance = type === 'add' ? wallet.balance + amount : wallet.balance - amount;
    
    if (newBalance < 0) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const transaction = db.transaction(() => {
      db.prepare('UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newBalance, wallet.id);
      
      const txId = crypto.randomUUID();
      const txAmount = type === 'add' ? amount : -amount;
      db.prepare(`
        INSERT INTO transactions (id, user_id, wallet_id, type, amount, status, description)
        VALUES (?, ?, ?, ?, ?, 'completed', ?)
      `).run(
        txId, 
        id, 
        wallet.id, 
        type === 'add' ? 'deposit' : 'withdrawal', 
        txAmount, 
        `Admin balance adjustment (${type})`
      );
    });

    transaction();
    res.json({ success: true, newBalance });
  } catch (error) {
    console.error('Manage balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/users/:id', (req: any, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can delete users' });
    }

    if (req.user.id === id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const transaction = db.transaction(() => {
      db.prepare('DELETE FROM transactions WHERE user_id = ?').run(id);
      db.prepare('DELETE FROM wallets WHERE user_id = ?').run(id);
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(id);
      db.prepare('DELETE FROM trading_bots WHERE user_id = ?').run(id);
      db.prepare('DELETE FROM investments WHERE user_id = ?').run(id);
      db.prepare('DELETE FROM real_estate_investments WHERE user_id = ?').run(id);
      db.prepare('DELETE FROM users WHERE id = ?').run(id);
    });

    transaction();
    res.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- INVESTMENTS ---

// Get all investments
router.get('/investments', (req: any, res) => {
  try {
    const investments = db.prepare(`
      SELECT i.*, u.full_name as user_name, u.email as user_email
      FROM investments i
      JOIN users u ON i.user_id = u.id
      ORDER BY i.start_date DESC
    `).all();
    res.json(investments);
  } catch (error) {
    console.error('Admin investments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update investment status
router.put('/investments/:id/status', (req: any, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare('UPDATE investments SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Update investment status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete investment
router.delete('/investments/:id', (req: any, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM investments WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete investment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- REAL ESTATE PROPERTIES ---

// Get all real estate properties
router.get('/real-estate', (req: any, res) => {
  try {
    const properties = db.prepare(`
      SELECT * FROM real_estate_properties
      ORDER BY created_at DESC
    `).all();
    res.json(properties);
  } catch (error) {
    console.error('Admin real estate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create real estate property
router.post('/real-estate', (req: any, res) => {
  try {
    const { title, location, description, price, roi_percentage, status, image_url } = req.body;
    
    if (!title || !location || !price || !roi_percentage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO real_estate_properties (id, title, location, description, price, roi_percentage, status, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, location, description, price, roi_percentage, status || 'available', image_url);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Create real estate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update real estate property
router.put('/real-estate/:id', (req: any, res) => {
  try {
    const { title, location, description, price, roi_percentage, status, image_url } = req.body;
    const { id } = req.params;

    db.prepare(`
      UPDATE real_estate_properties 
      SET title = ?, location = ?, description = ?, price = ?, roi_percentage = ?, status = ?, image_url = ?
      WHERE id = ?
    `).run(title, location, description, price, roi_percentage, status, image_url, id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update real estate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete real estate property
router.delete('/real-estate/:id', (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Check if there are active investments
    const investments = db.prepare('SELECT COUNT(*) as count FROM real_estate_investments WHERE property_id = ?').get(id) as { count: number };
    if (investments.count > 0) {
      return res.status(400).json({ error: 'Cannot delete property with active investments' });
    }

    db.prepare('DELETE FROM real_estate_properties WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete real estate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- TRADING BOTS ---

// Get all trading bots
router.get('/bots', (req: any, res) => {
  try {
    const bots = db.prepare(`
      SELECT b.*, u.full_name as user_name, u.email as user_email
      FROM trading_bots b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `).all();
    res.json(bots);
  } catch (error) {
    console.error('Admin bots error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update bot status
router.put('/bots/:id/status', (req: any, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare('UPDATE trading_bots SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Update bot status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete bot
router.delete('/bots/:id', (req: any, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM trading_bots WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete bot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
