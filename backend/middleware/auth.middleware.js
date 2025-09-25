const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User.model");

// const authorization = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (token) {
//         console
//         jwt.verify(token, "anysecretkey", (err, decoded) => {
//             if (err) {
//                 console.log(err);
//                 res.status(401).send({ message: "Invalid token" });
//             } else if (decoded) {
//                 req.body.user = decoded.UserId;
//                 req.userId = decoded.UserId;
//                 next();
//             } else {
//                 res.status(401).send({ message: "You have to login first" });
//             }
//         });
//     } else {
//         res.status(401).send({ message: "You have to login first" });
//     }
// };

// const authorization1 = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     console.log("Raw token from header:", authHeader);

//     // Split "Bearer ..." and remove extra quotes
//     let token = authHeader.split(" ")[1];

//     // Remove surrounding quotes if present
//     token = token.replace(/^"(.*)"$/, '$1');

//     console.log("Token extracted:", token);

//     jwt.verify(token, "anysecretkey", (err, decoded) => {
//       if (err) {
//         console.log("JWT Error:", err);
//         return res.status(401).send({ message: "Invalid token" });
//       }

//       if (decoded) {
//         req.user = { id: decoded.UserId }; // attach user info properly
//         req.userId = decoded.UserId;
//         next();
//       } else {
//         res.status(401).send({ message: "You have to login first" });
//       }
//     });
//   } else {
//     res.status(401).send({ message: "You have to login first" });
//   }
// };


const authorization = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // No Authorization header
    return res.status(401).json({ message: "You have to login first" });
  } else {
    // console.log("Raw token from header:", authHeader);

    // Extract token from "Bearer <token>"
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader; // If token sent directly without Bearer
    }

    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      // Remove surrounding quotes if present
      token = token.replace(/^"(.*)"$/, '$1');
      // console.log("Token extracted:", token);

      jwt.verify(token, "anysecretkey", (err, decoded) => {
        if (err) {
          console.log("JWT Error:", err);
          return res.status(401).json({ message: "Invalid token" });
        } else if (decoded) {
          // Attach decoded info
          req.user = { id: decoded.UserId, role: decoded.role };
          req.userId = decoded.UserId;
          next();
        } else {
          return res.status(401).json({ message: "You have to login first" });
        }
      });
    }
  }
};

module.exports = { authorization };



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