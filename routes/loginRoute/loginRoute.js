const express = require("express");
const router = express.Router();
const {
  generateToken,
  comparePassword,
  hashPassword,
} = require("../../utils/utils");
const supabase = require("../../config/supabaseClient");

//@desc   Login user
//@route  POST /api/users
//@access Public
router.post("/login", async (req, res) => {
  let { firstName, password } = req.body;
  if (!firstName || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
      firstName: firstName,
      password: password,
    });
  }
  try {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("first_name", firstName);
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    }

    const user = data[0];
    const { first_name, middle_name } = user;
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = generateToken(user);
    res.json({
      message: "Login successful",
      id: user.id,
      userFirstName: first_name,
      userMiddleName: middle_name,
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/addAdmin", async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    password,
    role,
    category,
    honorifics,
  } = req.body;

  if (
    !first_name ||
    !middle_name ||
    !last_name ||
    !password ||
    !role ||
    !category
  ) {
    res.status().json({
      message: "missing field",
    });
    return;
  }
  const hasedPassword = await hashPassword(password);
  const { data, error } = supabase.from("user").insert([
    {
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      password: hasedPassword,
      role: role,
      is_online: 0,
      category: category,
      honorifics: honorifics,
    },
  ]);
  res.status().json({ data: data });
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { data, error } = await supabase.from("user").delete().eq("id", id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: "User deleted successfully", id: id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
