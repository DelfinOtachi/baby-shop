import Order from "../models/Order.js";

// Generate M-Pesa access token
const generateToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const { data } = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return data.access_token;
};

// 🟢 Initiate STK Push
export const initiateSTKPush = async (req, res) => {
  try {
    const { phone, totalPrice, items, address } = req.body;
    if (!phone || !totalPrice) {
      return res.status(400).json({ message: "Phone number and amount are required" });
    }

    // Create order in DB before payment
    const order = await Order.create({
      user: req.user._id,
      items: items.items || [],
      shippingAddress: { address, phone },
      paymentMethod: "M-Pesa",
      itemsPrice: totalPrice,
      totalPrice,
      shippingPrice: 0,
      isPaid: false,
    });

    const access_token = await generateToken();
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const stkData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(totalPrice),
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `Order_${order._id}`,
      TransactionDesc: "Payment for Narya Baby Order",
    };

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    console.log("✅ STK Push initiated:", data);

    res.json({
      message: "STK Push sent to your phone. Please complete the payment.",
      orderId: order._id,
      mpesaResponse: data,
    });
  } catch (error) {
    console.error("❌ STK Push error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ message: "M-Pesa STK Push failed", error: error.response?.data || error.message });
  }
};

// 🔵 M-Pesa Callback (Safaricom will hit this URL)
export const mpesaCallback = async (req, res) => {
  try {
    const callback = req.body.Body.stkCallback;
    const orderId = callback?.CallbackMetadata?.Item?.find(
      (i) => i.Name === "AccountReference"
    )?.Value?.split("_")[1];

    const order = await Order.findById(orderId);

    if (callback.ResultCode === 0) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: callback.CheckoutRequestID,
        status: "Paid",
        update_time: new Date().toISOString(),
        email_address: "mpesa@safaricom.com",
      };
      await order.save();
      console.log("✅ Payment successful for order:", orderId);
    } else {
      console.log("❌ Payment failed or cancelled:", callback.ResultDesc);
    }

    res.json({ message: "Callback received" });
  } catch (error) {
    console.error("❌ M-Pesa Callback error:", error.message);
    res.status(500).json({ message: "Callback processing error" });
  }
};
