import Order from "../models/Order.js";

// 🟢 Create a new order
export const createOrder = async (req, res) => {
  try {
    const user = req.user._id; // comes from auth middleware
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentResult,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const order = new Order({
      user,
      items,
      shippingAddress,
      paymentMethod,
      paymentResult,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === "M-Pesa" ? false : false, // both start as unpaid
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Order creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🟡 Get all orders for the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (order) res.json(order);
    else res.status(404).json({ message: "Order not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟣 Mark order as paid (e.g. after M-Pesa callback)
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
