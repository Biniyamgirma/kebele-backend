const express = require("express");
const router = express.Router();
const supabase = require("../../config/supabaseClient");
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("news")
      .delete("*")
      .eq("id", id);
    if (error) {
      return res.status(400).json({ message: "error occured" });
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
