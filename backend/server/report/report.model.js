const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    report: String,
    reportType: Number, // 0:postReport , 1 : UserReport
    image: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reportSchema.index({ postId: 1 });
reportSchema.index({ profileId: 1 });
reportSchema.index({ userId: 1 });

module.exports = mongoose.model("Report", reportSchema);
