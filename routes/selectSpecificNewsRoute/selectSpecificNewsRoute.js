const express = require("express");
const router = express.Router();
const supabase = require("../../config/supabaseClient");
router.get("/getNewsToEdit", async (req, res) => {
  const id = req.query.id;
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id);
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    if (pool) {
      pool.end();
    }
  }
});

module.exports = router;
