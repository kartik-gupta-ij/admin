const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

likeSchema.index({ postId: 1 });
likeSchema.index({ userId: 1 });

module.exports = mongoose.model("Like", likeSchema);