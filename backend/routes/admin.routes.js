const express = require("express");
const { authorization, adminOnly } = require("../middleware/auth.middleware");
const ProductModel = require("../models/product.model");
const OrderModel = require("../models/order.model");
const { UserModel } = require("../models/User.model");
const ProductPayment = require("../models/ProductPayment.model"); // correct path check kare
// const NotificationModel = require("../models/notification.model"); // adjust the path
const Notification = require("../models/notification.model"); // ✅ यहाँ import
const router = express.Router();

// Get admin dashboard data
router.get("/dashboard", authorization, adminOnly, async (req, res) => {
    try {
        // Get user counts
        const totalUsers = await UserModel.countDocuments();
        const totalBuyers = await UserModel.countDocuments({ role: 'buyer' });
        const totalSellers = await UserModel.countDocuments({ role: 'seller' });
        const pendingSellers = await UserModel.countDocuments({ role: 'seller', status: 'pending' });
        
        // Get product counts
        const totalProducts = await ProductModel.countDocuments();
        const pendingProducts = await ProductModel.countDocuments({ status: 'pending' });
        const approvedProducts = await ProductModel.countDocuments({ status: 'approved' });
        
        // Get order counts
        const totalOrders = await OrderModel.countDocuments();
        const pendingOrders = await OrderModel.countDocuments({ status: 'pending' });
        const completedOrders = await OrderModel.countDocuments({ status: 'delivered' });
        
        // Get recent activities
        const recentUsers = await UserModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role status createdAt');
        
        const recentProducts = await ProductModel.find()
            .populate('sellerId', 'name email')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name price status sellerId createdAt');
        
        res.send({
            summary: {
                users: { total: totalUsers, buyers: totalBuyers, sellers: totalSellers, pendingSellers },
                products: { total: totalProducts, pending: pendingProducts, approved: approvedProducts },
                orders: { total: totalOrders, pending: pendingOrders, completed: completedOrders }
            },
            recentUsers,
            recentProducts
        });
    } catch (error) {
        res.status(500).send({ message: "Error fetching dashboard data", error: error.message });
    }
});

// Get all users with pagination and filtering
router.get("/users", authorization, adminOnly, async (req, res) => {
    try {
        const { page = 1, limit = 10, role, status } = req.query;
        
        let query = {};
        if (role) query.role = role;
        if (status) query.status = status;
        
        const users = await UserModel.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await UserModel.countDocuments(query);
        
        res.send({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).send({ message: "Error fetching users", error: error.message });
    }
});

// Update user status (approve/reject/block)
router.put("/users/:id/status", authorization, adminOnly, async (req, res) => {
    try {
        const userId = req.params.id;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'approved', 'blocked'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({ message: "Invalid status" });
        }
        
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        
        res.send({ message: "User status updated successfully", user });
    } catch (error) {
        res.status(500).send({ message: "Error updating user status", error: error.message });
    }
});

// Get all products with pagination and filtering
router.get("/products", authorization, adminOnly, async (req, res) => {
    try {
        const { page = 1, limit = 80, status, category } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        
        const products = await ProductModel.find(query)
            .populate('sellerId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await ProductModel.countDocuments(query);
        
        res.send({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).send({ message: "Error fetching products", error: error.message });
    }
});

// Update product status (approve/reject)
router.put("/products/:id/status", authorization, adminOnly, async (req, res) => {
    try {
        const productId = req.params.id;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({ message: "Invalid status" });
        }
        
        const product = await ProductModel.findByIdAndUpdate(
            productId,
            { status },
            { new: true }
        ).populate('sellerId', 'name email');
        
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        
        res.send({ message: "Product status updated successfully", product });
    } catch (error) {
        res.status(500).send({ message: "Error updating product status", error: error.message });
    }
});

// Get all orders
router.get("/orders", authorization, adminOnly, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        let query = {};
        if (status) query.status = status;
        
        const orders = await OrderModel.find(query)
            .populate('buyerId', 'name email phone')
            .populate('sellerId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await OrderModel.countDocuments(query);
        
        res.send({
            orders,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).send({ message: "Error fetching orders", error: error.message });
    }
});

// Delete user
router.delete("/users/:id", authorization, adminOnly, async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await UserModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        
        // Also delete user's products and orders
        await ProductModel.deleteMany({ sellerId: userId });
        await OrderModel.deleteMany({ $or: [{ buyerId: userId }, { sellerId: userId }] });
        
        res.send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting user", error: error.message });
    }
});

// Delete product
router.delete("/products/:id", authorization, adminOnly, async (req, res) => {
    try {
        const productId = req.params.id;
        
        const product = await ProductModel.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        
        res.send({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting product", error: error.message });
    }
});



router.get("/pending-payments", authorization, adminOnly, async (req, res) => {
    try {
      const pending = await ProductPayment.find({ adminApproved: false })
        .populate("buyerId", "name email")
        .populate("productId", "name price"); // price bhi populate karo
  
      const result = pending.map(p => ({
        _id: p._id,
        buyer: p.buyerId,
        product: p.productId,
        adminApproved: p.adminApproved,
        createdAt: p.createdAt,
        percentAmount: p.productId ? (p.productId.price * 1.5) / 100 : 0
      }));
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending payments", error: error.message });
    }
  });
  
  
  
  
//   router.post("/approve-payment/:paymentId", authorization, adminOnly, async (req, res) => {
//     try {
//       const payment = await ProductPayment.findByIdAndUpdate(
//         req.params.paymentId,
//         { adminApproved: true },
//         { new: true }
//       );
  
//       if (!payment) {
//         return res.status(404).json({ message: "Payment not found" });
//       }
  
//       const product = await ProductModel.findById(payment.productId).populate("sellerId", "name email");
  
//       console.log(`Notify seller ${product.sellerId.name}: Buyer ${payment.buyerId} has paid to see contact.`);
  
//       res.json({ message: "Payment approved and seller notified", payment });
//     } catch (error) {
//       res.status(500).json({ message: "Error approving payment", error: error.message });
//     }
//   });

// router.post("/approve-payment/:paymentId", authorization, adminOnly, async (req, res) => {
//     try {
//       const paymentId = req.params.paymentId;
  
//       // 1️⃣ Approve payment and populate buyer + seller info
//       const payment = await ProductPayment.findByIdAndUpdate(
//         paymentId,
//         { adminApproved: true },
//         { new: true }
//       )
//         .populate("buyerId", "name email phone")
//         .populate({
//           path: "productId",
//           populate: { path: "sellerId", select: "_id name email" }
//         });
  
//       if (!payment) {
//         return res.status(404).json({ message: "Payment not found" });
//       }
  
//       // 2️⃣ Notify seller
//       if (!payment.productId.sellerId) {
//         return res.status(400).json({ message: "Seller not found for this product" });
//       }
  
//       const sellerId = payment.productId.sellerId._id;
//       const notificationMessage = `Buyer ${payment.buyerId.name} has been approved by Zauvijek MetelX Mart to buy the Product ${payment.productId.name}.`;
  
//       console.log(`Notify seller ${sellerId}: ${notificationMessage}`);
  
//       // 3️⃣ Save notification in DB
//       await NotificationModel.create({
//         userId: sellerId,
//         message: notificationMessage,
//         read: false
//       });
  
//       // 4️⃣ Return success
//       res.json({ message: "Payment approved and seller notified", payment });
//     } catch (error) {
//       res.status(500).json({ message: "Error approving payment", error: error.message });
//     }
//   });


// router.post("/approve-payment/:paymentId", authorization, adminOnly, async (req, res) => {
//     try {
//       const paymentId = req.params.paymentId;
//       console.log("Approving payment:", paymentId);
  
//       const payment = await ProductPayment.findById(paymentId)
//         .populate("buyerId", "name email phone companyName gstNumber warehouseLocation")
//         .populate({
//           path: "productId",
//           populate: { path: "sellerId", select: "_id name email phone" },
//         });
  
//       if (!payment) return res.status(404).json({ message: "Payment not found" });
//       if (!payment.productId?.sellerId) return res.status(400).json({ message: "Seller not found for this product" });
  
//       if (!payment.adminApproved) {
//         payment.adminApproved = true;
//         await payment.save();
//       }
  
//       const sellerId = payment.productId.sellerId._id;
  
//       if (!payment.notificationSent) {
//         const notification = await Notification.create({
//           userId: sellerId,
//           message: `Buyer ${payment.buyerId.name} is approved to buy ${payment.productId.name}.`,
//           buyerDetails: {
//             name: payment.buyerId?.name,
//             email: payment.buyerId?.email,
//             phone: payment.buyerId?.phone,
//             companyName: payment.buyerId?.companyName,
//             gstNumber: payment.buyerId?.gstNumber,
//             warehouseLocation: payment.buyerId?.warehouseLocation,
//           },
//         });
  
//         payment.notificationSent = true;
//         await payment.save();
  
//         console.log("Notification saved:", notification);
//         return res.json({ message: "Payment approved and buyer details sent to seller", payment, notification });
//       } else {
//         console.log("Notification already sent for this payment.");
//         return res.json({ message: "Payment already approved and notification sent", payment });
//       }
//     } catch (error) {
//       console.error("Error approving payment:", error);
//       res.status(500).json({ message: "Error approving payment", error: error.message });
//     }
//   });

// router.post("/approve-payment/:paymentId", authorization, adminOnly, async (req, res) => {
//     try {
//       const paymentId = req.params.paymentId;
//       console.log("Approving payment:", paymentId);
  
//       const payment = await ProductPayment.findById(paymentId)
//         .populate("buyerId", "name email phone companyName gstNumber warehouseLocation")
//         .populate({
//           path: "productId",
//           select: "name description price images stock unit category brand features specifications",
//           populate: { path: "sellerId", select: "_id name email phone" },
//         });
  
//       if (!payment) return res.status(404).json({ message: "Payment not found" });
//       if (!payment.productId?.sellerId) return res.status(400).json({ message: "Seller not found for this product" });
  
//       if (!payment.adminApproved) {
//         payment.adminApproved = true;
//         await payment.save();
//       }
  
//       const sellerId = payment.productId.sellerId._id;
  
//       if (!payment.notificationSent) {
//         const notification = await Notification.create({
//           userId: sellerId,
//           message: `Buyer ${payment.buyerId.name} is approved to buy ${payment.productId.name}.`,
//           type: "payment", // ✅ mark as payment
//           buyerDetails: {
//             name: payment.buyerId?.name,
//             email: payment.buyerId?.email,
//             phone: payment.buyerId?.phone,
//             companyName: payment.buyerId?.companyName,
//             gstNumber: payment.buyerId?.gstNumber,
//             warehouseLocation: payment.buyerId?.warehouseLocation,
//           },
//           productDetails: {
//             _id: payment.productId._id,
//             name: payment.productId?.name,
//             description: payment.productId?.description,
//             price: payment.productId?.price,
//             images: payment.productId?.images,
//             stock: payment.productId?.stock,
//             unit: payment.productId?.unit,
//             category: payment.productId?.category,
//             brand: payment.productId?.brand,
//             features: payment.productId?.features,
//             sellerId: payment.productId.sellerId._id, // ✅ Seller ID reference
//             specifications: payment.productId?.specifications,
//           },
//         });
  
//         payment.notificationSent = true;
//         await payment.save();
  
//         console.log("Notification saved:", notification);
//         return res.json({ message: "Payment approved and buyer + product details sent to seller", payment, notification });
//       } else {
//         console.log("Notification already sent for this payment.");
//         return res.json({ message: "Payment already approved and notification sent", payment });
//       }
//     } catch (error) {
//       console.error("Error approving payment:", error);
//       res.status(500).json({ message: "Error approving payment", error: error.message });
//     }
//   });

router.post("/approve-payment/:paymentId", authorization, adminOnly, async (req, res) => {
    try {
      const paymentId = req.params.paymentId;
      console.log("Approving payment:", paymentId);
  
      const payment = await ProductPayment.findById(paymentId)
        .populate("buyerId", "name email phone companyName gstNumber warehouseLocation")
        .populate({
          path: "productId",
          select: "name description price images stock unit category brand features specifications",
          populate: { path: "sellerId", select: "_id name email phone" },
        });
  
      if (!payment) return res.status(404).json({ message: "Payment not found" });
      if (!payment.productId?.sellerId)
        return res.status(400).json({ message: "Seller not found for this product" });
  
      // ✅ Approve if not already
      if (!payment.adminApproved) {
        payment.adminApproved = true;
        await payment.save();
      }
  
      const sellerId = payment.productId.sellerId._id;
  
      // ✅ Create notification if not sent already
      if (!payment.notificationSent) {
        const notification = await Notification.create({
          userId: sellerId,
          message: `Buyer ${payment.buyerId.name} is approved to buy ${payment.productId.name}.`,
          type: "payment",
  
          buyerDetails: {
            _id: payment.buyerId._id,  // ✅ Store Buyer ID
            name: payment.buyerId?.name,
            email: payment.buyerId?.email,
            phone: payment.buyerId?.phone,
            companyName: payment.buyerId?.companyName,
            gstNumber: payment.buyerId?.gstNumber,
            warehouseLocation: payment.buyerId?.warehouseLocation,
          },
  
          productDetails: {
            _id: payment.productId._id,
            sellerId: payment.productId.sellerId._id,
            name: payment.productId?.name,
            description: payment.productId?.description,
            price: payment.productId?.price,
            images: payment.productId?.images,
            stock: payment.productId?.stock,
            unit: payment.productId?.unit,
            category: payment.productId?.category,
            brand: payment.productId?.brand,
            features: payment.productId?.features,
            specifications: payment.productId?.specifications,
            pricePaidPercent: payment.pricePaidPercent || 0,
            razorpayPaymentId: payment.razorpayPaymentId || "",
          },
        });
  
        payment.notificationSent = true;
        await payment.save();
  
        console.log("Notification saved:", notification);
        return res.json({
          message: "Payment approved and buyer + product details sent to seller",
          payment,
          notification,
        });
      } else {
        console.log("Notification already sent for this payment.");
        return res.json({
          message: "Payment already approved and notification sent",
          payment,
        });
      }
    } catch (error) {
      console.error("Error approving payment:", error);
      res.status(500).json({ message: "Error approving payment", error: error.message });
    }
  });
  
  
  
  
  
  
  
module.exports = router;
