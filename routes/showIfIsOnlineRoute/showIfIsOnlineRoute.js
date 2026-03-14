const express = require("express");
require("dotenv").config();
const router = express.Router();
const supabase = require("../../config/supabaseClient");
router.get("/", async (req, res) => {
  const { id } = req.query;
  try {
    const { data, error } = await supabase
      .from("user")
      .select("is_online")
      .eq("id", id);

    if (error) {
      res.status(500).json({ message: "Internal server error" });
    }
    const isOnline = data[0].is_online;
    res.json({ isOnline: isOnline });
  } catch (error) {
    console.error("Error fetching isOnline status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
