import { Request, Response } from "express";
import Post from "../models/Post";
import { Types } from "mongoose"; // Import Types for ObjectId
import Category from "../models/category.model"; // Ensure correct import path
import User from "../models/User";

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}


// export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
      
//       // Find the category by ID or name
//       const categoryExists = await Category.findOne({ 
//         $or: [
//           { _id: Types.ObjectId.isValid(category) ? category : null },
//           { name: category }
//         ]
//       });
      
//       if (!categoryExists) {
//         res.status(400).json({ error: "Category not found" });
//         return;
//       }
      
//       // Create the new post
//       const post = new Post({
//         userId: new Types.ObjectId(req.user.id),
//         title,
//         category: categoryExists._id,
//         description,
//         image: imagePath,
//         likes: [],
//         comments: [],
//         followers: []
//       });
      
//       // Save the post to the database
//       await post.save();
      
//       // Fetch the post with populated category details
//       const populatedPost = await Post.findById(post._id).populate("category");
      
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

export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
      
      // Find the category by ID or name
      const categoryExists = await Category.findOne({ 
        $or: [
          { _id: Types.ObjectId.isValid(category) ? category : null },
          { name: category }
        ]
      });
      
      if (!categoryExists) {
        res.status(400).json({ error: "Category not found" });
        return;
      }
      
      // Create the new post
      const post = new Post({
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
      await post.save();
      
      // Fetch the post with populated category details
      const populatedPost = await Post.findById(post._id).populate("category");
      
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

export const toggleLikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id; // Authenticated user ID

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        // Ensure likes is an array of ObjectId's
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        const userObjectId = new Types.ObjectId(userId);

        // Convert likes to strings for comparison
        const likedIndex = post.likes.findIndex(id => id.toString() === userObjectId.toString());

        if (likedIndex === -1) {
            post.likes.push(userObjectId); // Add like
        } else {
            post.likes.splice(likedIndex, 1); // Remove like
        }

        await post.save();
        res.status(200).json({ message: "Like status updated", likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
};


export const addComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const { commentText } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!commentText) {
            res.status(400).json({ error: "Comment text is required" });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        // Ensure comments is an array
        if (!Array.isArray(post.comments)) {
            post.comments = [];
        }

        // Create a new comment object with userId and commentText
        const newComment = {
            userId: new Types.ObjectId(userId), // Ensure userId is ObjectId
            commentText: commentText.toString(), // Ensure it's a string
        };

        post.comments.push(newComment); // Add comment to the array
        await post.save();

        res.status(201).json({ message: "Comment added", comments: post.comments });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
};



export const getComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate("comments.userId", "username"); // Populate user details
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        res.status(200).json({ comments: post.comments });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


// Get Posts by Category
export const getPostsByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const posts = await Post.find({ category }).sort({ likes: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const getCommunityPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().sort({ likes: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

//get all post
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("userId", "name email") // Populating userId with specific fields (name, email)
            .populate("likes", "name email") // Populating likes with specific fields (name, email)
            .populate("category", "name"); // Populating category with the name field

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
};



// export const searchPosts = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { query } = req.query;
//         if (!query) {
//             res.status(400).json({ error: "Search query is required" });
//             return;
//         }
//         const posts = await Post.find({
//             $or: [
//                 { title: { $regex: query, $options: "i" } },
//                 { description: { $regex: query, $options: "i" } }
//             ]
//         }).sort({ createdAt: -1 });
//         res.json(posts);
//     } catch (error) {
//         res.status(500).json({ error: "Server error", details: (error as Error).message });
//     }
// };

export const searchPostsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.query;
      
      if (!category) {
        res.status(400).json({ error: "Category is required for search" });
        return;
      }
      
      // Find posts by category (category name or ID)
      const categoryExists = await Category.findOne({ 
        $or: [
          { _id: Types.ObjectId.isValid(category as string) ? category : null },
          { name: category }
        ]
      });
  
      if (!categoryExists) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
  
      // Find posts within the selected category
      const posts = await Post.find({ category: categoryExists._id }).populate("category");
      
      if (posts.length > 0) {
        res.status(200).json({
          message: "Posts fetched successfully",
          posts: posts.map(post => ({
            ...post.toObject(),
            categoryName: (post.category as any).name,
            imageUrl: post.image ? `${req.protocol}://${req.get('host')}/${post.image}` : ''
          })),
        });
      } else {
        res.status(404).json({ error: "No posts found in this category" });
      }
      
    } catch (error) {
      res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
  };

export const savePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        const savedIndex = user.savedPosts.findIndex(id => id.toString() === postId);

        if (savedIndex === -1) {
            user.savedPosts.push(new Types.ObjectId(postId));
        } else {
            user.savedPosts.splice(savedIndex, 1);
        }
        await user.save();

        res.status(200).json({ message: "Post saved status updated", savedPosts: user.savedPosts });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
};

export const getSavedPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;  // Getting userId from authenticated request

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Find the user by ID
        const user = await User.findById(userId).populate('savedPosts');
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Get the saved posts by populating the savedPosts field
        const savedPosts = user.savedPosts;

        // If no saved posts found
        if (savedPosts.length === 0) {
            res.status(200).json({ message: "No saved posts", savedPosts: [] });
            return;
        }

        res.status(200).json({ savedPosts });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
};

// Follow Post
export const followPost = async (req: Request, res: Response): Promise<void> =>{
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        if (!Array.isArray(post.followers)) {
            post.followers = [];
        }

        const userObjectId = new Types.ObjectId(userId);
        const followIndex = post.followers.findIndex(id => id.toString() === userObjectId.toString());

        if (followIndex === -1) {
            post.followers.push(userObjectId);
        } else {
            post.followers.splice(followIndex, 1);
        }
        await post.save();

        res.status(200).json({ message: "Follow status updated", followers: post.followers.length });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: (error as Error).message });
    }
};

export const getPostFollowers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate("followers", "name email"); // Populating followers
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        res.status(200).json({ followers: post.followers });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
