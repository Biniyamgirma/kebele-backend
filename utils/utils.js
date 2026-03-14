const jwt = require("jsonwebtoken");
require("dotenv").config();
const bycrypt = require("bcryptjs");

const secretKey = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, firstName: user.first_name, role: user.role },
    secretKey,
    {
      expiresIn: "30d",
    },
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

const hashPassword = async (password) => {
  const salt = await bycrypt.genSalt(10);
  return bycrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bycrypt.compare(password, hashedPassword);
};

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };
