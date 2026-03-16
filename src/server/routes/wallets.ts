import { Router } from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = Router();
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

router.get('/', authenticate, (req: any, res) => {
  try {
    const wallets = db.prepare('SELECT * FROM wallets WHERE user_id = ?').all(req.user.userId);
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
