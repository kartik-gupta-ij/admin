const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    friends: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

followSchema.index({ from: 1 });
followSchema.index({ to: 1 });

module.exports = mongoose.model("Follow", followSchema);
