import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';

import Volunteer from '../models/Volunteer';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_secure_secret';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, preferredType } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await Volunteer.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const volunteer = new Volunteer({ name, email, passwordHash, phone, preferredType });
    await volunteer.save();

    const token = jwt.sign({ id: volunteer._id }, JWT_SECRET, { expiresIn: '7d' });

    const out = volunteer.toObject();
    delete (out as any).passwordHash;

    res.status(201).json({ volunteer: out, token });
  } catch (err: any) {
    console.error('Register error', err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, volunteer.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: volunteer._id }, JWT_SECRET, { expiresIn: '7d' });

    const out = volunteer.toObject();
    delete (out as any).passwordHash;

    res.json({ volunteer: out, token });
  } catch (err: any) {
    console.error('Login error', err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
