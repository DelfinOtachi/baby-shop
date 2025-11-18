import Order from "../models/Order.js";
import OrderLog from "../models/OrderLog.js";
import PushSubscription from "../models/PushSubscription.js";
import { sendEmail } from "../utils/mailer.js";
import { sendPush } from "../utils/push.js";



// 🟢 Create a new order

export const createOrder = async (req, res) => {
  try {
    const user = req.user._id;
    const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const order = new Order({
      user,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
    });

    const createdOrder = await order.save();

    // Get user email
    const email = req.user.email;

    // Send order confirmation email
    const htmlContent = `
      <h2>Thank you for your order from Narya Baby! 🎉</h2>
      <p>Order ID: <strong>${createdOrder._id}</strong></p>
      <p>Total: <strong>KES ${createdOrder.totalPrice}</strong></p>
      <p>We’ll notify you once your payment is confirmed.</p>
    `;

    await sendEmail({
      to: email,
      subject: "Your Narya Baby Order Confirmation",
      html: htmlContent,
    });

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

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow the user who placed the order to cancel it
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // Only allow cancel if not paid
    if (order.isPaid) {
      return res.status(400).json({ message: "Cannot cancel a paid order" });
    }

    // ✅ Correct way to delete the document
    await Order.deleteOne({ _id: order._id });

    res.json({ message: "Order canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// 🔵 Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) res.json(order);
    else res.status(404).json({ message: "Order not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🟣 Mark order as paid (e.g. after M-Pesa callback)
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

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

      // Send payment confirmation email
      const htmlContent = `
        <h2>Payment Received! 🎉</h2>
        <p>Hi ${order.user.name}, we’ve received your payment for Order ID: <strong>${order._id}</strong>.</p>
        <p>Total Paid: <strong>KES ${order.totalPrice}</strong></p>
        <p>Thank you for shopping with Narya Baby!</p>
      `;

      await sendEmail({
        to: order.user.email,
        subject: "Payment Received - Narya Baby",
        html: htmlContent,
      });

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/status
// PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const actorId = req.user?._id; // admin performing action
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const validTransitions = {
      Pending: ["On The Way To Store", "Cancelled"],
      "On The Way To Store": ["At Store", "Cancelled"],
      "At Store": ["Picked", "Cancelled"],
      Picked: ["Delivered"],
      Delivered: [],
      Cancelled: []
    };

    if (!validTransitions[order.deliveryStatus].includes(status)) {
      return res.status(400).json({ message: `Cannot change status from ${order.deliveryStatus} to ${status}` });
    }

    const from = order.deliveryStatus;
    order.deliveryStatus = status;

    // timestamps & flags
    switch (status) {
      case "On The Way To Store":
        order.statusTimestamps.onTheWayToStore = new Date();
        break;
      case "At Store":
        order.statusTimestamps.atStore = new Date();
        break;
      case "Picked":
        order.statusTimestamps.picked = new Date();
        break;
      case "Delivered":
        order.statusTimestamps.delivered = new Date();
        order.isDelivered = true;
        order.deliveredAt = new Date();
        break;
    }

    const saved = await order.save();

    // Create order log entry
    try {
      await OrderLog.create({
        order: order._id,
        actor: actorId,
        fromStatus: from,
        toStatus: status,
        note: req.body.note || ""
      });
    } catch (logErr) {
      console.error("OrderLog create error:", logErr);
    }

    // Send email notification to customer
    try {
      const email = order.user?.email;
      if (email) {
        const subject = `Order ${order._id} status updated: ${status}`;
        const html = `
          <h3>Your order status changed</h3>
          <p>Hi ${order.user.name},</p>
          <p>Your order <strong>${order._id}</strong> is now: <strong>${status}</strong>.</p>
          ${req.body.note ? `<p>Note: ${req.body.note}</p>` : ""}
          <p>Thanks,<br/>Narya Baby</p>
        `;
        await sendEmail({ to: email, subject, html });
      }
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    // Send web-push notifications (if subscription exists)
    try {
      const subs = await PushSubscription.find({ user: order.user._id });
      const payload = {
        title: `Order ${order._id}: ${status}`,
        body: `Your order is now ${status}`,
        data: { orderId: order._id, status }
      };
      for (const s of subs) {
        try {
          await sendPush(s.subscription, payload);
        } catch (e) {
          console.warn("Failed to send push to subscription, removing it.");
          // optionally remove broken subscription
          await PushSubscription.deleteOne({ _id: s._id });
        }
      }
    } catch (pushErr) {
      console.error("Push notify error:", pushErr);
    }

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// PUT /api/orders/:id/picked
export const markOrderPicked = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow picking if order is at store
    if (order.deliveryStatus !== "At Store") {
      return res.status(400).json({ message: `Order must be 'At Store' to mark as picked` });
    }

    order.pickedAt = new Date();
    order.deliveryStatus = "Out for Delivery"; // automatically progress
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// PUT /api/orders/:id/mpesa-id
export const attachMpesaId = async (req, res) => {
  const { checkoutId } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.paymentResult.id = checkoutId;
  order.paymentResult.status = "Pending Payment";
  await order.save();

  res.json({ message: "M-Pesa CheckoutRequestID attached" });
};
