import { useState } from "react";
import "./LeadForm.css";

export default function LeadForm() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Project List
  const projects = [
    "Mantra Magnus Elite (Mundhwa Pune)",
    "Mantra Magnus (Mundhwa Pune)",
    "Mantra 1 Residences By Burgundy (Magarpatta Pune)",
    "Mantra Codename-Paradise (Sus Pune)",
    "Mantra Melange (Kharadi Pune)",
    "Mantra Meridian (Balewadi Pune)"
    

  ];

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("Submitting...");

    const form = e.target;

    const data = {
      fullName: form.full_name.value,
      email: form.email.value,
      phone: form.country_code.value + form.phone.value,
      interest: form.interest.value,
      location: form.location.value, // project name
      budget: form.budget.value,
    };

    try {
      const res = await fetch(
        "http://localhost:5000/api/leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (result.success) {
        setMsg("Form submitted successfully ✅");
        form.reset();
      } else {
        setMsg(result.message || "Submission failed ❌");
      }
    } catch (error) {
      setMsg("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero">
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Register Your Interest</h2>

          <form onSubmit={submitHandler}>
            {/* Name + Email */}
            <div className="grid">
              <input
                name="full_name"
                placeholder="Full Name *"
                required
              />

              <input
                name="email"
                placeholder="Email"
                type="email"
              />
            </div>

            {/* Country Code + Phone */}
            <div
              className="grid"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <input
                name="country_code"
                value="+91"
                readOnly
                style={{
                  width: "55px",
                  textAlign: "center",
                  padding: "10px 6px",
                  background: "#f3f3f3",
                  cursor: "default",
                  borderRadius: "6px",
                  flexShrink: 0,
                }}
              />

              <input
                name="phone"
                placeholder="Phone Number *"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                style={{ flex: 1 }}
              />
            </div>

            {/* Project Dropdown */}
            <select name="location" className="full" required>
              <option value="">Select Project *</option>
              {projects.map((project, index) => (
                <option key={index} value={project}>
                  {project}
                </option>
              ))}
            </select>

            {/* Interest */}
            <select name="interest" className="full" required>
              <option value="">Interested In *</option>
              {/* <option value="1 BHK">1 BHK</option> */}
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4 BHK</option>
            </select>

            {/* Budget */}
            <select name="budget" className="full" required>
              <option value="">Budget *</option>
              <option value="₹50L – ₹75L">₹50L – ₹75L</option>
              <option value="₹75L – ₹1Cr">₹75L – ₹1Cr</option>
              <option value="₹1Cr+">₹1Cr+</option>
              <option value="Not Decided">Not Decided</option>
            </select>

            {/* Submit */}
            <button className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>

            {msg && <p className="msg">{msg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
