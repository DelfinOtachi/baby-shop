import axios from "axios";
import Order from "../models/Order.js";

// Get Safaricom Access Token
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
    const { phone, totalPrice, orderId } = req.body;
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
      AccountReference: orderId,
      TransactionDesc: "E-commerce checkout",
    };

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Save CheckoutRequestID to DB immediately
    await Order.findByIdAndUpdate(orderId, {
      paymentResult: {
        id: data.CheckoutRequestID,
        status: "Pending Payment",
      },
    });

    res.json({ message: "📱 STK Push sent!", mpesaResponse: data });
  } catch (error) {
    console.error("❌ STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ message: "M-Pesa STK Push failed", error: error.message });
  }
};
