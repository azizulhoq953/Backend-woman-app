// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db";
// import router from "./routes";
// import path from "path";

// dotenv.config();
// connectDB();

// const app = express();
// const corsOptions = {
//     origin: "http://localhost:3000", // Allow only this origin
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
//     allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//     credentials: true, // Allow cookies to be sent
//   };
// app.use(cors(corsOptions));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(cors());
// app.use(express.json()); // Add this to parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
// app.use(express.json());
// app.use("/api", router);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import router from "./routes";
import path from "path";

dotenv.config();
connectDB();

const app = express();

// CORS middleware
const corsOptions = {
  origin: "http://localhost:3000", // Allow frontend running on port 3000
  methods: ["GET", "POST"], // Allow GET and POST methods
  allowedHeaders: ["Content-Type"], // Allow specific headers
};

app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static file serving (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api", router);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
