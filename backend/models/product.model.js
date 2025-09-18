// const mongoose=require("mongoose")

// const productSchema=mongoose.Schema({
//     name:{type:String,required:true},
//     description:{type:String,required:true},
//     price:{type:Number,required:true},
//     images:[{type:String}],
//     stock:{type:Number,required:true,default:0},
//     category:{type:String,required:true},
//     sellerId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
//     status:{type:String,enum:['pending','approved','rejected'],default:'pending'},
//     brand:{type:String},
//     specifications:{type:Object,default:{}},
//     minOrderQuantity:{type:Number,default:1},
//     maxOrderQuantity:{type:Number,default:1000}
// },{
//     versionKey:false,
//     timestamps:true
// })

// const ProductModel=mongoose.model("product",productSchema)

// module.exports=ProductModel


// const mongoose = require("mongoose");

// const productSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     images: [{ type: String }],
//     stock: { type: Number, required: true, default: 0 },
//     category: { type: String, required: true },
//     sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
//     status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//     brand: { type: String },

//     // ✅ New Fields
//     features: [{ type: String }],

//     specifications: {
//       product: { type: String },
//       specification: { type: String },
//       size: { type: String },
//       packing: { type: String },
//       origin: { type: String },
//     },

//     minOrderQuantity: { type: Number, default: 1 },
//     maxOrderQuantity: { type: Number, default: 1000 },
//   },
//   {
//     versionKey: false,
//     timestamps: true,
//   }
// );

// const ProductModel = mongoose.model("product", productSchema);

// module.exports = ProductModel;


const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    brand: { type: String },
    features: [{ type: String }],
    specifications: {
      product: { type: String },
      specification: { type: String },
      size: { type: String },
      packing: { type: String },
      origin: { type: String },
    },
    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: { type: Number, default: 1000 },

    // ✅ New field for product condition
    condition: { type: String, enum: ["New", "Refurbished", "Resale"], default: "New" },
  },
  { versionKey: false, timestamps: true }
);

const ProductModel = mongoose.model("product", productSchema);
module.exports = ProductModel;

