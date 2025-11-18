import mongoose from "mongoose";

const generalReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // optional, if tied to a specific order
}, { timestamps: true });

export default mongoose.model("GeneralReview", generalReviewSchema);
