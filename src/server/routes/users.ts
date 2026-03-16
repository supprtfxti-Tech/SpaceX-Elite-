import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Middleware to verify JWT (simplified for prototype)
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'spacex-elite-secret-key-change-in-prod';

const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/me', authenticate, (req: any, res) => {
  try {
    const user = db.prepare('SELECT id, email, full_name, phone, country, role, kyc_status, created_at FROM users WHERE id = ?').get(req.user.userId) as any;
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
