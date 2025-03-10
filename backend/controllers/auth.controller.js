import bcrypt from "bcryptjs";
import admin from "firebase-admin";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

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
  const { email, password, role } = req.body; // Destructure from req.body
  try {
    // Validate inputs
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }

    const user = await User.findOne({ email, role }); // Use destructured email
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "Signin successful!",
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const syncGoogleUser = async (req, res) => {
  try {
    const { uid, email, name: displayName, role } = req.body;
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email, name: displayName, role });
      await user.save();
    } else {
      user.name = displayName; // Update name if it exists
      user.role = role; // Update role if needed
      await user.save();
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, message: "User synced successfully" });
  } catch (error) {
    console.error("Sync-google-user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// New endpoint to check if user exists
export const checkUserExists = async (req, res) => {
  try {
    const { uid } = req.body;
    let user = await User.findOne({ uid });
    if (user) {
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({
        exists: true,
        token,
        role: user.role,
        ...user.toObject(),
      });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Check-user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};