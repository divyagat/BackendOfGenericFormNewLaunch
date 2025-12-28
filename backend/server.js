const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", true); // 🔥 real client IP

// 🔗 B2B Bricks CRM Hook
const CRM_URL =
  "https://connector.b2bbricks.com/api/Integration/hook/c12c3b7d-b505-48f3-96ff-5e17752d57d6";

/* ===============================
   GET REAL USER IP
================================ */
function getUserIP(req) {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "";

  if (ip.includes("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  return ip || "N/A";
}

/* ===============================
   IP → LOCATION (AUTO)
================================ */
async function getLocationFromIP(ip) {
  try {
    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      return "Localhost";
    }

    const res = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,country,regionName,city`
    );

    if (res.data.status === "success") {
      return `${res.data.city}, ${res.data.regionName}, ${res.data.country}`;
    }

    return "Unknown";
  } catch {
    return "Unknown";
  }
}

/* ===============================
   RECEIVE LEAD FROM REACT
================================ */
app.post("/api/leads", async (req, res) => {
  try {
    console.log("📥 Incoming React Lead:", req.body);

    const {
      fullName,
      email,
      phone,
      interest,     // project
      location,     // form location (Loni Kalbhor)
      budget
    } = req.body;

    if (!fullName || !phone || !interest) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    /* ===============================
       AUTO IP + LOCATION
    ================================ */
    const visitorIP = getUserIP(req);
    const leadLocation = await getLocationFromIP(visitorIP);

    /* ===============================
       🔥 CRM REQUIREMENTS (IMAGE MATCH)
    ================================ */
    const remark =
      `Project: ${interest}, ` +
      `Location: ${location || "N/A"}, ` +
      `Visitor IP: ${visitorIP}, ` +
      `Lead Location: ${leadLocation}`;

    /* ===============================
       CRM SAFE PAYLOAD
    ================================ */
    const crmPayload = {
      name: fullName,
      email: email || "",
      mobile: phone,
      project: interest,

      // ⭐ THIS FIELD SHOWS IN CRM REQUIREMENTS
      remark: remark,

      // optional
      budget: budget || "",
      anti_spam_id: Date.now()
    };

    console.log("📤 Sending to CRM:", crmPayload);

    const crmRes = await axios.post(CRM_URL, crmPayload, {
      headers: { "Content-Type": "application/json" }
    });

    console.log("✅ CRM Response:", crmRes.data);

    res.json({
      success: true,
      message: "Lead submitted successfully",
      crm_response: crmRes.data,
      sent_data: crmPayload
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

/* ===============================
   START SERVER
================================ */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
