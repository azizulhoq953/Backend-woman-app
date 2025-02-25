import express from "express";
import { signup, login } from "../controllers/authController";
import { getUserProfile, updateProfile } from "../controllers/userController";
import { createPost, approvePost } from "../controllers/postController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/post", authMiddleware, createPost);
router.put("/post/approve/:id", authMiddleware, approvePost);


router.put("/menstrual-cycle", authMiddleware, updateMenstrualCycle);
router.get("/menstrual-cycle", authMiddleware, getNextMenstrualDate);

export default router;

