const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8090;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,// adjusted the cors environment variable and this will work
    credentials: true, // Allow cookies to be sent
  }),
);

app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.locals.errors = [];
  next();
});
app.use(express.json());
app.use("/getAllAdminUser", require("./routes/getAllAdmin/getAllAdminRoute"));
app.use("/addUser", require("./routes/addUserRoute/addUserAdminRoute")); /// i should work on or remove
app.use("/api", require("./routes/loginRoute/loginRoute")); //working loging
app.use("/news", require("./routes/addNewsRoute/addNewsRoute"));
app.use(
  "/changeIsOnline",
  require("./routes/changeIsOnlineStatusRoute/changeIsOnlineStatusRoute"),
);
app.use(
  "/isOnline",
  require("./routes/showIfIsOnlineRoute/showIfIsOnlineRoute"),
);
app.use(
  "/specificNews",
  require("./routes/selectSpecificNewsRoute/selectSpecificNewsRoute"),
);
app.use("/editNews", require("./routes/editNewsRoute/editNewsRoute"));
app.use("/deleteNews", require("./routes/deleteNewsRoute/deleteNewsRoute"));
app.use("/getAllNews", require("./routes/newsRoute/newsRoute"));
app.use("/addNews", require("./routes/addNewsRoute/addNewsRoute"));

app.use("/", require("./routes/test/testRoute"));
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
