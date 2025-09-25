const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const { UserModel } = require("../models/User.model");
const { authorization, adminOnly } = require("../middleware/auth.middleware");

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "rzp_test_jXtU63C342FF9B",
  key_secret: "nrz1lzn50ELsRHwFwYthIgBT",
});


// ✅ Get current logged-in user
// ✅ Get current logged-in user
// ✅ Get current logged-in user
router.post("/me", authorization, async (req, res) => {
  try {
    const { userDetails } = req.body;
    console.log("👉 Received userDetails from frontend:", userDetails);

    // userDetails se agar userId mila to db me check kar sakte ho
    if (!userDetails || !userDetails._id) {
      return res.status(400).json({ message: "User details missing" });
    }

    const user = await UserModel.findById(userDetails._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in /me:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ---------------- Register User ----------------
// router.post("/register", async (req, res) => {
//   const {
//     name, username, email, password, phone, gender, role,
//     preferredLocation, interests, newsletter,
//     companyName, gstNumber, warehouseLocation, productCategories,
//     aadharNumber, panNumber, plan
//   } = req.body;
//   console.log("Registering user:", req.body);

//   try {
//     const hashedPassword = await bcrypt.hash(password, 5);

//     const user = new UserModel({
//       name,
//       username,
//       email,
//       password: hashedPassword,
//       phone,
//       gender,
//       role,
//       status: role === "buyer" ? "approved" : "pending",
//       preferredLocation,
//       interests,
//       newsletter,
//       companyName,
//       gstNumber,
//       warehouseLocation,
//       productCategories,
//       aadharNumber,
//       panNumber,
//       plan,
//       planActive: false,
//     });

//     await user.save();
//     res.send({ message: "User registered. Complete payment to activate account.", userId: user._id });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).send({ message: "Registration failed", error: error.message });
//   }
// });

// ---------------- Register User ----------------
router.post("/register", async (req, res) => {
  const {
    name, username, email, password, phone, gender, role,
    preferredLocation, interests, newsletter,
    companyName, gstNumber, warehouseLocation, productCategories,
    aadharNumber, panNumber, plan
  } = req.body;
  console.log("Registering user:", req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 5);

    // Calculate plan dates if a plan is selected
    let planStartDate = null;
    let planEndDate = null;
    let planActive = false;

    if (plan) {
      planStartDate = new Date();
      planEndDate = new Date();
      switch (plan) {
        case "monthly":
          planEndDate.setMonth(planEndDate.getMonth() + 1);
          break;
        case "threeMonth":
          planEndDate.setMonth(planEndDate.getMonth() + 3);
          break;
        case "sixMonth":
          planEndDate.setMonth(planEndDate.getMonth() + 6);
          break;
        case "yearly":
          planEndDate.setFullYear(planEndDate.getFullYear() + 1);
          break;
        default:
          return res.status(400).send({ message: "Invalid plan" });
      }
      planActive = true; // activate plan if selected
    }

    const user = new UserModel({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      role,
      status: role === "buyer" ? "approved" : "pending",
      preferredLocation,
      interests,
      newsletter,
      companyName,
      gstNumber,
      warehouseLocation,
      productCategories,
      aadharNumber,
      panNumber,
      plan,
      planStartDate,
      planEndDate,
      planActive,
    });

    await user.save();
    res.send({ message: "User registered successfully.", userId: user._id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ message: "Registration failed", error: error.message });
  }
});


// ---------------- Create Razorpay order ----------------
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  if (!amount) return res.status(400).json({ message: "Amount is required" });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
});

// ---------------- Verify Payment ----------------
router.post("/verify-payment", async (req, res) => {
  const { userId, plan, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  try {
    const startDate = new Date();
    const endDate = new Date();

    switch (plan) {
      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "threeMonth":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "sixMonth":
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        return res.status(400).send({ message: "Invalid plan" });
    }

    await UserModel.findByIdAndUpdate(userId, {
      plan,
      planStartDate: startDate,
      planEndDate: endDate,
      planActive: true,
      status: "approved",
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    res.send({ message: "Payment successful and plan activated!" });
  } catch (error) {
    res.status(500).send({ message: "Plan activation failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).send({ message: "Wrong Credentials" });

    // ❌ Block login if plan is not active
    // if (!user.planActive) {
    //   return res.status(403).send({ message: "No active plan. Please subscribe to continue." });
    // }

    // // ❌ Block login if plan expired
    // if (user.planEndDate && new Date() > new Date(user.planEndDate)) {
    //   return res.status(403).send({ message: "Your plan has expired. Please renew to login." });
    // }

    const token = jwt.sign({ UserId: user._id, role: user.role }, "anysecretkey");
    res.send({
      message: "Login successful",
      token,
      userDetails: user,
    });

  } catch (error) {
    res.status(500).send({ message: "Login failed", error: error.message });
  }
});


module.exports = router;
