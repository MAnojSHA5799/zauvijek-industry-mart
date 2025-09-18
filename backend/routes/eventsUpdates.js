// routes/eventsUpdates.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET /api/events
router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "industry or factory",
        sortBy: "publishedAt",
        language: "en",
        pageSize: 10,
        apiKey: process.env.NEWSAPI_KEY, // ⚠ Keep key secret in .env
      },
    });

    // Optional: filter results strictly for metal/iron industry
    // const filteredEvents = response.data.articles.filter((article) =>
    //   /(steel|iron|metal|scrap|iron casting)/i.test(
    //     article.title + article.description
    //   )
    // );

    res.json(response.data.articles);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

module.exports = router;
