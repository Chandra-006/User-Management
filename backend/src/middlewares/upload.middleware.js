/**
 * File Upload Middleware (Multer Configuration)
 * Handles multipart/form-data file uploads for profile images
 * 
 * This middleware:
 * - Validates file types (only JPG/PNG images)
 * - Limits file size (max 2MB)
 * - Generates unique filenames to prevent conflicts
 * - Saves files to uploads/ directory
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload directory path
// Path resolves to: backend/uploads/ (relative to this file)
const uploadPath = path.join(__dirname, "../../uploads");

// Create uploads directory if it doesn't exist
// This ensures the directory exists before attempting to save files
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

/**
 * Disk Storage Configuration
 * Configures where and how files are stored on disk
 */
const storage = multer.diskStorage({
  // Destination function - determines where to save the file
  destination: (req, file, cb) => {
    // Save all files to uploads/ directory
    cb(null, uploadPath);
  },
  
  // Filename function - determines the name of the saved file
  filename: (req, file, cb) => {
    // Generate unique filename using timestamp + random number
    // Format: <timestamp>-<random_number>.<original_extension>
    // Example: 1234567890-987654321.jpg
    // This prevents filename conflicts and overwrites
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    
    // Preserve original file extension (e.g., .jpg, .png)
    cb(null, name + path.extname(file.originalname));
  },
});

/**
 * File Filter Function
 * Validates file types before accepting upload
 * 
 * @param {Object} req - Express request object
 * @param {Object} file - File object with mimetype, originalname, etc.
 * @param {Function} cb - Callback function (error, accept)
 */
const fileFilter = (req, file, cb) => {
  // List of allowed MIME types (image formats)
  const allowed = ["image/png", "image/jpeg", "image/jpg"];
  
  // Check if uploaded file's MIME type is in allowed list
  if (!allowed.includes(file.mimetype)) {
    // Reject file with error message
    return cb(new Error("Invalid file type"), false);
  }
  
  // Accept file
  cb(null, true);
};

/**
 * Multer Middleware Export
 * Configured with:
 * - Disk storage (saves to uploads/ directory)
 * - File type filter (only images)
 * - File size limit (2MB maximum)
 * 
 * Usage: upload.single("profile_image") in route handler
 */
module.exports = multer({
  storage,                    // Use disk storage configuration
  fileFilter,                 // Apply file type validation
  limits: { 
    fileSize: 2 * 1024 * 1024  // Maximum file size: 2MB (2 * 1024 * 1024 bytes)
  },
});
