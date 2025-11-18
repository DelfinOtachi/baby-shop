import mongoose from "mongoose";

const orderLogSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // admin who changed
  fromStatus: String,
  toStatus: String,
  note: String
}, { timestamps: true });

export default mongoose.model("OrderLog", orderLogSchema);
