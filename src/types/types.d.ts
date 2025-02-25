import { Request } from "express";

export interface AuthRequest extends Request {
    userId?: string; // Ensure it's optional to avoid TypeScript complaints
}
