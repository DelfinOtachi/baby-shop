import axios from "axios";
import dotenv from "dotenv";
import Order from "../models/Order.js";
dotenv.config();

// Get Safaricom access token
const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const { data } = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return data.access_token;
};

// 🟢 Initiate STK Push
export const initiateSTKPush = async (req, res) => {
  try {
    const { phone, totalPrice, orderId } = req.body; // ✅ include orderId
    const token = await getAccessToken();

    let formattedPhone = phone;
    if (phone.startsWith("0")) formattedPhone = "254" + phone.substring(1);
    if (phone.startsWith("+")) formattedPhone = phone.substring(1);

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const stkData = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(totalPrice),
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.BASE_URL}/api/payments/callback`,
      AccountReference: orderId, // ✅ use orderId as account reference
      TransactionDesc: "E-commerce checkout",
    };

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Save CheckoutRequestID to the order
    await Order.findByIdAndUpdate(orderId, {
      "paymentResult.id": data.CheckoutRequestID,
      "paymentResult.status": "Pending Payment",
    });

    res.json({
      message: "📱 STK Push sent! Complete payment on your phone.",
      mpesaResponse: data,
    });
  } catch (error) {
    console.error("❌ M-Pesa STK Push error:", error.response?.data || error.message);
    res.status(500).json({ message: "M-Pesa STK Push failed", error: error.message });
  }
};


// 🔵 Callback (called by Safaricom after payment)

export const mpesaCallback = async (req, res) => {
  try {
    console.log("🔔 M-Pesa Callback:", JSON.stringify(req.body, null, 2));

    const body = req.body.Body.stkCallback;
    if (!body) return res.sendStatus(400);

    const checkoutId = body.CheckoutRequestID;
    const resultCode = body.ResultCode;

    // Find the order with this CheckoutRequestID
    const order = await Order.findOne({ "paymentResult.id": checkoutId });
    if (!order) {
      console.warn("⚠️ Order not found for CheckoutRequestID:", checkoutId);
      return res.status(200).json({ message: "Order not found, ignoring callback" });
    }

    if (resultCode === 0) {
      const items = body.CallbackMetadata?.Item || [];
      const amount = items.find(i => i.Name === "Amount")?.Value;
      const mpesaReceipt = items.find(i => i.Name === "MpesaReceiptNumber")?.Value;

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = order.paymentResult || {};
      order.paymentResult.status = "Paid";
      order.paymentResult.amount = amount;
      order.paymentResult.mpesaReceipt = mpesaReceipt;

      await order.save();
      console.log("🟢 Order marked paid:", order._id);
    } else {
      console.log("⚠️ Payment failed:", body.ResultDesc);
    }

    res.json({ message: "Callback processed" });
  } catch (error) {
    console.error("❌ Callback processing error:", error);
    res.status(500).json({ message: error.message });
  }
};
