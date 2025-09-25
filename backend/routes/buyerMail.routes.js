const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User"); // Mongoose User model
const Product = require("../models/Product"); // Mongoose Product model

// Nodemailer transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com", // sender email
    pass: "your-app-password",   // Gmail App Password
  },
});

// Connect Seller Endpoint
router.post("/connect-seller", async (req, res) => {
  const { productId, buyerId } = req.body;

  try {
    // Fetch product
    const product = await Product.findById(productId).populate("sellerId");
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Fetch buyer
    const buyer = await User.findById(buyerId);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    // Fetch admin(s)
    const admins = await User.find({ role: "admin" });

    // Prepare email recipients
    const sellerEmail = product.sellerId.email;
    const adminEmails = admins.map((a) => a.email).join(",");

    // Email content
    const mailOptions = {
      from: "yourgmail@gmail.com",
      to: `${sellerEmail}, ${adminEmails}`,
      subject: `New Buyer Interested in Your Product`,
      html: `
        <h3>Product Inquiry</h3>
        <p>Buyer <strong>${buyer.name}</strong> (${buyer.email}) is interested in your product: <strong>${product.name}</strong>.</p>
        <p>Product ID: <strong>${product._id}</strong></p>
        <p>Please contact the buyer to proceed further.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Seller and Admin notified successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
