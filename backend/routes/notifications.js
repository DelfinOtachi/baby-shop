import express from "express";
import PushSubscription from "../models/PushSubscription.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/subscribe", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const subscription = req.body.subscription;
    if (!subscription) return res.status(400).json({ message: "Missing subscription" });

    // Upsert
    await PushSubscription.findOneAndUpdate(
      { user: userId },
      { subscription },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Subscribed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/unsubscribe", protect, async (req, res) => {
  try {
    await PushSubscription.deleteOne({ user: req.user._id });
    res.json({ message: "Unsubscribed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// in routes/notifications.js
router.get("/vapidPublicKey", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || "" });
});


export default router;
