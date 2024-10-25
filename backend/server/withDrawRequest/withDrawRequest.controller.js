const WithdrawRequest = require("./withDrawRequest.model");
const User = require("../user/user.model");
const History = require("../history/history.model");

const mongoose = require("mongoose");

const admin = require("../../util/privateKey");

// get withdrawRequest list [admin]
exports.adminIndex = async (req, res) => {
  try {
    if (!req.query.type) {
      return res.status(200).json({ status: false, message: "Type is Required!" });
    }

    let withdrawRequest;
    if (req.query.type.trim() === "pending") {
      withdrawRequest = await WithdrawRequest.find({ status: 0 }).populate("userId", "name profileImage country").sort({ createdAt: -1 });
    }

    if (req.query.type.trim() === "solved") {
      withdrawRequest = await WithdrawRequest.find({ status: 1 }).populate("userId", "name profileImage country").sort({ createdAt: -1 });
    }

    if (req.query.type.trim() === "decline") {
      withdrawRequest = await WithdrawRequest.find({ status: 2 }).populate("userId", "name profileImage country").sort({ createdAt: -1 });
    }

    return res.status(200).json({ status: true, message: "Success!!", withdrawRequest });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// statusUpdate by admin
exports.requestAccept = async (req, res) => {
  try {
    if (!req.query.withdrawRequestId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const withdrawRequest = await WithdrawRequest.findById(req.query.withdrawRequestId);
    if (!withdrawRequest) {
      return res.status(200).json({ status: false, message: "withdraw Request doesn't Exist." });
    }

    const user = await User.findById(withdrawRequest?.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "user does not found." });
    }

    if (withdrawRequest.status == 1) {
      return res.status(200).json({ status: false, message: "withdraw Request already accepted by the admin." });
    }

    if (withdrawRequest.status == 2) {
      return res.status(200).json({ status: false, message: "withdraw Request already declined by the admin." });
    }

    user.diamond = user.diamond > withdrawRequest?.diamond ? user.diamond - withdrawRequest?.diamond : 0;

    const outgoing = new History();
    outgoing.userId = user._id;
    outgoing.diamond = withdrawRequest?.diamond;
    outgoing.type = 4;
    outgoing.isIncome = false;
    outgoing.date = new Date().toLocaleString();

    withdrawRequest.status = 1;

    await Promise.all([user.save(), outgoing.save(), withdrawRequest.save()]);

    res.status(200).json({ status: true, message: "Withdrawal Request Accepted.", withdrawRequest });

    if (user && !user.isBlock && user.fcm_token !== null) {
      const adminPromise = await admin;

      const payload = {
        token: user?.fcm_token,
        notification: {
          title: "Withdrawal Request Accepted",
          body: `Dear ${user?.name}, your withdrawal request has been accepted. Please check your account for further details.`,
        },
      };

      adminPromise
        .messaging()
        .send(payload)
        .then(async (response) => {
          console.log("Successfully sent with response: ", response);
        })
        .catch((error) => {
          console.log("Error sending message:      ", error);
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error!!" });
  }
};

// request decline by admin
exports.requestDecline = async (req, res) => {
  try {
    if (!req.query.withdrawRequestId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const withdrawRequest = await WithdrawRequest.findById(req.query.withdrawRequestId);
    if (!withdrawRequest) {
      return res.status(200).json({ status: false, message: "withdrawRequest doesn't Exist !!" });
    }

    if (withdrawRequest.status == 1) {
      return res.status(200).json({ status: false, message: "withdraw Request already accepted by the admin." });
    }

    if (withdrawRequest.status == 2) {
      return res.status(200).json({ status: false, message: "withdraw Request already declined by the admin." });
    }

    withdrawRequest.status = 2;
    await withdrawRequest.save();

    return res.status(200).json({ status: true, message: "Success!!", withdrawRequest });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res.status(500).json({ status: false, error: error.message || "Server Error!!" });
  }
};

//Get WithdrawRequest by user
exports.index = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const userId = new mongoose.Types.ObjectId(req.query.userId);

    const [user, withdrawRequest] = await Promise.all([User.findById(userId), WithdrawRequest.find({ userId: userId }).sort({ _id: -1 })]);

    if (!user) {
      return res.status(200).json({ status: false, message: "user does not found." });
    }

    return res.status(200).json({ status: true, message: "Success!!", withdrawRequest });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error!!" });
  }
};

//Create Withdraw
exports.store = async (req, res) => {
  try {
    if (!req.body.diamond || !req.body.details || !req.body.paymentGateway || !req.body.userId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const userId = new mongoose.Types.ObjectId(req.body.userId);

    const [user, withdrawRequestExist] = await Promise.all([User.findById(userId), WithdrawRequest.findOne({ userId: userId, status: 0 })]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User does not Exist !!" });
    }

    if (withdrawRequestExist) {
      return res.status(200).json({ status: false, message: "WithdrawRequest is exist !!" });
    }

    if (user?.diamond < parseInt(req.body.diamond)) {
      return res.status(200).json({ status: false, message: "You don't have enough Diamond !!" });
    }

    const withdrawRequest = new WithdrawRequest();
    withdrawRequest.userId = req.body.userId;
    withdrawRequest.details = req.body.details;
    withdrawRequest.diamond = parseInt(req.body.diamond);
    withdrawRequest.paymentGateway = req.body.paymentGateway;
    withdrawRequest.status = 0;
    withdrawRequest.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    await withdrawRequest.save();

    res.status(200).json({
      status: true,
      message: "withdrawRequest Create Successfully..!",
      withdrawRequest,
    });

    if (user && !user.isBlock && user.fcm_token !== null) {
      const adminPromise = await admin;

      const payload = {
        token: user?.fcm_token,
        notification: {
          title: "Withdraw Request Submitted Successfully",
          body: `Dear ${user?.name}, we are pleased to inform you that your redeem request has been successfully processed.`,
        },
      };

      adminPromise
        .messaging()
        .send(payload)
        .then(async (response) => {
          console.log("Successfully sent with response: ", response);
        })
        .catch((error) => {
          console.log("Error sending message:      ", error);
        });
    }
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

//Update Withdraw
exports.update = async (req, res) => {
  try {
    if (!req.query.withdrawRequestId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const withdrawRequest = await WithdrawRequest.findById(req.query.withdrawRequestId);
    if (!withdrawRequest) {
      return res.status(200).json({ status: false, message: "withdraw does not exist!!" });
    }

    if (withdrawRequest.status == 1) {
      return res.status(200).json({ status: false, message: "Withdrawal request already accepted by the admin." });
    }

    if (withdrawRequest.status == 2) {
      return res.status(200).json({ status: false, message: "Withdrawal request already declined by the admin." });
    }

    const user = await User.findById(withdrawRequest.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User is not exist !! " });
    }

    if (req.body.diamond) {
      if (user?.diamond < parseInt(req.body.diamond)) {
        return res.status(200).json({ status: false, message: "You don't have enough Diamond !!" });
      }

      withdrawRequest.diamond = parseInt(req.body.diamond);
    }

    withdrawRequest.details = req.body.details ? req.body.details : withdrawRequest.details;
    withdrawRequest.paymentGateway = req.body.paymentGateway ? req.body.paymentGateway : withdrawRequest.paymentGateway;
    await withdrawRequest.save();

    return res.status(200).json({
      status: true,
      message: "withdrawRequest Updated Successfully..!",
      withdrawRequest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

//Delete Withdraw
exports.delete = async (req, res) => {
  if (!req.query.withdrawRequestId) {
    return res.status(200).json({ status: false, message: "Oops ! Invalid Details!!" });
  }

  const withdrawRequest = await WithdrawRequest.findById(req.query.withdrawRequestId);
  if (!withdrawRequest) {
    return res.status(200).json({ status: false, message: "withdrawRequest does not exist!!" });
  }

  if (withdrawRequest && withdrawRequest.status == 1) {
    return res.status(200).json({ status: false, message: "withdrawRequest already approved!!" });
  }

  await withdrawRequest.deleteOne();

  return res.status(200).json({ status: true, message: "Success!!" });
};
