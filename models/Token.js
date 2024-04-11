const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
