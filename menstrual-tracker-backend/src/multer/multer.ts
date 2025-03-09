import multer from "multer";
import path from "path";
import fs from "fs";

// Create the "uploads" directory if it doesn't exist
const uploadFolder = "uploads";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer configuration for storing profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Store files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the current timestamp and a random number
    const fileExtension = path.extname(file.originalname); // Get file extension
    const fileName = `profile-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    cb(null, fileName); // Assign the unique filename
  },
});

// File filter to allow only image files
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValid = allowedTypes.test(file.mimetype);
  if (isValid) {
    return cb(null, true);
  } else {
    return cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize Multer with configuration
const uploadProfileImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
  fileFilter,
});

export default uploadProfileImage;
