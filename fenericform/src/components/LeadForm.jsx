import { useState } from "react";
import "./LeadForm.css";

export default function LeadForm() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
      location: form.location.value,
      budget: form.budget.value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setMsg("Form submitted successfully ✅");
        form.reset();
      } else {
        setMsg(result.message || "Submission failed ❌");
      }
    } catch (err) {
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

            <div
  className="grid"
  style={{
    display: "flex",
    gap: "8px",          // gap kam kar diya
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
      flexShrink: 0,     // width fix rahe
    }}
  />

  <input
    name="phone"
    placeholder="Phone Number *"
    required
    pattern="[0-9]{10}"
    maxLength={10}
    style={{
      flex: 1,           // baaki poori width le
    }}
  />
</div>


            <input
              name="location"
              className="full"
              placeholder="Preferred Location *"
              required
            />

            <select name="interest" className="full" required>
              <option value="">Interested In *</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4 BHK</option>
            </select>

            <select name="budget" className="full" required>
              <option value="">Budget *</option>
              <option>₹50L – ₹75L</option>
              <option>₹75L – ₹1Cr</option>
              <option>₹1Cr+</option>
              <option>Not Decided</option>
            </select>

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
