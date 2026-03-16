import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import db from '../db.js';
import crypto from 'crypto';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'spacex-elite-secret-key-change-in-prod';

// DTO Validation Schemas
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  country: z.string().min(2, 'Country is required')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { fullName, email, password, country } = validatedData;

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, country)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const insertWallet = db.prepare(`
      INSERT INTO wallets (id, user_id, type, balance)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      insertUser.run(userId, email, passwordHash, fullName, country);
      insertWallet.run(crypto.randomUUID(), userId, 'main', 0.0);
      insertWallet.run(crypto.randomUUID(), userId, 'investment', 0.0);
      insertWallet.run(crypto.randomUUID(), userId, 'profit', 0.0);
    });

    transaction();

    const token = jwt.sign({ userId, role: 'investor' }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      message: 'Registration successful',
      token,
      user: { id: userId, email, fullName, role: 'investor', kycStatus: 'not_started' }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // Capture basic device info from headers
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || req.socket.remoteAddress || 'Unknown IP';

    db.prepare(`
      INSERT INTO sessions (id, user_id, token, device_info, ip_address, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sessionId, user.id, token, userAgent, ipAddress, expiresAt.toISOString());

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        kycStatus: user.kyc_status
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware for protected routes
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/sessions', authenticate, (req: any, res) => {
  try {
    const sessions = db.prepare('SELECT id, device_info, ip_address, created_at, expires_at FROM sessions WHERE user_id = ? ORDER BY created_at DESC').all(req.user.userId);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', authenticate, (req: any, res) => {
  try {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(req.token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
