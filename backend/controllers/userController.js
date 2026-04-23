import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper for JWT generation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Reduced for security in 2026
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic Validation (Crucial before DB hits)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id), // Send token on registration for better UX
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("🔥 Registration Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: "Successfully logged in",
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email },
      });
    } else {
      // Generic error to prevent account enumeration
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// GET PROFILE
export const getProfile = async (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
