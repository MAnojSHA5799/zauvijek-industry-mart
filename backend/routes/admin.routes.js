const express = require("express");
const { authorization, adminOnly } = require("../middleware/auth.middleware");
const ProductModel = require("../models/product.model");
const OrderModel = require("../models/order.model");
const { UserModel } = require("../models/User.model");

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
        const { page = 1, limit = 40, status, category } = req.query;
        
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

module.exports = router;
