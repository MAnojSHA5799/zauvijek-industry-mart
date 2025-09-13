// routes/bannerRoutes.js
const express = require("express");
const multer = require("multer");
const Banner = require("../models/Banner");

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET latest banner
router.get("/", async (req, res) => {
    try {
      const banner = await Banner.findOne().sort({ createdAt: -1 }); // latest
      if (!banner) {
        return res.status(404).json({ message: "No banner found" });
      }
      res.json(banner);
    } catch (err) {
      console.error("Banner fetch error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
  

// POST /api/banner
router.post("/", upload.single("image"), async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);   // 🟢 Debug
      console.log("REQ FILE:", req.file);   // 🟢 Debug
  
      const banner = new Banner({
        title: req.body.title,
        subtitle: req.body.subtitle,
        offerText: req.body.offerText,
        buttonText: req.body.buttonText,
        buttonLink: req.body.buttonLink,
        image: req.file ? `/uploads/${req.file.filename}` : null,
      });
  
      await banner.save();
      res.status(201).json({ message: "Banner uploaded successfully", banner });
    } catch (err) {
      console.error("Banner save error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
