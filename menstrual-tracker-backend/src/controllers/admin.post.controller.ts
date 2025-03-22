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
import Category, { ICategory } from '../models/category.model'; // Import the correct Category model
import { Types } from 'mongoose';


// export const PostAdmin = async (req: Request, res: Response): Promise<void> => {
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
//       imagePath = req.file.path;
//     }

//     // Find the category by _id (not by name)
//     const categoryExists = await Category.findById(category); // Use _id to find the category

//     if (!categoryExists) {
//       res.status(400).json({ error: "Category not found" });
//       return;
//     }

//     // Create the new post
//     const AdminPost = new Apost({
//       userId: new Types.ObjectId(req.user.id),
//       title,
//       category: categoryExists._id,  // Use category's _id
//       description,
//       image: imagePath,
//       likes: [],
//       comments: [],
//       followers: []
//     });

//     // Save the post to the database
//     await AdminPost.save();

//     // Fetch the post with populated category details
//     const populatedPost = await Apost.findById(AdminPost._id).populate<{ category: ICategory }>("category");

//     // Check if populatedPost is null
//     if (!populatedPost) {
//       res.status(404).json({ error: "Post not found" });
//       return;
//     }

//     // Construct image URL
//     const baseUrl = `${req.protocol}://${req.get('host')}`;
//     const imageUrl = populatedPost.image ? `${baseUrl}/${populatedPost.image}` : '';

//     res.status(201).json({
//       message: "Post created successfully",
//       post: {
//         ...populatedPost.toObject(),
//         categoryName: populatedPost.category.name,  // Safely access category.name
//         imageUrl: imageUrl
//       },
//     });
//   } catch (error: unknown) {
//     // Handle error safely
//     if (error instanceof Error) {
//       res.status(500).json({ error: "Server error", details: error.message });
//     } else {
//       res.status(500).json({ error: "Server error" });
//     }
//   }
// };


// Original post creation controller (for reference)
export const PostAdmin = async (req: Request, res: Response): Promise<void> => {
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

    // Find the category by _id (not by name)
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      res.status(400).json({ error: "Category not found" });
      return;
    }

    // Create the new post
    const AdminPost = new Apost({
      userId: new Types.ObjectId(req.user.id),
      title,
      category: categoryExists._id,
      description,
      image: imagePath,
      likes: [],
      comments: [],
      followers: []
    });

    // Save the post to the database
    await AdminPost.save();

    // Fetch the post with populated category details
    const populatedPost = await Apost.findById(AdminPost._id).populate<{ category: ICategory }>("category");

    // Check if populatedPost is null
    if (!populatedPost) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Construct image URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = populatedPost.image ? `${baseUrl}/${populatedPost.image}` : '';

    res.status(201).json({
      message: "Post created successfully",
      post: {
        ...populatedPost.toObject(),
        categoryName: populatedPost.category.name,
        imageUrl: imageUrl
      },
    });
  } catch (error: unknown) {
    console.error("Create post error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: "Server error", details: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

export const UpdatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Update request method:', req.method);
    console.log('Update request path:', req.path);
    console.log('Update request params:', req.params);
    console.log('Update request body:', req.body);
    console.log('Update request file:', req.file);
    console.log('Update request user:', req.user);

    const postId = req.params.id;
    console.log('Received postId:', postId); // Log received postId

    // Validate that postId exists
    if (!postId) {
      console.log('Missing postId in params');
      res.status(400).json({ error: "Post ID is required" });
      return;
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(postId)) {
      console.log('Invalid ObjectId format:', postId);
      res.status(400).json({ error: "Invalid post ID format" });
      return;
    }

    // Check if the user is authorized
    if (!req.user || !req.user.id) {
      console.log('User not authenticated or missing ID');
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Find the post first to check existence
    let existingPost;
    try {
      existingPost = await Apost.findById(postId);
      console.log('Found post:', existingPost ? 'Yes' : 'No');
    } catch (findError) {
      console.error('Error finding post:', findError);
      res.status(500).json({ error: "Error finding post" });
      return;
    }

    if (!existingPost) {
      console.log(`Post with ID ${postId} not found.`);
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Convert IDs to strings for comparison
    const postUserId = existingPost.userId.toString();
    const requestUserId = req.user.id.toString();

    console.log('Post userId:', postUserId);
    console.log('Request userId:', requestUserId);

    // Verify the user owns this post or is an admin
    if (req.user.role !== "admin" && postUserId !== requestUserId) {
      res.status(403).json({ error: "Forbidden: You don't have permission to update this post" });
      return;
    }

    // Prepare update data
    const updateData: any = {};

    // Only update fields that are provided
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.file) updateData.image = req.file.path;

    console.log('Update Data:', updateData);

    // Make sure we have something to update
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "No update data provided" });
      return;
    }

    // Update the post
    let updatedPost;
    try {
      updatedPost = await Apost.findByIdAndUpdate(
        postId,
        updateData,
        { new: true }
      ).populate<{ category: ICategory }>("category");

      console.log('Post updated:', updatedPost ? 'Yes' : 'No');
    } catch (updateError) {
      console.error('Error updating post:', updateError);
      res.status(500).json({ error: "Error updating post" });
      return;
    }

    if (!updatedPost) {
      console.log(`Post with ID ${postId} could not be updated.`);
      res.status(404).json({ error: "Post could not be updated" });
      return;
    }

    // Construct image URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = updatedPost.image ? `${baseUrl}/${updatedPost.image}` : '';

    res.status(200).json({
      message: "Post updated successfully",
      post: {
        ...updatedPost.toObject(),
        categoryName: updatedPost.category.name,
        imageUrl: imageUrl
      },
    });
  } catch (error: unknown) {
    console.error("Update post error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: "Server error", details: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};


// Delete post controller
export const DeletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract and log all request info for debugging
    console.log('Delete request method:', req.method);
    console.log('Delete request path:', req.path);
    console.log('Delete request params:', req.params);
    console.log('Delete request user:', req.user);

    const postId = req.params.id;

    // Validate that postId exists
    if (!postId) {
      console.log('Missing postId in params');
      res.status(400).json({ error: "Post ID is required" });
      return;
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(postId)) {
      console.log('Invalid ObjectId format:', postId);
      res.status(400).json({ error: "Invalid post ID format" });
      return;
    }

    // Check if the user is authenticated
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Find the post first to check existence
    let existingPost;
    try {
      existingPost = await Apost.findById(postId);
      console.log('Found post:', existingPost ? 'Yes' : 'No');
    } catch (findError) {
      console.error('Error finding post:', findError);
      res.status(500).json({ error: "Error finding post" });
      return;
    }

    if (!existingPost) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Convert IDs to strings for comparison
    const postUserId = existingPost.userId.toString();
    const requestUserId = req.user.id.toString();

    console.log('Post userId:', postUserId);
    console.log('Request userId:', requestUserId);

    // Check if the user is an admin or the post's owner
    if (req.user.role !== "admin" && postUserId !== requestUserId) {
      res.status(403).json({ error: "Forbidden: You don't have permission to delete this post" });
      return;
    }

    // Delete the post
    let deletedPost;
    try {
      deletedPost = await Apost.findByIdAndDelete(postId);
      console.log('Post deleted:', deletedPost ? 'Yes' : 'No');
    } catch (deleteError) {
      console.error('Error deleting post:', deleteError);
      res.status(500).json({ error: "Error deleting post" });
      return;
    }

    if (!deletedPost) {
      res.status(404).json({ error: "Post could not be deleted" });
      return;
    }

    res.status(200).json({
      message: "Post deleted successfully",
      postId: postId
    });
  } catch (error: unknown) {
    console.error("Delete post error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: "Server error", details: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

export const GetAllPostsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
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
      ...titleFilter
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


