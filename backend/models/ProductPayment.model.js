const mongoose = require("mongoose");

const productPaymentSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
  razorpaySignature: { type: String, required: true },
  status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
  buyerPaid: { type: Boolean, default: false },   // ✅ Buyer ne payment complete kiya ya nahi
  adminApproved: { type: Boolean, default: false }, // ✅ Admin approval flag
  notificationSent: { type: Boolean, default: false }, // ✅ Seller notification flag
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProductPayment", productPaymentSchema);

