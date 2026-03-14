const { connectWithConnector } = require("./config/config");
// Wrap in an async function to use await properly
require("dotenv").config();
const startApp = async () => {
  try {
    const pool = await connectWithConnector();
    const [rows] = await pool.query("SELECT NOW()");
    console.log("Database Time:", rows);
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};

startApp();

module.exports = startApp;
