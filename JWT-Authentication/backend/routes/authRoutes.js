const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);

// Protected
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

router.post("/logout", protect, logoutUser);

module.exports = router;
