const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

blockSchema.index({ from: 1 });
blockSchema.index({ to: 1 });

module.exports = mongoose.model("Block", blockSchema);
