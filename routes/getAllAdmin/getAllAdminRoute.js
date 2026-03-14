const express = require("express");
const supabase = require("../../config/supabaseClient");
require("dotenv").config();
const router = express.Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("user").select("*");
  if (error) {
    res.status(500).json({ message: "Internal server error" });
  } else {
    res.json(
      data.map((user) => ({
        id: user.id || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        middleName: user.middle_name || "",
        admin: user.role || "",
        category: user.category || "",
        category: user.category || " ",
        isOnline: user.is_online || false,
        honorifics: user.honorifics || " ",
        image: user.image || "",
      })),
    );
  }
});

module.exports = router;
