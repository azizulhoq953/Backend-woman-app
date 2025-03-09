import { Request, Response } from "express";
import User from "../models/User";

// ✅ Get User's Partner ID
export const getUserByPartnerId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { partnerId } = req.params;
      const user = await User.findOne({ partnerId }).select("-password");
  
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
  
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        partnerId: user.partnerId,
        menstrualLastDay: user.menstrualLastDay,
        expectedNextDate: user.expectedNextDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };

// ✅ Get Partner's Profile using Partner ID
export const getPartnerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("partnerId");

    if (!user || !user.partnerId) {
      res.status(404).json({ error: "User or partner not found" });
      return;
    }

    const partner = await User.findOne({ partnerId: user.partnerId }).select("-password");
    if (!partner) {
      res.status(404).json({ error: "Partner not found" });
      return;
    }

    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
