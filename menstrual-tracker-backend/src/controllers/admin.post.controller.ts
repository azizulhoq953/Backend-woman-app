// import { Request, Response } from 'express';
// import { AuthenticatedRequest } from '../types/types'; // Define the AuthenticatedRequest type accordingly
// import  Apost from '../models/admin.Post'; 

// import { Types } from 'mongoose';

// export const PostAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//     try {
//       const { title, category, description } = req.body;
      
//       // Validate required fields
//       if (!title || !category || !description) {
//         res.status(400).json({ error: "All fields (title, category, description) are required" });
//         return;
//       }
  
//       // Check if the user is authorized
//       if (!req.user) {
//         res.status(401).json({ error: "Unauthorized" });
//         return;
//       }
  
//       // Handle file upload - get the file path if an image was uploaded
//       let imagePath = '';
//       if (req.file) {
//         imagePath = req.file.path;
//       }
  
//       // Find the category by name
//       const categoryExists = await category.findOne({ name: category });
  
//       if (!categoryExists) {
//         res.status(400).json({ error: "Category not found" });
//         return;
//       }
  
//       // Create the new post
//       const AdminPost = new Apost({
//         userId: new Types.ObjectId(req.user.id),
//         title,
//         category: categoryExists._id,  // Use category's _id
//         description,
//         image: imagePath,
//         likes: [],
//         comments: [],
//         followers: []
//       });
  
//       // Save the post to the database
//       await AdminPost.save();
  
//       // Fetch the post with populated category details
//       const populatedPost = await Apost.findById(AdminPost._id).populate("category");
  
//       // Construct image URL
//       const baseUrl = `${req.protocol}://${req.get('host')}`;
//       const imageUrl = imagePath ? `${baseUrl}/${imagePath}` : '';
  
//       if (populatedPost && populatedPost.category) {
//         res.status(201).json({
//           message: "Post created successfully",
//           post: {
//             ...populatedPost.toObject(),
//             categoryName: (populatedPost.category as any).name,
//             imageUrl: imageUrl
//           },
//         });
//       } else {
//         res.status(500).json({ error: "Failed to populate category" });
//       }
//     } catch (error) {
//       res.status(500).json({ error: "Server error", details: (error as Error).message });
//     }
//   };


//   export const GetAllPostsAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//     try {
//       // Ensure user is authenticated
//       if (!req.user) {
//         res.status(401).json({ error: "Unauthorized" });
//         return;
//       }
  
//       // Pagination parameters
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const skip = (page - 1) * limit;
  
//       // Filter parameters
//       const categoryFilter = req.query.category ? { 'category': req.query.category } : {};
//       const titleFilter = req.query.title 
//         ? { 'title': { $regex: req.query.title as string, $options: 'i' } }
//         : {};
  
//       // Combine filters
//       const filters = {
//         ...categoryFilter,
//         ...titleFilter,
//         // Filter by the authenticated user's ID
//         userId: req.user.id
//       };
  
//       // Get total count for pagination
//       const totalPosts = await Apost.countDocuments(filters);
//       const totalPages = Math.ceil(totalPosts / limit);
  
//       // Fetch posts with pagination, sorting, and population
//       const posts = await Apost.find(filters)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate('category')
//         .populate('userId', 'username profilePicture');
  
//       // Construct proper URLs for images
//       const baseUrl = `${req.protocol}://${req.get('host')}`;
//       const formattedPosts = posts.map(post => {
//         const postObj = post.toObject();
        
//         return {
//           ...postObj,
//           categoryName: (post.category as any)?.name || '',
//           imageUrl: post.image ? `${baseUrl}/${post.image}` : '',
//         };
//       });
  
//       res.status(200).json({
//         posts: formattedPosts,
//         pagination: {
//           totalPosts,
//           totalPages,
//           currentPage: page,
//           limit
//         }
//       });
//     } catch (error) {
//       res.status(500).json({ 
//         error: "Failed to fetch posts", 
//         details: (error as Error).message 
//       });
//     }
//   };

import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/types';
import Apost from '../models/admin.Post'; 
import Category from '../models/category.model'; // Import the correct Category model
import { Types } from 'mongoose';

export const PostAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { title, category, description } = req.body;
      
      // Validate required fields
      if (!title || !category || !description) {
        res.status(400).json({ error: "All fields (title, category, description) are required" });
        return;
      }
  
      // Check if the user is authorized
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
  
      // Handle file upload - get the file path if an image was uploaded
      let imagePath = '';
      if (req.file) {
        imagePath = req.file.path;
      }
  
      // Find the category by name - FIX: use the Category model
      const categoryExists = await Category.findOne({ name: category });
  
      if (!categoryExists) {
        res.status(400).json({ error: "Category not found" });
        return;
      }
  
      // Create the new post
      const AdminPost = new Apost({
        userId: new Types.ObjectId(req.user.id),
        title,
        category: categoryExists._id,  // Use category's _id
        description,
        image: imagePath,
        likes: [],
        comments: [],
        followers: []
      });
  
      // Save the post to the database
      await AdminPost.save();
  
      // Fetch the post with populated category details
      const populatedPost = await Apost.findById(AdminPost._id).populate("category");
  
      // Construct image URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imageUrl = imagePath ? `${baseUrl}/${imagePath}` : '';
  
      if (populatedPost && populatedPost.category) {
        res.status(201).json({
          message: "Post created successfully",
          post: {
            ...populatedPost.toObject(),
            categoryName: (populatedPost.category as any).name,
            imageUrl: imageUrl
          },
        });
      } else {
        res.status(500).json({ error: "Failed to populate category" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
};

export const GetAllPostsAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter parameters
    const categoryFilter = req.query.category ? { 'category': req.query.category } : {};
    const titleFilter = req.query.title 
      ? { 'title': { $regex: req.query.title as string, $options: 'i' } }
      : {};

    // Combine filters
    const filters = {
      ...categoryFilter,
      ...titleFilter,
      // Filter by the authenticated user's ID
      userId: req.user.id
    };

    // Get total count for pagination
    const totalPosts = await Apost.countDocuments(filters);
    const totalPages = Math.ceil(totalPosts / limit);

    // Fetch posts with pagination, sorting, and population
    const posts = await Apost.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category')
      .populate('userId', 'username profilePicture');

    // Construct proper URLs for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const formattedPosts = posts.map(post => {
      const postObj = post.toObject();
      
      return {
        ...postObj,
        categoryName: (post.category as any)?.name || '',
        imageUrl: post.image ? `${baseUrl}/${post.image}` : '',
      };
    });

    res.status(200).json({
      posts: formattedPosts,
      pagination: {
        totalPosts,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch posts", 
      details: (error as Error).message 
    });
  }
};