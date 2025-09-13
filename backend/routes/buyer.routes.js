const express = require("express");
const { authorization, buyerOnly } = require("../middleware/auth.middleware");
const ProductModel = require("../models/product.model");
const OrderModel = require("../models/order.model");

const router = express.Router();

// Get all approved products (for browsing)
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 40, category, search, minPrice, maxPrice } = req.query;
        
        let query = { status: 'approved' };
        
        if (category) {
            query.category = new RegExp(category, 'i');
        }
        
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { brand: new RegExp(search, 'i') }
            ];
        }
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
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

// Get product by ID
router.get("/products/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        
        const product = await ProductModel.findOne({ _id: productId, status: 'approved' })
            .populate('sellerId', 'name email phone');
        
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        
        res.send({ product });
    } catch (error) {
        res.status(500).send({ message: "Error fetching product", error: error.message });
    }
});

// Get product categories
router.get("/categories", async (req, res) => {
    try {
        const categories = await ProductModel.distinct('category', { status: 'approved' });
        res.send({ categories });
    } catch (error) {
        res.status(500).send({ message: "Error fetching categories", error: error.message });
    }
});

// Place order
router.post("/orders", authorization, buyerOnly, async (req, res) => {
    try {
        const { products, shippingAddress, paymentMethod, orderNotes } = req.body;
        const buyerId = req.userId;
        
        if (!products || products.length === 0) {
            return res.status(400).send({ message: "No products in order" });
        }
        
        // Validate products and calculate total
        let totalAmount = 0;
        const orderProducts = [];
        
        for (const item of products) {
            const product = await ProductModel.findOne({ 
                _id: item.productId, 
                status: 'approved',
                stock: { $gte: item.quantity }
            });
            
            if (!product) {
                return res.status(400).send({ 
                    message: `Product ${item.name || item.productId} not available or out of stock` 
                });
            }
            
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            
            orderProducts.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price,
                name: product.name
            });
        }
        
        // Create order for each seller
        const sellerOrders = {};
        
        for (const item of orderProducts) {
            const product = await ProductModel.findById(item.productId).populate('sellerId');
            const sellerId = product.sellerId._id;
            
            if (!sellerOrders[sellerId]) {
                sellerOrders[sellerId] = {
                    buyerId,
                    sellerId,
                    products: [],
                    totalAmount: 0,
                    shippingAddress,
                    paymentMethod: paymentMethod || 'cod',
                    orderNotes
                };
            }
            
            sellerOrders[sellerId].products.push(item);
            sellerOrders[sellerId].totalAmount += item.price * item.quantity;
        }
        
        // Create orders
        const createdOrders = [];
        for (const sellerId in sellerOrders) {
            const order = new OrderModel(sellerOrders[sellerId]);
            await order.save();
            createdOrders.push(order);
            
            // Update product stock
            for (const item of sellerOrders[sellerId].products) {
                await ProductModel.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } }
                );
            }
        }
        
        res.send({ 
            message: "Order placed successfully", 
            orders: createdOrders,
            totalOrders: createdOrders.length
        });
    } catch (error) {
        res.status(500).send({ message: "Error placing order", error: error.message });
    }
});

// Get buyer's orders
router.get("/orders", authorization, buyerOnly, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const buyerId = req.userId;
        
        let query = { buyerId };
        if (status) {
            query.status = status;
        }
        
        const orders = await OrderModel.find(query)
            .populate('sellerId', 'name email phone')
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

// Get order by ID
router.get("/orders/:id", authorization, buyerOnly, async (req, res) => {
    try {
        const orderId = req.params.id;
        const buyerId = req.userId;
        
        const order = await OrderModel.findOne({ _id: orderId, buyerId })
            .populate('sellerId', 'name email phone')
            .populate('products.productId', 'name images');
        
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        
        res.send({ order });
    } catch (error) {
        res.status(500).send({ message: "Error fetching order", error: error.message });
    }
});

// Cancel order
router.put("/orders/:id/cancel", authorization, buyerOnly, async (req, res) => {
    try {
        const orderId = req.params.id;
        const buyerId = req.userId;
        
        const order = await OrderModel.findOne({ _id: orderId, buyerId, status: 'pending' });
        if (!order) {
            return res.status(404).send({ message: "Order not found or cannot be cancelled" });
        }
        
        // Update order status
        await OrderModel.findByIdAndUpdate(orderId, { status: 'cancelled' });
        
        // Restore product stock
        for (const item of order.products) {
            await ProductModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: item.quantity } }
            );
        }
        
        res.send({ message: "Order cancelled successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error cancelling order", error: error.message });
    }
});

module.exports = router;
