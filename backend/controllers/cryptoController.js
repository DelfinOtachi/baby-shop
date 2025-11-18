
import pkg from "coinbase-commerce-node";
import Order from "../models/Order.js";
import dotenv from "dotenv";

dotenv.config();

const { Client, resources, Webhook } = pkg;
const { Charge } = resources;

// ✅ Initialize the Coinbase client properly
Client.init(process.env.COINBASE_COMMERCE_API_KEY);



// 🟢 Create charge
export const createCryptoCharge = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const charge = await Charge.create({
      name: "Narya Baby Order",
      description: `Payment for Order #${orderId}`,
      local_price: {
        amount: Math.ceil(order.totalPrice / 160), // KES→USD approx
        currency: "USD",
      },
      pricing_type: "fixed_price",
      metadata: { orderId },
      redirect_url: `${process.env.CLIENT_URL}/order/${orderId}/confirmed`,
      cancel_url: `${process.env.CLIENT_URL}/order/${orderId}`,
    });

    if (!charge || !charge.id) {
      throw new Error("Failed to create Coinbase charge");
    }

    order.paymentResult = {
      id: charge.id,
      status: charge.timeline?.[0]?.status || "pending",
    };
    await order.save();

    res.status(200).json({
      hosted_url: charge.hosted_url,
      id: charge.id,
    });
  } catch (err) {
    console.error("BTC Charge Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔵 Webhook
export const coinbaseWebhook = async (req, res) => {
  const signature = req.headers["x-cc-webhook-signature"];
  const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

  try {
    const event = Webhook.verifyEventBody(
      req.body,
      signature,
      webhookSecret
    );

    console.log("✅ Coinbase Event:", event.type);

    if (event.type === "charge:confirmed") {
      const orderId = event.data.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: event.data.id,
          status: "confirmed",
        };
        await order.save();
        console.log(`💰 Order ${orderId} marked as paid via Bitcoin.`);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("⚠️ Coinbase webhook error:", err.message);
    res.status(400).json({ message: "Webhook verification failed" });
  }
};
