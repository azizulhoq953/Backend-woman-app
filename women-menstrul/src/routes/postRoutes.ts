import { Router } from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController';

const PostRoutes = Router();

PostRoutes.post('/', createPost);
PostRoutes.get('/', getPosts);
PostRoutes.get('/:id', getPostById);
PostRoutes.put('/:id', updatePost);
PostRoutes.delete('/:id', deletePost);

export default PostRoutes;