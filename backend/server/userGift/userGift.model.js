const mongoose = require("mongoose");

const userGiftSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    giftId: { type: mongoose.Schema.Types.ObjectId, ref: "Gift" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userGiftSchema.index({ postId: 1 });
userGiftSchema.index({ userId: 1 });
userGiftSchema.index({ giftId: 1 });

module.exports = mongoose.model("UserGift", userGiftSchema);
