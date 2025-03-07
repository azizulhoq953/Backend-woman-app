import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

// Extend Request interface to include user property
declare module "express-serve-static-core" {
    interface Request {
        user?: any;
    }
}

// Middleware to authenticate users
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ error: "Access denied" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as any;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};


// Middleware for Admin Access
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await User.findById(req.user.id);
        if (!user || user.role !== "admin") {
            res.status(403).json({ error: "Access denied" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
