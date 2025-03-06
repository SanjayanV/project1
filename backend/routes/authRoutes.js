import express from "express";
import { signup, signin, syncGoogleUser, checkUserExists } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/sync-google-user", syncGoogleUser);
router.post("/check-user", checkUserExists); // New route

export default router;