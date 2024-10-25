const mongoose = require("mongoose");

const WithdrawRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    diamond: { type: Number, require: true },
    status: { type: Number, default: 0 }, // 0 : pending , 1 : Approve , 2 : decline
    paymentGateway: String,
    details: { type: String, default: "" },
    date: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

WithdrawRequestSchema.index({ userId: 1 });

module.exports = mongoose.model("WithdrawRequest", WithdrawRequestSchema);
