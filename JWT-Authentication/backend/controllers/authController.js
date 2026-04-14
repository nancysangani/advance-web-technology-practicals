const User = require("../models/User");
const generateToken = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/BlacklistToken");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateRegisterInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return "Name, email, and password are required";
  }

  if (!isValidEmail(email)) {
    return "Please provide a valid email address";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  return null;
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required";
  }

  if (!isValidEmail(email)) {
    return "Please provide a valid email address";
  }

  return null;
};

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : email;
  const validationError = validateRegisterInput({
    name: typeof name === "string" ? name.trim() : name,
    email: normalizedEmail,
    password
  });

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error?.name === "ValidationError") {
      const firstValidationError = Object.values(error.errors || {})[0];
      return res.status(400).json({
        message: firstValidationError?.message || "Invalid input data"
      });
    }

    if (error?.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Unable to register user" });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : email;
  const validationError = validateLoginInput({ email: normalizedEmail, password });

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Unable to login" });
  }
};

// Logout (Blacklist)
exports.logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Prevent duplicate entries
    const exists = await BlacklistToken.findOne({ token });

    if (!exists) {
      await BlacklistToken.create({
        token,
        expiresAt: new Date(decoded.exp * 1000)
      });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Unable to logout" });
  }
};
