const express = require("express");
const { authorization, sellerOnly } = require("../middleware/auth.middleware");
const ProductModel = require("../models/product.model");
const OrderModel = require("../models/order.model");
const { UserModel } = require("../models/User.model");
const multer = require("multer");
const router = express.Router();
const path = require("path"); // ✅ add this line
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
router.post(
    "/products",
    authorization,
    sellerOnly,
    upload.single("image"), // yahan "image" frontend se match karega
    async (req, res) => {
      try {
        const {
          name,
          description,
          price,
          stock,
          category,
          brand,
          specifications,
          minOrderQuantity,
          maxOrderQuantity,
        } = req.body;
  
        // Agar file mila hai to path set karo
        const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;
  
        const product = new ProductModel({
          name,
          description,
          price,
          images: imagePath ? [imagePath] : [],
          stock,
          category,
          sellerId: req.userId,
          brand,
          specifications: specifications || {},
          minOrderQuantity: minOrderQuantity || 1,
          maxOrderQuantity: maxOrderQuantity || 1000,
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
router.delete("/products/:id", authorization, sellerOnly, async (req, res) => {
    try {
        const productId = req.params.id;
        const sellerId = req.userId;
        
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

module.exports = router;
