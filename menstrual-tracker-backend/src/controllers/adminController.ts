import { Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";
import Order from "../models/Order";
import Category from "../models/category.model";
import Product from "../models/Product";
import Admin from "../models/admin.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import multer from "multer";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../types/types";
const uploadProductImages = multer({ dest: 'uploads/' });
// Hash password using bcrypt

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const getCommunityPosts = async (req: Request, res: Response) => {
  const posts = await Post.find().sort({ likes: -1 });
  res.json(posts);
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find().populate("userId").populate("products.productId");
  res.json(orders);
};


// export const createCategory = async (req: Request, res: Response): Promise<void> => {
//   try {
//       const { name } = req.body;

//       if (!name) {
//           res.status(400).json({ error: "Category name is required" });
//           return; // Stop further execution
//       }

//       const existingCategory = await Category.findOne({ name });

//       if (existingCategory) {
//           res.status(400).json({ error: "Category already exists" });
//           return;
//       }

//       const category = new Category({ name });
//       await category.save();

//       res.status(201).json({ message: "Category created successfully", category });
//   } catch (error) {
//       res.status(500).json({ error: "Server error" });
//   }
// };


// Create Category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Category name is required" });
      return; // Stop further execution
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      res.status(400).json({ error: "Category already exists" });
      return;
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


export const addProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, description, price } = req.body;
    const images = req.files as Express.Multer.File[];

    // Validate all fields are provided
    if (!name || !category || !description || !price || !images || images.length === 0) {
       res.status(400).json({ error: "All fields are required" });
       return
    }

    // Process images to get their URLs
    const imageUrls = images.map(image => path.join('uploads', image.filename));

    // Create new product
    const product = new Product({
      name,
      category,
      description,
      price,
      images: imageUrls,
    });

    await product.save(); // Save the product to the database

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
           res.status(400).json({ error: "All fields are required" });
           return
      }

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
           res.status(400).json({ error: "Admin already exists" });
           return
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({ name, email, password: hashedPassword });
      await newAdmin.save();

      // Create JWT token
      const token = jwt.sign({ id: newAdmin._id, role: "admin" }, process.env.JWT_SECRET as string, {
          expiresIn: "7d",
      });

      res.status(201).json({ message: "Admin created successfully", token });
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
};


export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
      const { email, password } = req.body;

      // Validate email and password
      if (!email || !password) {
           res.status(400).json({ error: "Email and password are required" });
           return
      }

      // Check if the admin exists
      const admin = await Admin.findOne({ email });
      if (!admin) {
           res.status(401).json({ error: "Invalid credentials" });
           return
      }

      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
           res.status(401).json({ error: "Invalid credentials" });
           return
      }

      // Generate a JWT token for the admin
      const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET as string, {
          expiresIn: "7d",
      });

      res.json({ token });
  } catch (err) {
      res.status(500).json({ error: "Server error" });
  }
};

export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized access" });
      return;
    }

    const admin = await Admin.findById(req.user.id).select("-password"); // Exclude password

    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};





export const changeAdminPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized access" });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: "New password and confirm password do not match" });
      return;
    }

    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    res.status(200).json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().populate("category"); // Populate category details
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


//get all order

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
      // ✅ Fetch all orders with user and product details
      const orders = await Order.find()
          .populate("userId", "name email phone note") // Get user details
          .populate("products.productId", "name price image"); // Get product details

      if (!orders || orders.length === 0) {
          res.status(404).json({ error: "No orders found" });
          return;
      }

      res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Server error", details: error});
  }
};
