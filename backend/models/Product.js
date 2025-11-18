import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  type: { type: String, enum: ["color", "size", "age"], required: true },
  value: { type: String, required: true },
  colorCode: { type: String }, // optional, for color variants
  images: [{ type: String }], // array of image URLs
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    countInStock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    topDeal: { type: Boolean, default: false },

    images: [{ type: String }],
    variants: [variantSchema], // use the defined variantSchema here
  },
  { timestamps: true }
);



const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;



