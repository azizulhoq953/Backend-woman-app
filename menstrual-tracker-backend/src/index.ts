import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import router from "./routes";
import path from "path";

dotenv.config();
connectDB();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json()); // Add this to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));