const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    details: { type: String, default: "" },
    description: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Withdraw", withdrawSchema);
