import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import Counselor from "../models/Counselor";

// ✅ Add Counselor (Admin Only)
export const addCounselor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, phone, specialty, experience, education, bio, availability } = req.body;
      const imageFile = req.file; // Multer handles file uploads
  
      // Validate required fields: name and email
      if (!name || !email) {
        res.status(400).json({ error: "Name and email are required" });
        return;
      }
  
      // Check if the counselor already exists
      const existingCounselor = await Counselor.findOne({ email });
      if (existingCounselor) {
        res.status(400).json({ error: "Counselor already exists" });
        return;
      }
  
      // Hash password if provided
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      // Store image path if an image is uploaded
      const imagePath = imageFile ? path.join("uploads", imageFile.filename) : null;
  
      // Create new counselor
      const counselor = new Counselor({
        name,
        email,
        password: hashedPassword,
        phone,
        specialty,
        experience,
        education,
        bio,
        image: imagePath,
        availability: availability || [],
      });
  
      await counselor.save();
  
      res.status(201).json({ message: "Counselor added successfully", counselor });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
  };
  

// ✅ Get All Counselors
export const getAllCounselors = async (req: Request, res: Response): Promise<void> => {
  try {
    const counselors = await Counselor.find().select("-password"); // Exclude password
    res.status(200).json({ counselors });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: (error as Error).message });
  }
};

// ✅ Get Single Counselor by ID
export const getCounselorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const counselor = await Counselor.findById(id).select("-password");

    if (!counselor) {
      res.status(404).json({ error: "Counselor not found" });
      return;
    }

    res.status(200).json({ counselor });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: (error as Error).message });
  }
};

// ✅ Delete Counselor (Admin Only)
export const deleteCounselor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const counselor = await Counselor.findByIdAndDelete(id);
    if (!counselor) {
      res.status(404).json({ error: "Counselor not found" });
      return;
    }

    res.status(200).json({ message: "Counselor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: (error as Error).message });
  }
};


export const updateCounselor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, email, phone, specialty, experience, education, bio, availability } = req.body;
      const imageFile = req.file; // Multer handles file uploads
  
      // Check if counselor exists
      const counselor = await Counselor.findById(id);
      if (!counselor) {
        res.status(404).json({ error: "Counselor not found" });
        return;
      }
  
      // Update counselor details
      if (name) counselor.name = name;
      if (email) counselor.email = email;
      if (phone) counselor.phone = phone;
      if (specialty) counselor.specialty = specialty;
      if (experience) counselor.experience = experience;
      if (education) counselor.education = education;
      if (bio) counselor.bio = bio;
      if (availability) counselor.availability = availability;
  
      // If a new image is uploaded, update the image path
      if (imageFile) {
        counselor.image = path.join("uploads", imageFile.filename);
      }
  
      await counselor.save();
  
      res.status(200).json({ message: "Counselor updated successfully", counselor });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
  };
  
  export const updateCounselorPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword, confirmPassword } = req.body;
  
      // Validate input
      if (!currentPassword || !newPassword || !confirmPassword) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }
  
      if (newPassword !== confirmPassword) {
        res.status(400).json({ error: "New passwords do not match" });
        return;
      }
  
      // Find counselor by ID
      const counselor = await Counselor.findById(id);
      if (!counselor) {
        res.status(404).json({ error: "Counselor not found" });
        return;
      }
  
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, counselor.password);
      if (!isMatch) {
        res.status(400).json({ error: "Current password is incorrect" });
        return;
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      counselor.password = hashedPassword;
      await counselor.save();
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
  };