// const mongoose = require("mongoose");

// const AuctionSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, default: "" },
//   type: { type: String, enum: ["forward", "backward"], required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   status: { type: String, enum: ["active", "expired"], default: "active" },
//   imageUrl: { type: String, default: null }, // ✅ image path
//   createdAt: { type: Date, default: Date.now },
// });

// AuctionSchema.index({ status: 1, endDate: 1 });

// module.exports = mongoose.model("Auction", AuctionSchema);



const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  type: { type: String, enum: ["forward", "backward"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "expired"], default: "active" },
  imageUrl: { type: String, default: null },

  // ✅ New fields for metal/iron dust
  materialGrade: { type: String, default: "" },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ["kg", "ton", "bag"], default: "kg" },
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  deliveryOption: { type: String, enum: ["pickup", "delivery"], default: "pickup" },
  materialCertificate: { type: String, default: null }, // uploaded file path
  photos: [{ type: String }], // multiple photos
  terms: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

AuctionSchema.index({ status: 1, endDate: 1 });

module.exports = mongoose.model("Auction", AuctionSchema);

