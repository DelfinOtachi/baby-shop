import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }, // 🟢 added subCategory
    countInStock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false }, // ✅ new
    topDeal: { type: Boolean, default: false },     // ✅ new
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
