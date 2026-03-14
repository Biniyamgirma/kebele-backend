const express = require("express");
require("dotenv").config();
const router = express.Router();
const supabase = require("../../config/supabaseClient");
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("news").select("*");
  if (error) {
    res.status(500).json({ message: "Internal server error " });
  } else {
    res.json(
      data.map((news) => ({
        id: news.id,
        title: news.title,
        body: news.body,
        image: news.image,
        subHeading: news.simple_heading,
        date: news.created_at,
      })),
    );
  }
});

module.exports = router;
