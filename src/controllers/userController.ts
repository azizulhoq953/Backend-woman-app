// controllers/userController.ts
import { Request, Response } from "express";
import { AuthRequest } from "../types/types"; // Import the custom AuthRequest
import User from "../models/User"; // Adjust this import according to your models

export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId); // Use req.userId
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const { name, email, password } = req.body; // Extract data from the request body

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, email, password }, // Adjust the fields as necessary
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
