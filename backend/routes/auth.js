import express from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SPA-friendly Google login
router.post("/google-login", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: "No credential provided" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8),
        profilePic: picture,
      });
    }

    const token = generateToken(user._id);
    res.json({
      user: { id: user._id, name: user.name, email: user.email, profilePic: user.profilePic },
      token,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Google login failed" });
  }
});

// Standard auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.get("/me", protect, getUserProfile);

export default router;
