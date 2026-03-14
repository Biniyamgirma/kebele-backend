const express = require("express");
const router = express.Router();
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const supabase = require("../../config/supabaseClient");
router.put("/", async (req, res) => {
  let { isOnline, id } = req.body;
  if (typeof isOnline !== "number") {
    return res.status(400).json({ error: "Invalid isOnline value" });
  }
  try {
    const { data, error } = await supabase
      .from("user")
      .update({ is_online: isOnline })
      .eq("id", id);
    res.json({ message: "is online status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
