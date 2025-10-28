import mongoose from "mongoose";
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: String, // store HTML or markdown
  authorName: String,
  featuredImage: String,
  categories: [String],
  published: { type: Boolean, default: true },
  publishedAt: Date
}, { timestamps: true });

export default mongoose.model("BlogPost", blogSchema);
