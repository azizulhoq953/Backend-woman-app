import { Request, Response } from 'express';
import Mental  from '../models/mentalhealthPost';  // Adjust path according to your project structure
import { AuthenticatedRequest } from '../types/types'; // Define the AuthenticatedRequest type accordingly
import  Category, { ICategory }  from '../models/category.model'; // Adjust if you're using categories
import  Apost from '../models/admin.Post'; 

import { Types } from 'mongoose';
import path from 'path';
import fs from 'fs';




// export const createMentalHealthPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     const { title, category, description } = req.body;
    
//     // Validate required fields
//     if (!title || !category || !description) {
//       res.status(400).json({ error: "All fields (title, category, description) are required" });
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
//       // Get the file's original path
//       imagePath = req.file.path.replace(/\\/g, '/');
      
//       // Log file information for debugging
//       console.log("File details:", {
//         originalname: req.file.originalname,
//         filename: req.file.filename,
//         mimetype: req.file.mimetype,
//         path: req.file.path
//       });
      
//       // Check if the path already has an extension
//       if (!path.extname(imagePath)) {
//         // Determine extension from mimetype
//         const mimeTypeMap: Record<string, string> = {
//           'image/jpeg': '.jpg',
//           'image/png': '.png',
//           'image/gif': '.gif',
//           'image/webp': '.webp'
//         };
        
//         const extension = mimeTypeMap[req.file.mimetype] || '.jpg';
        
//         // Add extension to the path
//         const newPath = `${imagePath}${extension}`;
        
//         // Rename the actual file on disk
//         fs.renameSync(imagePath, newPath);
        
//         // Update the path
//         imagePath = newPath;
//         console.log("Updated path with extension:", imagePath);
//       }
//     }

//     // Find the category by name
//     const categoryExists = await Category.findOne({ name: category });

//     if (!categoryExists) {
//       res.status(400).json({ error: "Category not found" });
//       return;
//     }

//     // Create the new post using the Mental model
//     const mentalPost = new Mental({
//       userId: new Types.ObjectId(req.user.id),
//       title,
//       category: categoryExists._id,
//       description,
//       image: imagePath,
//       likes: [],
//       comments: [],
//       followers: []
//     });

//     // Save the post to the database
//     await mentalPost.save();

//     // Fetch the post with populated category details
//     const populatedPost = await Mental.findById(mentalPost._id)
//       .populate("category")
//       .populate("userId", "name email");

//     // Construct image URL
//     const baseUrl = `${req.protocol}://${req.get('host')}`;
//     const imageUrl = imagePath ? `${baseUrl}/${imagePath}` : '';

//     if (populatedPost && populatedPost.category) {
//       res.status(201).json({
//         message: "Post created successfully",
//         post: {
//           ...populatedPost.toObject(),
//           categoryName: (populatedPost.category as any).name,
//           imageUrl: imageUrl
//         },
//       });
//     } else {
//       res.status(500).json({ error: "Failed to populate category" });
//     }
//   } catch (error) {
//     console.error("Error in createMentalHealthPost:", error);
//     res.status(500).json({ error: "Server error", details: (error as Error).message });
//   }
// };
// Example backend method (already provided in your code)
export const createMentalHealthPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, category, description } = req.body;
    
    if (!title || !category || !description) {
      res.status(400).json({ error: "All fields (title, category, description) are required" });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // File handling
    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path.replace(/\\/g, '/');
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      res.status(400).json({ error: "Category not found" });
      return;
    }

    const mentalPost = new Mental({
      userId: req.user.id,
      title,
      category: categoryExists._id,  // Ensure the category is linked by _id
      description,
      image: imagePath,
    });

    await mentalPost.save();

    res.status(201).json({ message: "Mental Health Post created successfully", post: mentalPost });
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

    const formattedPosts = mentalHealthPosts.map(post => {
      let imageUrl = '';
      if (post.image) {
        // Ensure the image field contains the correct file name with extension
        imageUrl = `${baseUrl}/uploads/${post.image}`;
      }

      return {
        description: post.description || "No description provided", // Assuming there's a description field
        image: post.image || "", // Image path stored in the database, including extension
        likes: post.likes || [], // Assuming this is an array of likes
        comments: post.comments || [], // Assuming this is an array of comments
        followers: post.followers || [], // Assuming this is an array of followers
        createdAt: post.createdAt || "", // Date when the post was created
        updatedAt: post.updatedAt || "", // Date when the post was last updated
        categoryName: post.category ? post.category.name : "Unknown", // Category name
        imageUrl: imageUrl, // Full image URL constructed, including the file extension
      };
    });

    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error in getMentalHealthPosts:", error);
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

  
  
// Delete mental health post
export const deleteMentalHealthPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    if (!id) {
       res.status(400).json({ error: "Post ID is missing" });
       return
    }

    // Find the post by ID and delete it
    const deletedPost = await Mental.findByIdAndDelete(id);

    if (!deletedPost) {
       res.status(404).json({ error: "Mental health post not found" });
       return
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
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