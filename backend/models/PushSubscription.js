import mongoose from "mongoose";

const pushSubSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subscription: { type: Object, required: true } // store object as-is
}, { timestamps: true });

export default mongoose.model("PushSubscription", pushSubSchema);
