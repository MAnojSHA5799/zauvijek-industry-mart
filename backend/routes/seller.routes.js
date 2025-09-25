const express = require("express");
const { authorization, sellerOnly } = require("../middleware/auth.middleware");
const ProductModel = require("../models/product.model");
const OrderModel = require("../models/order.model");
const { UserModel } = require("../models/User.model");
const NotificationModel = require("../models/notification.model");
const multer = require("multer");
const router = express.Router();
const path = require("path"); // ✅ add this line
const Razorpay = require("razorpay");
const Notification = require("../models/notification.model");
// const { authorization } = require("../middleware/auth.middleware");
// 🖼 Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/products"); // folder bana lo project ke andar
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });

// Get seller dashboard data
router.get("/dashboard", authorization, sellerOnly, async (req, res) => {
    try {
        const sellerId = req.userId;
        
        // Get seller's products count
        const totalProducts = await ProductModel.countDocuments({ sellerId });
        const approvedProducts = await ProductModel.countDocuments({ sellerId, status: 'approved' });
        const pendingProducts = await ProductModel.countDocuments({ sellerId, status: 'pending' });
        
        // Get orders count
        const totalOrders = await OrderModel.countDocuments({ sellerId });
        const pendingOrders = await OrderModel.countDocuments({ sellerId, status: 'pending' });
        const shippedOrders = await OrderModel.countDocuments({ sellerId, status: 'shipped' });
        
        // Get recent orders
        const recentOrders = await OrderModel.find({ sellerId })
            .populate('buyerId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.send({
            summary: {
                totalProducts,
                approvedProducts,
                pendingProducts,
                totalOrders,
                pendingOrders,
                shippedOrders
            },
            recentOrders
        });
    } catch (error) {
        res.status(500).send({ message: "Error fetching dashboard data", error: error.message });
    }
});

// Add new product
// router.post("/products", authorization, sellerOnly, async (req, res) => {
//     try {
//         const { name, description, price, images, stock, category, brand, specifications, minOrderQuantity, maxOrderQuantity } = req.body;
        
//         const product = new ProductModel({
//             name,
//             description,
//             price,
//             images: images || [],
//             stock,
//             category,
//             sellerId: req.userId,
//             brand,
//             specifications: specifications || {},
//             minOrderQuantity: minOrderQuantity || 1,
//             maxOrderQuantity: maxOrderQuantity || 1000
//         });
        
//         await product.save();
//         res.send({ message: "Product added successfully", product });
//     } catch (error) {
//         res.status(500).send({ message: "Error adding product", error: error.message });
//     }
// });

// ➕ Add new product
// router.post(
//     "/products",
//     authorization,
//     sellerOnly,
//     upload.single("image"), // yahan "image" frontend se match karega
//     async (req, res) => {
//       try {
//         const {
//           name,
//           description,
//           price,
//           stock,
//           category,
//           brand,
//           specifications,
//           minOrderQuantity,
//           maxOrderQuantity,
//         } = req.body;
  
//         // Agar file mila hai to path set karo
//         const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;
  
//         const product = new ProductModel({
//           name,
//           description,
//           price,
//           images: imagePath ? [imagePath] : [],
//           stock,
//           category,
//           sellerId: req.userId,
//           brand,
//           specifications: specifications || {},
//           minOrderQuantity: minOrderQuantity || 1,
//           maxOrderQuantity: maxOrderQuantity || 1000,
//         });
  
//         await product.save();
//         res.send({ message: "Product added successfully", product });
//       } catch (error) {
//         res.status(500).send({ message: "Error adding product", error: error.message });
//       }
//     }
//   );

// router.post(
//     "/products",
//     authorization,
//     sellerOnly,
//     upload.single("image"), 
//     async (req, res) => {
//       try {
//         const {
//           name,
//           description,
//           price,
//           stock,
//           category,
//           brand,
//           features,
//           specifications,
//           minOrderQuantity,
//           maxOrderQuantity,
//         } = req.body;
  
//         const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;
  
//         const product = new ProductModel({
//           name,
//           description,
//           price,
//           images: imagePath ? [imagePath] : [],
//           stock,
//           category,
//           sellerId: req.userId,
//           brand,
  
//           // ✅ handle features (convert CSV string to array if needed)
//           features: Array.isArray(features) ? features : features ? features.split(",") : [],
  
//           // ✅ structured specifications
//           specifications: specifications
//             ? JSON.parse(specifications) // frontend will send JSON string
//             : {},
  
//           minOrderQuantity: minOrderQuantity || 1,
//           maxOrderQuantity: maxOrderQuantity || 1000,
//         });
  
//         await product.save();
//         res.send({ message: "Product added successfully", product });
//       } catch (error) {
//         res.status(500).send({ message: "Error adding product", error: error.message });
//       }
//     }
//   );


router.post(
    "/products",
    authorization,
    sellerOnly,
    upload.single("image"), 
    async (req, res) => {
      try {
        const {
          name,
          description,
          price,
          stock,
          unit,          // ✅ new field
          category,
          brand,
          features,
          specifications,
          minOrderQuantity,
          maxOrderQuantity,
          condition, // ✅ existing field
        } = req.body;
  
        const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;
  
        const product = new ProductModel({
          name,
          description,
          price,
          images: imagePath ? [imagePath] : [],
          stock,
          unit,          // ✅ save unit
          category,
          sellerId: req.userId,
          brand,
  
          // ✅ handle features (convert CSV string to array if needed)
          features: Array.isArray(features) ? features : features ? features.split(",") : [],
  
          // ✅ structured specifications
          specifications: specifications
            ? JSON.parse(specifications) // frontend sends JSON string
            : {},
  
          minOrderQuantity: minOrderQuantity || 1,
          maxOrderQuantity: maxOrderQuantity || 1000,
  
          condition: condition || "New", // ✅ default condition
        });
  
        await product.save();
        res.send({ message: "Product added successfully", product });
      } catch (error) {
        res.status(500).send({ message: "Error adding product", error: error.message });
      }
    }
  );
  
  
  
  

// Get seller's products
router.get("/products", authorization, sellerOnly, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const sellerId = req.userId;
        
        let query = { sellerId };
        if (status) {
            query.status = status;
        }
        
        const products = await ProductModel.find(query)
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

// Update product
router.put("/products/:id", authorization, sellerOnly, async (req, res) => {
    try {
        const productId = req.params.id;
        const sellerId = req.userId;
        
        const product = await ProductModel.findOne({ _id: productId, sellerId });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { ...req.body, status: 'pending' }, // Reset status to pending when updated
            { new: true }
        );
        
        res.send({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).send({ message: "Error updating product", error: error.message });
    }
});

// Delete product
router.delete("/seller/products/:id", authorization, sellerOnly, async (req, res) => {
    try {
        console.log(req.body)
      const productId = req.params.id;
      const sellerId = req.userId; // token se aana chahiye
  
      const product = await ProductModel.findOne({ _id: productId, sellerId });
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
  
      await ProductModel.findByIdAndDelete(productId);
      res.send({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: "Error deleting product", error: error.message });
    }
  });
  
  

// Get seller's orders
router.get("/orders", authorization, sellerOnly, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const sellerId = req.userId;
        
        let query = { sellerId };
        if (status) {
            query.status = status;
        }
        
        const orders = await OrderModel.find(query)
            .populate('buyerId', 'name email phone')
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

// Update order status
router.put("/orders/:id/status", authorization, sellerOnly, async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status, trackingNumber } = req.body;
        const sellerId = req.userId;
        
        const order = await OrderModel.findOne({ _id: orderId, sellerId });
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        
        const updateData = { status };
        if (trackingNumber) {
            updateData.trackingNumber = trackingNumber;
        }
        
        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updateData, { new: true })
            .populate('buyerId', 'name email phone');
        
        res.send({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).send({ message: "Error updating order status", error: error.message });
    }
});


// Seller notifications route
// GET seller notifications
router.get("/notifications", authorization, async (req, res) => {
  try {
    const sellerId = req.user.id; // ✅ matches middleware // matches the payload key in JWT
    console.log("Fetching notifications for seller:", sellerId);

    const notifications = await NotificationModel.find({ userId: sellerId })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

// seller.routes.js (or notification.routes.js)
router.get("/notifications/:id", authorization, async (req, res) => {
  try {
    const notif = await NotificationModel.findById(req.params.id);
    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notif);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notification detail", error: error.message });
  }
});




const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order for 2% payment
router.post("/pay-2percent/:notificationId", authorization, async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.productDetails.pricePaidPercent >= 2) {
      return res.status(400).json({ message: "Payment already completed" });
    }

    const amount = Math.round(notification.productDetails.price * 0.02 * 100); // 2% in paise

    const order = await razorpayInstance.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${notificationId}`,
    });

    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
  }
});

// ✅ Confirm Payment
router.post("/confirm-payment/:notificationId", authorization, async (req, res) => {
  try {
    const { razorpayPaymentId } = req.body;
    const notificationId = req.params.notificationId;

    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.productDetails.pricePaidPercent = 2;
    notification.productDetails.razorpayPaymentId = razorpayPaymentId;
    await notification.save();

    res.json({ message: "Payment confirmed", notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error confirming payment", error: error.message });
  }
});

module.exports = router;




module.exports = router;
