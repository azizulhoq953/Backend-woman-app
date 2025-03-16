import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/User"; // Adjust path if needed

export const followUser = async (req: Request, res: Response): Promise<void> =>  {
    try {
      const { userId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
         res.status(400).json({ error: "Invalid User ID format" });
         return
      }
  
      const objectId = new mongoose.Types.ObjectId(userId);
      const user = await User.findById(objectId);
  
      if (!user) {
         res.status(404).json({ error: "User not found" });
         return
      }
  
       res.status(200).json(user);
       return
    } catch (error) {
       res.status(500).json({ error: "Internal Server Error" });
       return
    }
  };

//get followers
export const getFollowers = async (req: Request, res: Response): Promise<void> =>  {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("followers", "name email");
  
      if (!user) {
         res.status(404).json({ error: "User not found" });
         return
      }
  
      res.status(200).json({ followers: user.followers });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  
  export const getFollowing = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("following", "name email");
  
      if (!user) {
         res.status(404).json({ error: "User not found" });
         return
      }
  
      res.status(200).json({ following: user.following });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  
