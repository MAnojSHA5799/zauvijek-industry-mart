const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const ProductModel = require("../models/product.model");
const ProductPayment = require("../models/ProductPayment.model");

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Get product details by ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate("sellerId", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Check if buyer has paid for product
router.get("/contact-status/:productId/:buyerId", async (req, res) => {
  try {
    const { productId, buyerId } = req.params;
    const payment = await ProductPayment.findOne({ productId, buyerId, status: "SUCCESS" });
    res.json({ bothPaid: !!payment });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { productId, buyerId, amount } = req.body;

    const options = {
      amount, // in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      productId,
      buyerId,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating order" });
  }
});

// ✅ Verify Razorpay payment
// router.post("/verify-payment", async (req, res) => {
//   try {
//     const { productId, buyerId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign.toString())
//       .digest("hex");

//     if (expectedSign !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     // Save payment
//     await ProductPayment.create({
//       productId,
//       buyerId,
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature,
//       status: "SUCCESS",
//     });

//     res.json({ message: "Payment verified successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Payment verification failed" });
//   }
// });

router.post("/verify-payment", async (req, res) => {
    try {
      const { productId, buyerId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
      // Signature verification
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");
  
      if (expectedSign !== razorpay_signature)
        return res.status(400).json({ message: "Invalid signature" });
  
      // Save payment with admin approval false
      const payment = await ProductPayment.create({
        productId,
        buyerId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "SUCCESS",
        adminApproved: false, 
        notificationSent: false,
      });
  
      res.json({ message: "Payment verified, waiting for admin approval" });
    } catch (err) {
      res.status(500).json({ message: "Payment verification failed" });
    }
  });
  

module.exports = router;
