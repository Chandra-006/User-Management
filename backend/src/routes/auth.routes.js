const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { registerUser, loginUser, refreshToken } = require("../controllers/auth.controller");
const { registerValidation, loginValidation, validate } = require("../middlewares/validation.middleware");

// register (multipart)
router.post("/register", 
  upload.single("profile_image"),
  registerValidation,
  validate,
  registerUser
);

// login
router.post("/login", loginValidation, validate, loginUser);

// refresh token
router.post("/refresh", refreshToken);

module.exports = router;
