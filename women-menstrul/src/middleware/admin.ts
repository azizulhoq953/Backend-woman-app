// src/middleware/admin.ts
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Not authorized as an admin' });
  }
};