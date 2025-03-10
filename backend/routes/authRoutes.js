import express from "express";
import { signup, signin, syncGoogleUser, checkUserExists } from "../controllers/auth.controller.js";
import {protect} from "../middlewares/authMiddleware.js";
import User from "../models/user.model.js";
const router = express.Router();


router.post("/signup", signup);
router.post("/signin", signin);
router.post("/sync-google-user", syncGoogleUser);
router.post("/check-user", checkUserExists); // New route
router.get("/me", protect, async (req, res) => {
  try {
    console.log("Fetching user with _id:", req.user._id); // Debug user ID from token
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Found user:", user); // Debug user object
    const name = user.name || user.displayName || "User";
    res.json({
      _id: user._id,
      email: user.email,
      name: name,
      role: user.role,
      displayName: user.displayName, // Optional, for debugging
    });
  } catch (error) {
    console.error("Error in /me route:", error); // Debug server error
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;