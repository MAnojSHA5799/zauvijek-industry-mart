// const express=require("express")
// const cors=require("cors")
// const connection=require("./db")
// const productRouter=require("./routes/product.route")
// const cartRouter=require("./routes/Cart.routes")
// const addressRouter=require("./routes/Address.route")
// const userRouter=require("./routes/User.routes")
// const sellerRouter=require("./routes/seller.routes")
// const adminRouter=require("./routes/admin.routes")
// const buyerRouter=require("./routes/buyer.routes")
// const { authorization }=require("./middleware/auth.middleware")
// const bannerRoutes = require("./routes/bannerRoutes.js");
// const path = require("path");
// require("dotenv").config()
// const app=express()
// app.use(cors())
// app.use(express.json())

// app.get("/",(req,res)=>{
//     res.send("Welcome to Zauvijek Mart B2B Marketplace")
// })

// // Public routes
// app.use("/user",userRouter)
// app.use("/buyer",buyerRouter)
// app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
// app.use("/api/banner", bannerRoutes);

// // Protected routes
// app.use("/seller",authorization,sellerRouter)
// app.use("/admin",authorization,adminRouter)
// app.use("/product",productRouter)
// app.use("/address",authorization,addressRouter)
// app.use("/cart",authorization,cartRouter)

// const port =process.env.port

// app.listen(port,async()=>{

//     try{
//         await connection
//         console.log('connected to BharatMart db');
//     }catch(err){
//         console.log({msg:"Not connected to db","error":err.message});
//     }
//     console.log(`server is running in port ${port}`);
// })

/////////////////////////////////////////////////////////////////

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connection = require("./db");

// Routers
const productRouter = require("./routes/product.route");
const cartRouter = require("./routes/Cart.routes");
const addressRouter = require("./routes/Address.route");
const userRouter = require("./routes/User.routes");
const sellerRouter = require("./routes/seller.routes");
const adminRouter = require("./routes/admin.routes");
const buyerRouter = require("./routes/buyer.routes");
const bannerRoutes = require("./routes/bannerRoutes.js");
const auctionRoutes = require("./routes/auctions"); // ✅ Auction routes

// Middleware
const { authorization } = require("./middleware/auth.middleware");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Static folder for all uploads (including auction images)
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to Zauvijek Mart B2B Marketplace");
});

// ---------------- Public routes ----------------
app.use("/user", userRouter);
app.use("/buyer", buyerRouter);
app.use("/api/banner", bannerRoutes);
app.use("/api/auctions", auctionRoutes); // ✅ Auctions public API

// ---------------- Protected routes ----------------
app.use("/seller", authorization, sellerRouter);
app.use("/admin", authorization, adminRouter);
app.use("/product", productRouter);
app.use("/address", authorization, addressRouter);
app.use("/cart", authorization, cartRouter);

// ---------------- Server start ----------------
const port = process.env.port || 5000;

app.listen(port, async () => {
  try {
    await connection;
    console.log("✅ Connected to BharatMart DB");
  } catch (err) {
    console.log({ msg: "❌ Not connected to db", error: err.message });
  }
  console.log(`🚀 Server is running on port ${port}`);
});
