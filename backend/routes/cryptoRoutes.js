import express from "express";
import { createCryptoCharge } from "../controllers/cryptoController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Secure route for creating a crypto charge
router.post("/create-charge", protect, createCryptoCharge);

export default router;
