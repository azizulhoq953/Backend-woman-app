
import express from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware";
import { register, login } from "../controllers/authController";
import { getUsers, getCommunityPosts, getOrders, createCategory, addProduct, createAdmin, loginAdmin } from "../controllers/adminController";
import { createPost, getPostsByCategory } from "../controllers/post.controller";
import { addToCart } from "../controllers/addtocart";
import { placeOrder } from "../controllers/order.controller";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt from "jsonwebtoken";
// import { createPost, getPostsByCategory } from "../controllers/postController";
// import { addToCart, placeOrder } from "../controllers/orderController";

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);

// User Routes
router.post("/post", authMiddleware, createPost );
// const data = {}; // Define the data object
// axios.post('/api/post', data, {
//     headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`  // Assuming the token is stored in localStorage
//     }
// });

router.get("/posts/category/:category", getPostsByCategory);
router.post("/cart", authMiddleware, addToCart);
router.post("/order", authMiddleware, placeOrder);

// // Admin Routes
router.get("/admin/users", authMiddleware, adminMiddleware, getUsers);
router.get("/admin/posts", authMiddleware, adminMiddleware, getCommunityPosts);
router.get("/admin/orders", authMiddleware, adminMiddleware, getOrders);
router.post("/admin/category", createCategory);
router.post("/create/admin", createAdmin)
router.post("/admin/login", loginAdmin); 

// router.post("/admin/product", authMiddleware, adminMiddleware, addProduct);

export default router;
