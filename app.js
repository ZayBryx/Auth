require("express-async-errors");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 2024;
const db = process.env.DB_URI;

const customErrorMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const authMiddleware = require("./middleware/auth");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send("<h1>TEST</h1>");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.get("/api/account", authMiddleware, (req, res) => {
  res.send(req.user);
});

app.use(customErrorMiddleware);
app.use(notFoundMiddleware);

app.listen(port, async () => {
  await mongoose.connect(db);
  console.log(`Listening on http://localhost:${port}/`);
});
