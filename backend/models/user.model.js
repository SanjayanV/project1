import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String, // Hashed password for email signup
  name: String,
  uid: String, // For Google auth users
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["farmer", "consumer"], required: true }
});

export default mongoose.model("User", userSchema);