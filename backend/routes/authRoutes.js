const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

// Rate limiter for forgot password
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests, try again later.",
});

// Signup/Login
router.post("/signup/student", authController.signupStudent);
router.post("/signup/employer", authController.signupEmployer);
router.post("/login/student", authController.loginStudent);
router.post("/login/employer", authController.loginEmployer);

// Forgot/Reset Password
router.post("/forgot/student", forgotPasswordLimiter, authController.forgotPasswordStudent);
router.post("/forgot/employer", forgotPasswordLimiter, authController.forgotPasswordEmployer);
router.post("/reset-password", authController.resetPassword);


module.exports = router;
