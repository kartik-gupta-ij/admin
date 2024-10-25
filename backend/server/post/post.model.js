const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postImage: String,
    description: { type: String, default: null },
    date: String,
    isFake: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

postSchema.index({ userId: 1 });

module.exports = mongoose.model("Post", postSchema);
