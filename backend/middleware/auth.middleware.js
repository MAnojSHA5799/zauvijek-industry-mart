const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User.model");

const authorization = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, "anysecretkey", (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(401).send({ message: "Invalid token" });
            } else if (decoded) {
                req.body.user = decoded.UserId;
                req.userId = decoded.UserId;
                next();
            } else {
                res.status(401).send({ message: "You have to login first" });
            }
        });
    } else {
        res.status(401).send({ message: "You have to login first" });
    }
};


// Role-based authorization middleware
const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await UserModel.findById(req.userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            
            if (user.status !== 'approved') {
                return res.status(403).send({ message: "Account not approved yet" });
            }
            
            if (!roles.includes(user.role)) {
                return res.status(403).send({ message: "Access denied. Insufficient permissions." });
            }
            
            req.user = user;
            next();
        } catch (error) {
            res.status(500).send({ message: "Authorization error", error: error.message });
        }
    };
};

// Admin only middleware
const adminOnly = authorizeRoles('admin');

// Seller only middleware
const sellerOnly = authorizeRoles('seller');

// Buyer only middleware
const buyerOnly = authorizeRoles('buyer');

// Seller or Admin middleware
const sellerOrAdmin = authorizeRoles('seller', 'admin');

module.exports = { authorization, authorizeRoles, adminOnly, sellerOnly, buyerOnly, sellerOrAdmin };