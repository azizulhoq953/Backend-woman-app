import { Request, response, Response } from "express";
import Post from "../models/Post";
import { request } from "http";

// Extend Request type to include `user`
interface AuthenticatedRequest extends Request {
    user?: { id: string };
}


// Create Post
export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { title, category, description, image } = req.body;

        if (!title || !category || !description) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const post = new Post({
            userId: req.user.id,
            title,
            category,
            description,
            image,
        });

        await post.save();
        res.status(201).json({ message: "Post created successfully", post });
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
