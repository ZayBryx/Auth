require("express-async-errors");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const app = express();

const port = process.env.PORT || 2024;
const db = process.env.DB_URI;

const customErrorMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

// setup a allowed origin
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.disable("x-powered-by");

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.get("/api/test", (req, res) => {
  const authorization = req.headers.authorization;
  const cookie = req.cookies["jwt"];
  console.log(authorization);
  console.log(cookie);
  res.status(200).json({ authorization, cookie });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/account", require("./routes/accountRoute"));
app.use("/api/admin", require("./routes/adminRoute"));

app.use(customErrorMiddleware);
app.use(notFoundMiddleware);

app.listen(port, async () => {
  await mongoose.connect(db);
  console.log(`Listening on http://localhost:${port}/`);
});
