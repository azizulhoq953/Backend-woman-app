// postController.ts
import { AuthRequest } from "../types/types"; // Import the custom AuthRequest
import { Response } from "express";
import Post from "../models/Post";

export const createPost = async (req: AuthRequest, res: Response) => {
    const post = new Post({ user: req.userId, content: req.body.content });
    await post.save();
    res.json({ message: "Post submitted for approval" });
};

export const approvePost = async (req: AuthRequest, res: Response) => {
    await Post.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ message: "Post approved" });
};
