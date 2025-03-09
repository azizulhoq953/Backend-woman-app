// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create the "uploads" directory if it doesn't exist
// const uploadFolder = "uploads";
// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder);
// }

// // Multer configuration for storing profile images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadFolder); // Store files in the "uploads" folder
//   },
//   filename: (req, file, cb) => {
//     // Create a unique filename using the current timestamp and a random number
//     const fileExtension = path.extname(file.originalname); // Get file extension
//     const fileName = `profile-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
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
// const uploadProfileImage = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
//   fileFilter,
// });

// // Multer setup for multiple product images
// const uploadProductImages = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB per image
//   fileFilter,
// }).array('images[]');  // 'images[]' must match the field name in Postman

// export { uploadProfileImage, uploadProductImages };
import multer from "multer";
import path from "path";
import fs from "fs";

// Create the "uploads" directory if it doesn't exist
const uploadFolder = "uploads";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer configuration for storing profile and product images
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

// Initialize Multer with configuration
const uploadProductImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
  fileFilter,
}).fields([
  { name: 'profileImage', maxCount: 1 }, // Profile image field (optional)
  { name: 'productImages', maxCount: 10 }, // Product images field (can accept multiple images)
  { name: 'PostImage', maxCount: 10 }, // Post images field (can accept multiple images)
]);

export default uploadProductImages;


