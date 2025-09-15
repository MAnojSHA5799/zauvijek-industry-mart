const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Auction = require("../models/Auction");

// ✅ Ensure uploads/auction folder exists
const uploadPath = path.join(__dirname, "../uploads/auction");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/auction/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ---------------- CRUD Routes ----------------

// Create auction
// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const { title, description, type, startDate, endDate } = req.body;

//     if (!title || !type || !startDate || !endDate) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     if (isNaN(start) || isNaN(end)) {
//       return res.status(400).json({ message: "Invalid date format" });
//     }

//     const status = end <= new Date() ? "expired" : "active";

//     const auction = new Auction({
//       title,
//       description,
//       type,
//       startDate: start,
//       endDate: end,
//       status,
//       imageUrl: req.file ? `/uploads/auction/${req.file.filename}` : null,
//     });

//     await auction.save();
//     res.status(201).json(auction);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post(
    "/",
    upload.fields([
      { name: "materialCertificate", maxCount: 1 },
      { name: "photos", maxCount: 10 },
    ]),
    async (req, res) => {
      try {
        const {
          title,              // Material Name
          materialGrade,      // Material Grade / Quality
          quantity,
          unit,
          description,
          auctionType,        // forward / backward
          startingPrice,
          bidIncrement,
          startDate,
          endDate,
          companyName,
          contactPerson,
          phone,
          email,
          pickupLocation,
          deliveryOption,
          terms,
        } = req.body;
  
        console.log("[Auction POST Body]:", req.body);
  
        // ✅ Validate required fields
        if (
          !title ||
          !quantity ||
          !startingPrice ||
          !startDate ||
          !endDate ||
          !companyName ||
          !contactPerson ||
          !phone ||
          !email ||
          !pickupLocation
        ) {
          return res.status(400).json({ message: "Missing required fields" });
        }
  
        const start = new Date(startDate);
        const end = new Date(endDate);
        const status = end <= new Date() ? "expired" : "active";
  
        const auction = new Auction({
          title,
          materialGrade,
          quantity,
          unit,
          description,
          type: auctionType,
          startingPrice,
          bidIncrement,
          startDate: start,
          endDate: end,
          status,
          companyName,
          contactPerson,
          phone,
          email,
          pickupLocation,
          deliveryOption,
          terms,
          materialCertificate: req.files?.materialCertificate
            ? `/uploads/auction/${req.files.materialCertificate[0].filename}`
            : null,
          photos: req.files?.photos
            ? req.files.photos.map((f) => `/uploads/auction/${f.filename}`)
            : [],
        });
  
        await auction.save();
        res.status(201).json(auction);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
  
  

// Get all auctions
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const auctions = await Auction.find(filter).sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single auction
router.get("/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    res.json(auction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update auction
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, type, startDate, endDate } = req.body;
    const update = {};

    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (type !== undefined) update.type = type;
    if (startDate !== undefined) update.startDate = new Date(startDate);
    if (endDate !== undefined) update.endDate = new Date(endDate);

    if (update.endDate) {
      update.status = update.endDate <= new Date() ? "expired" : "active";
    }

    if (req.file) update.imageUrl = `/uploads/auction/${req.file.filename}`;

    const auction = await Auction.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!auction) return res.status(404).json({ message: "Auction not found" });

    res.json(auction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete auction
router.delete("/:id", async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    res.json({ message: "Auction deleted", id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
