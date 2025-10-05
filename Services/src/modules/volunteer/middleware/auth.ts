import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Volunteer from '../models/Volunteer';
import dotenv from 'dotenv';
import path from 'path';

// Resolve Services/.env relative to this file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_secure_secret';

export interface AuthRequest extends Request {
  volunteer?: any;
}

export const authenticateVolunteer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

    const token = authHeader.replace('Bearer ', '');
    const payload: any = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.id) return res.status(401).json({ message: 'Invalid token' });

    const volunteer = await Volunteer.findById(payload.id).select('-passwordHash');
    if (!volunteer) return res.status(401).json({ message: 'Volunteer not found' });

    req.volunteer = volunteer;
    next();
  } catch (err: any) {
    console.error('Auth error', err.message || err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authenticateVolunteer;
