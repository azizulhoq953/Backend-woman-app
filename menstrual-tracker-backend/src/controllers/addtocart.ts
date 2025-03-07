import { Request, Response } from "express";
import Order from "../models/Order";

export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, products, totalAmount, paymentMethod, transactionId, paymentDetails } = req.body;

        if (!userId || !Array.isArray(products) || products.length === 0 || !totalAmount || !paymentMethod || !transactionId) {
            res.status(400).json({ error: "All fields are required" });
            return; // Ensures no further execution
        }

        const order = new Order({
            userId,
            products,
            totalAmount,
            paymentMethod,
            transactionId,
            paymentDetails,
        });

        await order.save();
        
        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
