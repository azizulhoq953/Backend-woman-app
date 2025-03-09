import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let partnerId = Math.random().toString(36).substr(2, 7); // Generate 7-char ID

    // Ensure partnerId is unique
    while (await User.findOne({ partnerId })) {
      partnerId = Math.random().toString(36).substr(2, 7);
    }

    const user = new User({ name, email, password: hashedPassword, partnerId });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.json({email, user ,token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};




// export const updateProfile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Extract the Bearer token from the Authorization header
//     const token = req.headers.authorization?.split(" ")[1];
    
//     // Check if the token exists
//     if (!token) {
//       res.status(401).json({ error: "Token is missing or invalid" });
//       return;
//     }

//     // Decode the token and get the userId from it
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
//     const userId = decoded.id;

//     // If userId is not present in the decoded token
//     if (!userId) {
//       res.status(400).json({ error: "User ID not found in token" });
//       return;
//     }

//     // Extract user details from the request body
//     const { name, email, menstrualLastDay } = req.body;

//     // Prepare the update fields
//     const updateFields: any = {};

//     if (name) updateFields.name = name;
//     if (email) updateFields.email = email;

//     if (menstrualLastDay) {
//       const expectedNextDate = new Date(menstrualLastDay);
//       expectedNextDate.setDate(expectedNextDate.getDate() + 28);
//       updateFields.menstrualLastDay = menstrualLastDay;
//       updateFields.expectedNextDate = expectedNextDate;
//     }

//     // Check if a profile image was uploaded
//     if (req.file) {
//       // Validate the file type (optional, you can adjust this based on your requirements)
//       const allowedTypes = ["image/jpeg", "image/png"];
//       if (!allowedTypes.includes(req.file.mimetype)) {
//         res.status(400).json({ error: "Invalid file type. Only JPEG and PNG are allowed." });
//         return;
//       }

//       // Store the path of the uploaded image
//       updateFields.profileImageUrl = path.join("uploads", req.file.filename);
//     }

//     // Update the user's profile in the database
//     const user = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");

//     // Check if the user was found and updated
//     if (!user) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     // Respond with the updated user profile
//     res.json({
//       message: "Profile updated successfully",
//       user
//     });
//   } catch (err) {
//     // Handle unexpected errors
//     const errorMessage = err instanceof Error ? err.message : "Unknown error";
//     res.status(500).json({ error: "Server error", details: errorMessage });
//   }
// };




// export const getProfile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       res.status(401).json({ error: "Unauthorized: No token provided" });
//       return;
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
//     if (!decoded || !decoded.id) {
//       res.status(401).json({ error: "Unauthorized: Invalid token" });
//       return;
//     }

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };



export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for the presence of the Bearer token in the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Decode the token to get the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    if (!decoded || !decoded.id) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    // Fetch the user profile from the database excluding the password
    const user = await User.findById(decoded.id).select("-password");

    // If the user is not found, return a 404 error
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if the user has a profile image URL and include it in the response
    const profileImageUrl = user.profileImageUrl ? `${req.protocol}://${req.get('host')}/${user.profileImageUrl}` : null;

    // Respond with the user data and profile image URL (if available)
    res.json({
      message: "User profile fetched successfully",
      user: {
        ...user.toObject(), // Spread the user data
        profileImageUrl, // Include profile image URL in the response
      }
    });
  } catch (err) {
    // Handle unexpected errors
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Server error", details: errorMessage });
  }
};

