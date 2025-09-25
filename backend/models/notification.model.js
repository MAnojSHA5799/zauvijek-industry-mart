const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: { 
      type: String, 
      enum: ["payment", "other"], 
      default: "payment" 
    }, // ✅ notification type
    
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // ✅ sellerId (jis seller ko notify karna hai)
    
    message: { 
      type: String, 
      required: true 
    },

    buyerDetails: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Buyer ID reference
      name: String,
      email: String,
      phone: String,
      companyName: String,
      gstNumber: String,
      warehouseLocation: String,
    },

    productDetails: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // ✅ Product reference
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Seller reference
      name: String,
      description: String,
      price: Number,
      images: [String],
      stock: Number,
      unit: String,
      category: String,
      brand: String,
      features: [String],
      specifications: {
        product: String,
        specification: String,
        size: String,
        packing: String,
        origin: String,
      },
      pricePaidPercent: { type: Number, default: 0 }, // ✅ track 2% payment
      razorpayPaymentId: { type: String }, // ✅ Razorpay transaction ID
    },

    read: { 
      type: Boolean, 
      default: false 
    }, // ✅ read/unread status
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
