import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import express from "express";

// Initialize express app (for cookie handling)
const app = express();
app.use(express.json());

// Define loginSchema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

// Define registerSchema
const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("farmer", "consumer").default("user").messages({
    "any.only": "Role must be either 'farmer' or 'consumer'",
  }),
});

export const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    console.log(`User registered: ${newUser.email}`);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  console.log("Request body:", req.body); // Debug incoming data
  const { error } = loginSchema.validate(req.body);
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    console.log("Normalized email:", normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    console.log("User found:", user);

    if (!user) {
      console.log("No user found for email:", normalizedEmail);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    
    console.log(hashedPassword);
    if (!isMatch) {
      console.log(password)
      console.log("Password mismatch for user:", user.email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const tokenExpiry = process.env.JWT_EXPIRY || "1h";
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: tokenExpiry }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log(`User logged in: ${user.email}`);
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  console.log(`User logged out: ${req.user?.email || "unknown"}`);
  res.json({ message: "Logged out successfully" });
};