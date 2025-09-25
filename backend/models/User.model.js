// const mongoose = require("mongoose");

// const userSchema = mongoose.Schema(
//   {
//     name:{type:String,required:true},
//     username:{type:String,required:true,unique:true},
//     phone:{type:Number,required:true,min:10,unique:true},
//     email:{type:String,required:true,unique:true},
//     password:{type:String,required:true,min:6,max:10},
//     gender:{type:String,required:true},
//     role:{type:String,enum:['buyer','seller','admin'],default:'buyer'},
//     status:{type:String,enum:['pending','approved','blocked'],default:'pending'},
//     user:String
//   },
//   { versionKey: false, timestamps: true }
// );

// const UserModel = mongoose.model("user", userSchema);

// module.exports = { UserModel };



// models/User.model.js
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 6, max: 10 },
    gender: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller", "betauction", "admin"], default: "buyer" },
    status: { type: String, enum: ["pending", "approved", "blocked"], default: "pending" },

    // Buyer specific
    preferredLocation: { type: String },
    interests: { type: String },
    newsletter: { type: Boolean, default: false },

    // Seller specific
    companyName: { type: String },
    gstNumber: { type: String },
    warehouseLocation: { type: String },
    productCategories: { type: String },

    // Bet Auction specific
    aadharNo: { type: String },
    panNo: { type: String },

    // Plan info
    plan: { type: String, enum: ["monthly", "threeMonth", "sixMonth", "yearly"], default: null },
    planAmount: { type: Number },
    planStartDate: { type: Date },
    planEndDate: { type: Date },
    planActive: { type: Boolean, default: false },

    // Razorpay payment details
    razorpay_payment_id: { type: String },
    razorpay_order_id: { type: String },
    razorpay_signature: { type: String },
  },
  { versionKey: false, timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);
module.exports = { UserModel };



