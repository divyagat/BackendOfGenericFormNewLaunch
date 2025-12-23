import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  interest: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Lead", leadSchema);
