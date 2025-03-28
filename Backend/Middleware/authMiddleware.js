const jwt = require("jsonwebtoken");
let User = require("../Models/User.js");

// Middleware to protect routes
const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided!" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - User not found!" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - accessToken has expired!" });
      }
      console.log("Error in token verification", error.message);
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid access token!" });
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token!" });
  }
};

// Middleware to check if user is an admin
const adminRoute = (req, res, next) => {
  if (req.user && req.user.Role === "Admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Forbidden - Only admins can access this route!" });
  }
};

module.exports = { protectRoute, adminRoute };
