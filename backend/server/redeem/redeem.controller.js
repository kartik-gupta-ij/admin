const Redeem = require("./redeem.model");
const User = require("../user/user.model");
const History = require("../history/history.model");

//day.js
const dayjs = require("dayjs");

//mongoose
const mongoose = require("mongoose");

const admin = require("../../util/privateKey");

// get redeem list [frontend]
exports.index = async (req, res) => {
  try {
    if (!req.query.type) {
      return res.status(200).json({ status: false, message: "Type is Required!" });
    }

    let redeem;
    if (req.query.type.trim() === "pending") {
      redeem = await Redeem.find({ status: 0 }).populate("userId", "name profileImage country").sort({ createdAt: -1 });
    }
    if (req.query.type.trim() === "solved") {
      redeem = await Redeem.find({ status: 1 }).populate("userId", "name profileImage country").sort({ createdAt: -1 });
    }
    if (req.query.type.trim() === "decline") {
      redeem = await Redeem.find({ status: 2 }).populate("userId", "name profileImage country").sort({ createdAt: -1 });
    }

    if (!redeem) {
      return res.status(200).json({ status: false, message: "No data Found!" });
    }

    return res.status(200).json({ status: true, message: "Success!!", redeem });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// get user redeem list
exports.userRedeem = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);

    const [user, redeem] = await Promise.all([
      User.findById(userId),

      Redeem.aggregate([
        {
          $match: { userId: { $eq: userId } },
        },
        {
          $project: {
            _id: 1,
            status: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "Accepted" },
                  { case: { $eq: ["$status", 2] }, then: "Declined" },
                ],
                default: "Pending",
              },
            },
            userId: 1,
            description: 1,
            diamond: 1,
            paymentGateway: 1,
            date: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]),
    ]);

    if (!user) {
      return res.status(200).json({ status: false, message: "user does not Exist!" });
    }

    if (!redeem) {
      return res.status(200).json({ status: false, message: "Data not Found!" });
    }

    let now = dayjs();
    const redeemList = redeem.map((data) => ({
      ...data,
      time:
        now.diff(data.date, "minute") <= 60 && now.diff(data.date, "minute") >= 0
          ? now.diff(data.date, "minute") + " minutes ago"
          : now.diff(data.date, "hour") >= 24
          ? dayjs(data.date).format("DD MMM, YYYY")
          : now.diff(data.date, "hour") + " hour ago",
    }));

    return res.status(200).json({
      status: redeemList.length > 0 ? true : false,
      message: redeemList.length > 0 ? "Success!" : "No Data Found",
      redeem: redeemList.length > 0 ? redeemList : [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// create redeem request
exports.store = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.paymentGateway || !req.body.description || !req.body.diamond) return res.status(200).json({ status: false, message: "Invalid Details!!" });

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "user does not Exist!" });
    }

    if (req.body.diamond > user.diamond) {
      return res.status(200).json({ status: false, message: "Not Enough Diamond for CaseOut." });
    }

    const redeem = new Redeem();
    redeem.userId = user._id;
    redeem.description = req.body.description.trim();
    redeem.diamond = parseInt(req.body.diamond);
    redeem.paymentGateway = req.body.paymentGateway;
    redeem.date = new Date().toLocaleString();

    user.diamond -= parseInt(req.body.diamond);
    user.withdrawalDiamond += parseInt(req.body.diamond);

    await Promise.all([user.save(), redeem.save()]);

    res.status(200).json({ status: true, message: "Success" });

    if (user && !user.isBlock && user.fcm_token !== null) {
      const adminPromise = await admin;

      const payload = {
        token: user?.fcm_token,
        notification: {
          title: "Redeem Request Submitted Successfully",
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
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// accept or decline the redeem request
exports.update = async (req, res) => {
  try {
    const redeem = await Redeem.findById(req.params.redeemId);

    const user = await User.findById(redeem.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "user does not found." });
    }

    let payload;
    if (req.query.type === "accept") {
      if (redeem.status == 1) {
        return res.status(200).json({ status: false, message: "Withdrawal request already accepted by the admin." });
      }

      if (redeem.status == 2) {
        return res.status(200).json({ status: false, message: "Withdrawal request already declined by the admin." });
      }

      redeem.status = 1;

      user.withdrawalDiamond -= parseInt(redeem.diamond);

      const outgoing = new History();
      outgoing.userId = user._id;
      outgoing.diamond = parseInt(redeem.diamond);
      outgoing.type = 4;
      outgoing.isIncome = false;
      outgoing.date = new Date().toLocaleString();

      await Promise.all([user.save(), outgoing.save(), redeem.save()]);

      if (user.fcm_token !== null) {
        payload = {
          token: user.fcm_token,
          notification: {
            title: "Your redeem request has been accepted!",
          },
        };
      }
    } else {
      if (redeem.status == 1) {
        return res.status(200).json({ status: false, message: "Withdrawal request already accepted by the admin." });
      }

      if (redeem.status == 2) {
        return res.status(200).json({ status: false, message: "Withdrawal request already declined by the admin." });
      }

      redeem.status = 2;

      user.withdrawalDiamond -= parseInt(redeem.diamond);
      user.diamond += parseInt(redeem.diamond);

      await Promise.all([user.save(), redeem.save()]);

      if (user.fcm_token !== null) {
        payload = {
          to: user.fcm_token,
          notification: {
            title: "Your redeem request is declined!",
          },
        };
      }
    }

    if (user && !user.isBlock && user.fcm_token !== null) {
      const adminPromise = await admin;

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

    return res.status(200).json({ status: true, message: "success", redeem });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
