const History = require("../history/history.model");
const User = require("../user/user.model");
const Post = require("../post/post.model");
const Gift = require("../gift/gift.model");
const Notification = require("../notification/notification.model");
const UserGift = require("./userGift.model");

const mongoose = require("mongoose");

const admin = require("../../util/privateKey");

exports.sendGift = async (req, res) => {
  try {
    if (!req.query.postId || !req.query.userId || !req.query.giftId || !req.query.coin) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const postId = new mongoose.Types.ObjectId(req.query.postId);
    const giftId = new mongoose.Types.ObjectId(req.query.giftId);

    const [user, post, gift] = await Promise.all([User.findById(userId), Post.findById(postId), Gift.findById(giftId)]);

    if (!user) {
      return res.status(200).json({ status: false, message: "user does not found!!" });
    }

    if (!post) {
      return res.status(200).json({ status: false, message: "post does not found!!" });
    }

    if (!gift) {
      return res.status(200).json({ status: false, message: "gift does not found!!" });
    }

    if (user.coin < Number(req.query.coin)) {
      return res.status(200).json({ status: false, message: "user does not have sufficient coin!!!" });
    }

    const receiverId = await User.findById(post.userId);
    if (!receiverId) {
      return res.status(200).json({ status: false, message: "recevier user does not found!!" });
    }

    const userGift = new UserGift();
    userGift.postId = post._id;
    userGift.userId = user._id;
    userGift.giftId = gift._id;
    await userGift.save();

    //random coin
    //const number = await roundNumber(gift.coin);

    //user spend coin
    user.coin -= parseInt(req.query.coin);

    //user earn diamond
    receiverId.diamond += parseInt(req.query.coin);

    const userSpend = new History();
    userSpend.userId = user._id;
    userSpend.coin = parseInt(req.query.coin);
    userSpend.type = 0;
    userSpend.isIncome = false;
    userSpend.receiverId = receiverId._id;
    userSpend.giftId = gift._id;
    userSpend.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    const userEarn = new History();
    userEarn.receiverId = receiverId._id;
    userEarn.diamond = parseInt(req.query.coin);
    userEarn.type = 0;
    userEarn.isIncome = true;
    userEarn.userId = user._id;
    userEarn.giftId = gift._id;
    userEarn.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    await Promise.all([user.save(), receiverId.save(), userSpend.save(), userEarn.save()]);

    res.status(200).json({
      status: true,
      message: "Success",
      userGift,
    });

    if (receiverId.fcm_token !== null) {
      const adminPromise = await admin;

      const payload = {
        token: receiverId.fcm_token,
        notification: {
          body: post.description,
          title: user.name,
          image: user ? user.profileImage : "",
        },
        data: {
          type: "ADMIN",
        },
      };

      adminPromise
        .messaging()
        .send(payload)
        .then(async (response) => {
          console.log("Successfully sent with response: ", response);

          const notification = new Notification();
          notification.receiverId = receiverId._id;
          notification.type = 2;
          notification.userId = user._id;
          notification.giftImage = gift.image;
          await notification.save();
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
