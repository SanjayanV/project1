import bcrypt from "bcryptjs";
import admin from "firebase-admin";
import User from "../models/user.model.js";

const serviceAccount = await import("../serviceAccountKey.json", { assert: { type: "json" } });
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.default),
});

export const signup = async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!["farmer", "consumer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'farmer' or 'consumer'" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, role });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }
  if (!["farmer", "consumer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'farmer' or 'consumer'" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (user.role !== role) {
      return res.status(403).json({ error: "Role does not match account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Signin successful", user: { email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const syncGoogleUser = async (req, res) => {
  const { uid, email, name, role } = req.body;

  if (!uid || !email || !name || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!["farmer", "consumer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'farmer' or 'consumer'" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { uid, email, name, role },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Google user synced", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New endpoint to check if user exists
export const checkUserExists = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "UID is required" });
  }

  try {
    const user = await User.findOne({ uid });
    res.status(200).json({ exists: !!user, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};