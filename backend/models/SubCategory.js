import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String },
    featured: { type: Boolean, default: false }, // ✅ new
  },
  { timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);
