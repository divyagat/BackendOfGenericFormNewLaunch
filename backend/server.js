const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 B2B Bricks CRM Webhook
const CRM_URL =
  "https://connector.b2bbricks.com/api/Integration/hook/8a43ae60-8a26-4213-abc6-0cf685203dd2";

// 📩 Receive lead from React
app.post("/api/leads", async (req, res) => {
  try {
    console.log("📥 Incoming React Lead:", req.body);

    const {
      fullName,
      email,
      phone,
      interest,
      location,
      budget
    } = req.body;

    // ✅ Basic validation
    if (!fullName || !phone || !interest) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // 🛡 CRM-safe payload
    const crmPayload = {
      name: fullName,
      email: email || "",
      mobile: phone,
      interest: interest,

      // anti-spam / tracking
      anti_spam_id: Date.now(),
      unique_hash: Math.random().toString(36).substring(2),

      // optional extra info
      location: location || "",
      budget: budget || ""
    };

    console.log("🛡 Payload sent to CRM:", crmPayload);

    // 🚀 Send to CRM
    const crmRes = await axios.post(CRM_URL, crmPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("📤 CRM Response:", crmRes.data);

    res.json({
      success: true,
      message: "Lead submitted successfully",
      crm_response: crmRes.data
    });
  } catch (err) {
    console.error("❌ CRM Error:", err.response?.data || err.message);

    res.status(500).json({
      success: false,
      message: "CRM submission failed",
      error: err.response?.data || err.message
    });
  }
});

// 🚀 Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
