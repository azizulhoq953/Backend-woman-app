
import express from "express";
import { authMiddleware, adminMiddleware, authenticateAdmin } from "../middlewares/auth.middleware";
import { register, login, getProfile} from "../controllers/authController";
import {getFollowing, getFollowers, followUser} from "../controllers/follower.controllers";
import { getUsers, getCommunityPosts, getOrders, createCategory,  createAdmin, loginAdmin, addProductHandler, getAllProducts, getProductById, getAllCategories, getCategoryById, getAdmin, changeAdminPassword, getAllOrders  } from "../controllers/adminController";
import { addComment, createPost, followPost, getAllPosts, getComments, getPostFollowers, getPostsByCategory, getSavedPosts, savePost, searchPostsByCategory, toggleLikePost } from "../controllers/post.controller";
import { addToCart, getCart } from "../controllers/addtocart";
import { placeOrder } from "../controllers/order.controller";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt from "jsonwebtoken";
import { getPartnerProfile, getUserByPartnerId } from "../controllers/partnerController";
import multer from "multer";


const uploadProfileImage = multer({ dest: 'uploads/profileImages/' });
const uploadProductImages = multer({ dest: 'uploads/PostImage/' });
const uploadPostImage = multer({ dest: 'uploads//' });
// import { getNotifications, updateProfile } from "../controllers/notification";
import { forgetPassword, resetPassword, verifyOtp } from "../controllers/forget";
import uploadImages, { uploadSingleImage } from "../multer/multer";
import { createMenstrualHealth, updateMenstrualHealth } from "../controllers/question.controller";
import { getNotifications } from "../controllers/notification";
import { addCounselor, deleteCounselor, getAllCounselors, getCounselorById, loginCounselor, updateCounselor, updateCounselorPassword } from "../controllers/counseller";
import { createMentalHealthPost, getMentalHealthPosts, getMentalHealthPostById,  updateMentalHealthPost } from "../controllers/mentalhelta";
import { PostAdmin, GetAllPostsAdmin} from "../controllers/admin.post.controller";

// import { createPost, getPostsByCategory } from "../controllers/postController";
// import { addToCart, placeOrder } from "../controllers/orderController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Auth Routes
router.post("/register", register);
router.post("/login", login);


// User Routes
router.get("/users/getProfile", authMiddleware,getProfile);
router.post("/orders", authMiddleware, addToCart);
router.get("/users/order",authMiddleware,getCart)
router.get("/admin/all-orders",authenticateAdmin,getAllOrders)
router.get("/admin/mental",upload.single('image'), getMentalHealthPosts);
router.get("/admin/:id", authMiddleware,upload.single('image'), getMentalHealthPostById);
// router.post("/order", authMiddleware, placeOrder);
// router.put("/users/updateprofile", authMiddleware, uploadProfileImage.single('profileImage'), updateProfile)

//post
// router.post("/post", authMiddleware, uploadProductImages.array('image',10),createPost );
router.post('/post', authMiddleware, uploadSingleImage, createPost);
router.post("/post/follow/:postId", followPost );
router.post("/post/saved/:postId", authMiddleware,savePost)
router.get("/post/followers/:postId",getPostFollowers);
router.get("/post", getAllPosts)
router.get("/post/search", searchPostsByCategory)
router.get("/post/saved", authMiddleware,getSavedPosts)
router.get("/posts/category/:category", getPostsByCategory);


///like comments
router.put("/like/:postId", authMiddleware, toggleLikePost);
router.post("/comment/:postId", authMiddleware, addComment);

// Get all comments
router.get("/:postId/comments", getComments);

//forget password
router.post("/forget-password", forgetPassword); // Step 1: Request OTP
router.post("/verify-otp", verifyOtp);           // Step 2: Verify OTP
router.post("/reset-password", resetPassword);   // Step 3: Reset password

// // Admin Routes
router.get("/admin/users", authMiddleware, adminMiddleware, getUsers);
router.get("/admin/posts", authMiddleware, adminMiddleware, getCommunityPosts);
router.get("/admin/orders", authMiddleware, adminMiddleware, getOrders);
router.get("/admin/post/get",GetAllPostsAdmin)
router.post("/admin/category", createCategory);
router.post("/admin/create",createAdmin)
router.post("/admin/login", loginAdmin); 
router.post("/admin/mental",  authMiddleware, upload.single('image'),createMentalHealthPost); 
router.post("/admin/post",authMiddleware,upload.single('image'), PostAdmin);
router.post("/admin/post", authMiddleware,upload.single('image'), updateMentalHealthPost);
// router.get("/admin/apost", authMiddleware,upload.single('image'), GetAllPostsAdmin);



router.get("/get",authenticateAdmin, getAdmin)
router.post("/admin/change-password",authenticateAdmin, changeAdminPassword)
//products

router.post("/admin/addProduct", authMiddleware, uploadProductImages.array('image', 10), addProductHandler);
router.get("/allproducts", authMiddleware, getAllProducts);
router.get("/products/:id", authMiddleware, getProductById);
router.get("/allcategory", authMiddleware, getAllCategories);
router.get("/category/:id", authMiddleware, getCategoryById);


//Notification
router.get("/notifications",authMiddleware, getNotifications);

//question
router.post("/question",authMiddleware,createMenstrualHealth)
router.put("/question",authMiddleware,updateMenstrualHealth)

//PartnerROute
router.get("/partner/:partnerId", getUserByPartnerId); // ✅ Get User by Partner ID; // ✅ Get User's Partner ID
router.get("/partner/profile/:userId", getPartnerProfile); 

//followers users

router.post("/users/follow/:userId", followUser); 
router.get("/users/followers/:userId", getFollowers); 
router.get("/users/following/:userId", getFollowing); 




// Routes counseller
router.post("/admin/add", upload.single("image"), authenticateAdmin,addCounselor); // Admin adds counselor
router.post("/counseller/login", loginCounselor)
router.get("/all", getAllCounselors); // Get all counselors
router.get("/:id", getCounselorById); // Get counselor by ID
router.delete("/:id", deleteCounselor); // Admin deletes counselor
router.put("/update/:id",authMiddleware, updateCounselor); // Admin deletes counselor
router.put("/password/:id", updateCounselorPassword); // Admin deletes counselor


export default router;
