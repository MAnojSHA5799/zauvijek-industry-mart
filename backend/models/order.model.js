const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    buyerId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    sellerId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    products: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        name: {type: String, required: true}
    }],
    totalAmount: {type: Number, required: true},
    status: {type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending'},
    shippingAddress: {
        name: {type: String, required: true},
        address: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        pincode: {type: String, required: true},
        phone: {type: String, required: true}
    },
    paymentMethod: {type: String, enum: ['cod', 'online'], default: 'cod'},
    paymentStatus: {type: String, enum: ['pending', 'paid', 'failed'], default: 'pending'},
    orderNotes: {type: String},
    trackingNumber: {type: String}
}, {
    versionKey: false,
    timestamps: true
});

const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;
