const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    require: [true, "Name is required"],
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid Email",
    ],
  },
  password: {
    type: String,
    require: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

accountSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

accountSchema.methods.checkPassword = async function (inputPassword) {
  const isMatch = await bcrypt.compare(inputPassword, this.password);
  return isMatch;
};

accountSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    { userId: this._id, name: this.name, role: this.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "3min" }
  );
};

accountSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({ userId: this._id }, process.env.REFRESH_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = mongoose.model("Account", accountSchema);
