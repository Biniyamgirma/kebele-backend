const express = require("express");
const router = express.Router();
const authmiddleware = require("../../middleware/authMiddleware");
const { hashPassword } = require("../../utils/utils");
const supabase = require("../../config/supabaseClient");
require("dotenv").config();
let pool;
//@add admin user
// @route POST /addUserAdmin
// @access Public
router.post("/", async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    password,
    role,
    category,
    honorifics,
  } = req.body;
  if (!firstName || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    let is_online = 0;
    const hashedPassword = await hashPassword(password);
    const { data, error } = await supabase.from("user").insert([
      {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        password: hashedPassword,
        role: role,
        is_online: is_online,
        category: category,
        honorifics: honorifics,
      },
    ]);
    if (error) {
      res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({ message: "User added successfully", userId: data });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
