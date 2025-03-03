const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../Lib/Redis.js");
const cloudinary = require("../Lib/Cloudinary.js");
let user = require("../Models/User.js");
require("dotenv").config();

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Store refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token: ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

// Set cookies
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent XSS attacks, cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attack, cross-site request forgery
    maxAge: 15 * 60 * 1000, //15minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevent XSS attacks, cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attack, cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  });
};

router.route("/register").post(async (req, res) => {
  const { name, username, email, password, image, number } = req.body;
  const userExists = await user.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists!" });
  }
  let cloudinaryResponse = null;
  if (image) {
    cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "Users",
    });
  }
  const saltRounds = Number(process.env.saltRounds);
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    const newUser = new user({
      Name: name,
      Username: username,
      Email: email,
      Password: hash,
      Image: cloudinaryResponse ? cloudinaryResponse.secure_url : null,
      PhoneNumber: number,
    });
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      await newUser.save().then(() => {
        res.status(200).json({
          success: true,
          message: "User registered successfully!",
          User: {
            id: user._id,
            Name: name,
            Username: username,
            Email: email,
            Role: user.Role,
            Phonenumber: number,
            Image: cloudinaryResponse ? cloudinaryResponse.secure_url : null,
          },
        });
      });
    }
  });
  const { accessToken, refreshToken } = generateTokens(user._id);
  await storeRefreshToken(user._id, refreshToken);
  setCookies(res, accessToken, refreshToken);
});

router.route("/login").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    await user.findOne({ Username: username }).then((foundUser) => {
      if (!foundUser) {
        console.error(err);
        return res.status(400).json({ message: "User not found!" });
      } else {
        if (foundUser) {
          bcrypt.compare(password, foundUser.Password, async (err, result) => {
            if (result === true) {
              const { accessToken, refreshToken } = generateTokens(
                foundUser._id
              );
              await storeRefreshToken(foundUser._id, refreshToken);
              setCookies(res, accessToken, refreshToken);
              return res.status(200).json({
                success: true,
                message: "User logged in successfully!",
                User: {
                  id: foundUser._id,
                  Name: foundUser.Name,
                  Username: foundUser.Username,
                  Email: foundUser.Email,
                  Role: foundUser.Role,
                  Phonenumber: foundUser.Phonenumber,
                  Image: foundUser.Image,
                },
              });
            }
          });
        }
      }
    });
  } catch (error) {
    console.error("Error on the Login Controller", error);
    return res.status(500).json({ message: error.message });
  }
});

router.route("/logout").post(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token: ${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Logout Controller", error);
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
});

// Refresh Token Route
router.route("/refresh-token").post(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token: ${decoded.userId}`);
    if (storedToken !== refreshToken) {
      res.status(401).json({ message: "Invalid refresh token!" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true, //prevent XSS attacks, cross site scripting attacks
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", //prevents CSRF attack, cross-site request forgery
      maxAge: 15 * 60 * 1000, //15minutes
    });

    res.json({ message: "Token refreshed successfully!" });
  } catch (error) {
    console.log("Error in Login Controller", error);
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
});

module.exports = router;