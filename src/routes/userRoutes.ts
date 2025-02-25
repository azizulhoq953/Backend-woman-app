import express from "express";
import { getUserProfile, updateProfile } from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
