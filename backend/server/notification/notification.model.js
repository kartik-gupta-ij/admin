const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    type: { type: Number, enum: [0, 1, 2, 3, 4], default: 0 }, // 0: followers , 1: like , 2: gift, 3: comment, 4: admin
    friends: { type: Boolean, default: false },
    postImage: { type: String, default: null },
    comment: { type: String, default: null },
    giftImage: { type: String, default: null },
    title: { type: String, default: null },
    message: { type: String, default: null },
    image: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({ receiverId: 1 });
notificationSchema.index({ userId: 1 });
notificationSchema.index({ from: 1 });
notificationSchema.index({ to: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
