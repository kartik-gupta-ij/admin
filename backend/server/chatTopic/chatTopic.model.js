const mongoose = require("mongoose");

const chatTopicSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

chatTopicSchema.index({ senderId: 1 });
chatTopicSchema.index({ receiverId: 1 });
chatTopicSchema.index({ chat: 1 });

module.exports = mongoose.model("ChatTopic", chatTopicSchema);
