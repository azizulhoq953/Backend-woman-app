import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import routes from "./routes";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/api", routes);

app.listen(5000, () => console.log("Server running on port 5000"));
