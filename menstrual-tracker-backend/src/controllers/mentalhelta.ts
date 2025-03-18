import { Request, Response } from 'express';
import Mental  from '../models/mentalhealthPost';  // Adjust path according to your project structure
import { AuthenticatedRequest } from '../types/types'; // Define the AuthenticatedRequest type accordingly
import  Category, { ICategory }  from '../models/category.model'; // Adjust if you're using categories
import  Apost from '../models/admin.Post'; 

import { Types } from 'mongoose';

// export const createMentalHealthPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     const { title,category, description } = req.body;
    
//     // Validate required fields
//     if (!title || !category || !description) {
//       res.status(400).json({ error: "All fields (title, description) are required" });
//       return;
//     }
    
//     // Check if the user is authorized
//     if (!req.user) {
//       res.status(401).json({ error: "Unauthorized" });
//       return;
//     }
    
//     // Handle file upload - get the file path if an image was uploaded
//     let imagePath = '';
//     if (req.file) {
//       imagePath = req.file.path;
//     }
    
//     // Create the new mental health post
//     const post = new Post({
//       userId: new Types.ObjectId(req.user.id),
//       title,
//       category,
//       description,
//       image: imagePath,
//       likes: [],
//       comments: [],
//       followers: []
//     });
    
//     // Save the post to the database
//     await post.save();
    
//     // Fetch the post (populating if necessary)
//     const populatedPost = await Post.findById(post._id); // You can populate if you need to
    
//     // Construct image URL
//     const baseUrl = `${req.protocol}://${req.get('host')}`;
//     const imageUrl = imagePath ? `${baseUrl}/${imagePath}` : '';
    
//     if (populatedPost) {
//       res.status(201).json({
//         message: "Mental health post created successfully",
//         post: {
//           ...populatedPost.toObject(),
//           imageUrl: imageUrl
//         },
//       });
//     } else {
//       res.status(500).json({ error: "Failed to fetch post" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error", details: (error as Error).message });
//   }
// };

export const createMentalHealthPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
  
      // Find the category by name
      const categoryExists = await Category.findOne({ name: category });
  
      if (!categoryExists) {
        res.status(400).json({ error: "Category not found" });
        return;
      }
  
      // Create the new post
      const mental = new Mental({
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
      await mental.save();
  
      // Fetch the post with populated category details
      const populatedPost = await Mental.findById(mental._id).populate("category");
  
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

export const getMentalHealthPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch all posts and populate the category field
      const mentalHealthPosts = await Mental.find().populate("category");
  
      if (!mentalHealthPosts || mentalHealthPosts.length === 0) {
        res.status(404).json({ error: "No mental health posts found" });
        return;
      }
  
      // Construct full image URLs
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const formattedPosts = mentalHealthPosts.map(Mental => ({
        ...Mental.toObject(),
        categoryName: (Mental.category as any)?.name || "Unknown", // Handle missing category
        imageUrl: Mental.image ? `${baseUrl}/${Mental.image}` : ''
      }));
  
      res.status(200).json({ posts: formattedPosts });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
  };
  
  

export const getMentalHealthPostById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const mental = await Mental.findById(id).populate("category").populate("userId", "name email");
  
      if (!mental) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
  
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imageUrl = mental.image ? `${baseUrl}/${mental.image}` : null;
  
      res.status(200).json({
        _id: mental._id,
        title: mental.title,
        description: mental.description,
        category: (mental.category as any).name,
        user: mental.userId,
        imageUrl: imageUrl,
        likes: mental.likes.length,
        comments: mental.comments.length,
        followers: mental.followers.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
  };

export const updateMentalHealthPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, category, description } = req.body;
  
      // Validate required fields
      if (!title || !category || !description) {
        res.status(400).json({ error: "All fields (title, category, description) are required" });
        return;
      }
  
      // Find the category by name
      const categoryExists = await Category.findOne({ name: category });
  
      if (!categoryExists) {
        res.status(400).json({ error: "Category not found" });
        return;
      }
  
      // Handle file upload if a new image is provided
      let imagePath = req.file ? req.file.path : undefined;
  
      // Find and update the post
      const updatedPost = await Mental.findByIdAndUpdate(
        id,
        {
          title,
          category: categoryExists._id,  // ✅ Assign the ObjectId instead of a string
          description,
          ...(imagePath && { image: imagePath }),
        },
        { new: true }  // Return the updated document
      )
        .populate<{ category: ICategory }>("category");  // ✅ Type assertion to ensure category is ICategory
  
      if (!updatedPost) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
  
      // Construct image URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imageUrl = updatedPost.image ? `${baseUrl}/${updatedPost.image}` : '';
  
      res.status(200).json({
        message: "Post updated successfully",
        post: {
          ...updatedPost.toObject(),
          categoryName: updatedPost.category.name,  // ✅ Now TypeScript knows it's an ICategory
          imageUrl: imageUrl
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
  };
  
  
  

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
  
      // Find the category by name
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