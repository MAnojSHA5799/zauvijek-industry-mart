// models/Banner.js
const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: false },  // pehle true tha
    subtitle: String,
    offerText: String,
    buttonText: String,
    buttonLink: String,
    image: String,
  }, { timestamps: true });
  

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
