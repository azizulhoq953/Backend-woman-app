import { Request, Response } from "express";
import User from "../models/User";
import moment from "moment";
import { AuthRequest } from "../types/types"; // Import the custom AuthRequest

export const getNextMenstrualDate = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id; // or req.user.id if using middleware
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!user.lastMensDate) {
            res.status(400).json({ message: "Last menstrual date not provided" });
            return;
        }

        // Calculate next menstrual date (assuming 28-day cycle)
        const lastDate = new Date(user.lastMensDate);
        const nextMenstrualDate = new Date(lastDate);
        nextMenstrualDate.setDate(lastDate.getDate() + 28);

        res.status(200).json({
            lastMenstrualDate: user.lastMensDate,
            nextMenstrualDate: nextMenstrualDate.toISOString().split("T")[0], // Format YYYY-MM-DD
        });

    } catch (error) {
        console.error("Error getting next menstrual date:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// Update last menstrual date & calculate next menstrual date
export const updateMenstrualCycle = async (req: AuthRequest, res: Response) => {
    try {
        const { lastMensDate, cycleLength } = req.body;

        if (!lastMensDate) {
             res.status(400).json({ message: "Last menstrual date is required" });
             return
            }

        // Convert lastMensDate to Date object
        const lastDate = new Date(lastMensDate);
        if (isNaN(lastDate.getTime())) {
             res.status(400).json({ message: "Invalid date format" });
             return
            }

        // Calculate next menstrual date
        const nextMensDate = moment(lastDate).add(cycleLength || 28, "days").toDate();

        // Update user record
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { lastMensDate: lastDate, nextMensDate, cycleLength },
            { new: true }
        );

        res.json({
            message: "Menstrual cycle updated successfully",
            lastMensDate: updatedUser?.lastMensDate,
            nextMensDate: updatedUser?.nextMensDate,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};