import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

// POST: Create Lead
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, interest } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        message: "Full name, email, and phone are required"
      });
    }

    const lead = new Lead({
      fullName,
      email,
      phone,
      interest
    });

    await lead.save();

    res.status(201).json({
      success: true,
      message: "Lead submitted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

export default router;
