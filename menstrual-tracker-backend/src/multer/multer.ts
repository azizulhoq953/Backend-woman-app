
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create the "uploads" directory if it doesn't exist
// const uploadFolder = "uploads";
// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder);
// }

// // Multer configuration for storing profile and product images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadFolder); // Store files in the "uploads" folder
//   },
//   filename: (req, file, cb) => {
//     const fileExtension = path.extname(file.originalname); // Get file extension
//     const fileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
//     cb(null, fileName); // Assign the unique filename
//   },
// });

// // File filter to allow only image files
// const fileFilter = (req: any, file: any, cb: any) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const isValid = allowedTypes.test(file.mimetype);
//   if (isValid) {
//     return cb(null, true);
//   } else {
//     return cb(new Error("Only image files are allowed!"), false);
//   }
// };

// // Initialize Multer with configuration
// const uploadProductImages = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
//   fileFilter,
// }).fields([
//   { name: 'image', maxCount: 10 }, // Product images field (can accept multiple images)
  
// ]);

// export default uploadProductImages;



import multer from "multer";
import path from "path";
import fs from "fs";

// Create the "uploads" directory if it doesn't exist
const uploadFolder = "uploads";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer configuration for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Store files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Get file extension
    const fileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
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

// Initialize Multer with configuration for single image upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
  fileFilter,
});

// Export a middleware specifically for single image uploads
export const uploadSingleImage = upload.single('image');

export default upload;