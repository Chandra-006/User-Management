const { body, validationResult } = require("express-validator");

// Validation rules for registration
exports.registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only alphabets and spaces"),
  
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  
  body("phone")
    .trim()
    .matches(/^\d{10,15}$/)
    .withMessage("Phone must be 10-15 digits"),
  
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  
  body("address")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Address must not exceed 150 characters"),
  
  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),
  
  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  
  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
  
  body("pincode")
    .optional()
    .trim()
    .matches(/^\d{4,10}$/)
    .withMessage("Pincode must be 4-10 digits"),
];

// Validation rules for login
exports.loginValidation = [
  body("identifier")
    .trim()
    .notEmpty()
    .withMessage("Email or phone is required"),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Validation rules for user update
exports.updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only alphabets and spaces"),
  
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  
  body("phone")
    .optional()
    .trim()
    .matches(/^\d{10,15}$/)
    .withMessage("Phone must be 10-15 digits"),
  
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  
  body("address")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Address must not exceed 150 characters"),
  
  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty"),
  
  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),
  
  body("country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country cannot be empty"),
  
  body("pincode")
    .optional()
    .trim()
    .matches(/^\d{4,10}$/)
    .withMessage("Pincode must be 4-10 digits"),
];

// Middleware to handle validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      message: firstError.msg || "Validation error",
      errors: errors.array()
    });
  }
  next();
};

