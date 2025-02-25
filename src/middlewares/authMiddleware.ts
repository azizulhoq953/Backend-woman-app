// middlewares/authMiddleware.ts
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/types"; // Import the custom AuthRequest

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
             res.status(401).json({ message: "No token, authorization denied" });
             return
            }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        req.userId = decoded.userId; // Attach userId to the request object
        
        next(); // Call next() to pass control to the next middleware
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
