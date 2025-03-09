
import express from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware";
import { register, login, getProfile } from "../controllers/authController";
import { getUsers, getCommunityPosts, getOrders, createCategory, addProduct, createAdmin, loginAdmin } from "../controllers/adminController";
import { createPost, getPostsByCategory } from "../controllers/post.controller";
import { addToCart } from "../controllers/addtocart";
import { placeOrder } from "../controllers/order.controller";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt from "jsonwebtoken";
import { getPartnerProfile, getUserByPartnerId } from "../controllers/partnerController";
import uploadProfileImage  from "../multer/multer";
import { getNotifications, updateProfile } from "../controllers/notification";
import { forgetPassword, resetPassword, verifyOtp } from "../controllers/forget";
// import { createPost, getPostsByCategory } from "../controllers/postController";
// import { addToCart, placeOrder } from "../controllers/orderController";

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);

// User Routes
router.post("/post", authMiddleware, createPost );

router.get("/posts/category/:category", getPostsByCategory);
router.get("/users/getProfile", authMiddleware,getProfile);
router.post("/cart", authMiddleware, addToCart);
router.post("/order", authMiddleware, placeOrder);
router.put("/users/updateprofile", authMiddleware, uploadProfileImage.single('profileImage'), updateProfile)

//forget password
router.post("/forget-password", forgetPassword); // Step 1: Request OTP
router.post("/verify-otp", verifyOtp);           // Step 2: Verify OTP
router.post("/reset-password", resetPassword);   // Step 3: Reset password

// // Admin Routes
router.get("/admin/users", authMiddleware, adminMiddleware, getUsers);
router.get("/admin/posts", authMiddleware, adminMiddleware, getCommunityPosts);
router.get("/admin/orders", authMiddleware, adminMiddleware, getOrders);
router.post("/admin/category", createCategory);
router.post("/admin/create", createAdmin)
router.post("/admin/login", loginAdmin); 

//Notification
router.get("/notifications", getNotifications);

// router.put("/notifications/:notificationId/read", markAsRead);

//PartnerROute
router.get("/partner/:partnerId", getUserByPartnerId); // ✅ Get User by Partner ID; // ✅ Get User's Partner ID
router.get("/partner/profile/:userId", getPartnerProfile); 

// router.post("/admin/product", authMiddleware, adminMiddleware, addProduct);

export default router;
