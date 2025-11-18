import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      qty: Number,
      price: Number,
      image: String
    }
  ],

  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String
  },

  paymentMethod: String,

  paymentResult: { 
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },

  itemsPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,

  isPaid: { type: Boolean, default: false },
  paidAt: Date,

  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,

  // 🔵 NEW — including Delivered
  deliveryStatus: { 
    type: String,
    default: "Pending",
    enum: [
      "Pending",
      "On The Way To Store",
      "At Store",
      "Picked",
      "Delivered",
      "Cancelled"
    ]
  },

  // 🔵 NEW — include delivered timestamp
  statusTimestamps: {
    onTheWayToStore: Date,
    atStore: Date,
    picked: Date,
    delivered: Date
  }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
