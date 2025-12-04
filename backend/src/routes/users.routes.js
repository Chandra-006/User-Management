const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const { getUsers, getUserById, updateUser, deleteUser } = require("../controllers/user.controller");
const { updateUserValidation, validate } = require("../middlewares/validation.middleware");

// wrapper for multer to avoid Express v5 crash when multer throws synchronously
const uploadSingle = (field) => (req, res, next) => {
  upload.single(field)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

// GET ALL (admin)
router.get("/", authMiddleware, adminMiddleware, getUsers);

// GET by id (auth can view; admin or the user themselves allowed by frontend; backend returns the user if authenticated)
router.get("/:id", authMiddleware, getUserById);

// UPDATE (admin)
router.put("/:id", 
  authMiddleware, 
  adminMiddleware, 
  uploadSingle("profile_image"), 
  updateUserValidation,
  validate,
  updateUser
);

// DELETE (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
