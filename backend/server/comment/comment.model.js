const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: String,
    date: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

commentSchema.index({ postId: 1 });
commentSchema.index({ userId: 1 });

module.exports = mongoose.model("Comment", commentSchema);
