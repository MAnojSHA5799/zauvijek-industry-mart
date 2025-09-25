// // const express=require("express")
// // const cors=require("cors")
// // const connection=require("./db")
// // const productRouter=require("./routes/product.route")
// // const cartRouter=require("./routes/Cart.routes")
// // const addressRouter=require("./routes/Address.route")
// // const userRouter=require("./routes/User.routes")
// // const sellerRouter=require("./routes/seller.routes")
// // const adminRouter=require("./routes/admin.routes")
// // const buyerRouter=require("./routes/buyer.routes")
// // const { authorization }=require("./middleware/auth.middleware")
// // const bannerRoutes = require("./routes/bannerRoutes.js");
// // const path = require("path");
// // require("dotenv").config()
// // const app=express()
// // app.use(cors())
// // app.use(express.json())

// // app.get("/",(req,res)=>{
// //     res.send("Welcome to Zauvijek Mart B2B Marketplace")
// // })

// // // Public routes
// // app.use("/user",userRouter)
// // app.use("/buyer",buyerRouter)
// // app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
// // app.use("/api/banner", bannerRoutes);

// // // Protected routes
// // app.use("/seller",authorization,sellerRouter)
// // app.use("/admin",authorization,adminRouter)
// // app.use("/product",productRouter)
// // app.use("/address",authorization,addressRouter)
// // app.use("/cart",authorization,cartRouter)

// // const port =process.env.port

// // app.listen(port,async()=>{

// //     try{
// //         await connection
// //         console.log('connected to BharatMart db');
// //     }catch(err){
// //         console.log({msg:"Not connected to db","error":err.message});
// //     }
// //     console.log(`server is running in port ${port}`);
// // })

// /////////////////////////////////////////////////////////////////

// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// require("dotenv").config();

// const connection = require("./db");

// // Routers
// const productRouter = require("./routes/product.route");
// const cartRouter = require("./routes/Cart.routes");
// const addressRouter = require("./routes/Address.route");
// const userRouter = require("./routes/User.routes");
// const sellerRouter = require("./routes/seller.routes");
// const adminRouter = require("./routes/admin.routes");
// const buyerRouter = require("./routes/buyer.routes");
// const bannerRoutes = require("./routes/bannerRoutes.js");
// const auctionRoutes = require("./routes/auctions"); // ✅ Auction routes
// const eventsUpdatesRouter = require("./routes/eventsUpdates");
// // Middleware
// const { authorization } = require("./middleware/auth.middleware");
// const paymentRoutes = require("./routes/payment.routes");
// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ Static folder for all uploads (including auction images)
// app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// // Welcome route
// app.get("/", (req, res) => {
//   res.send("Welcome to Zauvijek Mart B2B Marketplace");
// });

// // ---------------- Public routes ----------------
// app.use("/user", userRouter);
// app.use("/buyer", buyerRouter);
// app.use("/api/banner", bannerRoutes);
// app.use("/api/auctions", auctionRoutes); // ✅ Auctions public API
// app.use("/api/payment", paymentRoutes);

// // ---------------- Protected routes ----------------
// app.use("/seller", authorization, sellerRouter);
// app.use("/admin", authorization, adminRouter);
// app.use("/product", productRouter);
// app.use("/address", authorization, addressRouter);
// app.use("/cart", authorization, cartRouter);
// app.use("/api/events", eventsUpdatesRouter);

// // ---------------- Server start ----------------
// const port = process.env.port || 4000;

// app.listen(port, async () => {
//   try {
//     await connection;
//     console.log("✅ Connected to BharatMart DB");
//   } catch (err) {
//     console.log({ msg: "❌ Not connected to db", error: err.message });
//   }
//   console.log(`🚀 Server is running on port ${port}`);
// });




//////////////////////////////////////////////////

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
const auctionRoutes = require("./routes/auctions");
const eventsUpdatesRouter = require("./routes/eventsUpdates");
const paymentRoutes = require("./routes/payment.routes");
const productPaymentRoutes = require("./routes/productPayment.routes");
// Middleware
const { authorization } = require("./middleware/auth.middleware");

// Models
const { UserModel } = require("./models/User.model");
const ProductModel = require("./models/product.model");
const NotificationModel = require("./models/notification.model");

const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Static folder for uploads
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to Zauvijek Mart B2B Marketplace");
});

// ---------------- Public routes ----------------
app.use("/user", userRouter);
app.use("/buyer", buyerRouter);
app.use("/api/banner", bannerRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/payment", paymentRoutes);

// ---------------- Protected routes ----------------
app.use("/seller", authorization, sellerRouter);
app.use("/admin", authorization, adminRouter);
app.use("/product", productRouter);
app.use("/address", authorization, addressRouter);
app.use("/cart", authorization, cartRouter);
app.use("/api/events", eventsUpdatesRouter);
app.use("/buyer", productPaymentRoutes);
// ---------------- Nodemailer Transporter ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ---------------- Connect Seller Route ----------------
app.post("/buyer/connect-seller", async (req, res) => {
  const { productId, buyerId } = req.body;
  console.log("Request body:", req.body);
  console.log("ProductModel:", ProductModel);
  console.log("UserModel:", UserModel);
  try {
    // ✅ Correct model names
    const product = await ProductModel.findById(productId).populate("sellerId");
    const buyer = await UserModel.findById(buyerId);
    const admins = await UserModel.find({ role: "admin" });

    if (!product || !buyer) {
      return res.status(404).json({ message: "Product or Buyer not found" });
    }

    const sellerEmail = product.sellerId.email;
    const adminEmails = admins.map((a) => a.email).join(",");

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: `${sellerEmail},${adminEmails}`,
      subject: `New Buyer Interested in Your Product`,
      html: `
        <h3>Product Inquiry</h3>
        <p>Buyer <strong>${buyer.name}</strong> (${buyer.email}) is interested in your product: <strong>${product.name}</strong>.</p>
        <p>Product ID: <strong>${product._id}</strong></p>
        <p>Please contact the buyer to proceed further.</p>
      `,
    });

    res.status(200).json({ message: "Seller and Admin notified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
});




// ---------------- Server start ----------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("✅ Connected to BharatMart DB");
  } catch (err) {
    console.log({ msg: "❌ Not connected to db", error: err.message });
  }
  console.log(`🚀 Server is running on port ${PORT}`);
});