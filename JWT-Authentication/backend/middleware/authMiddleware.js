const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistToken = require("../models/BlacklistToken");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      // Check blacklist
      const blacklisted = await BlacklistToken.findOne({ token });
      if (blacklisted) {
        return res.status(401).json({
          message: "Token is invalid (logged out). Please login again."
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, not authorized" });
  }
};

module.exports = protect;
