const User = require("../user/user.model");
const Notification = require("./notification.model");

const { baseURL } = require("../../config");

//mongoose
const mongoose = require("mongoose");

const admin = require("../../util/privateKey");

//add field in user model
exports.updateFCM = async (req, res) => {
  try {
    if (!req.query.fcm_token || !req.query.userId) {
      return res.status(200).json({
        status: false,
        message: "Invalid Details!",
      });
    }

    const user = await User.findById(req.query.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User not found" });
    }

    user.fcm_token = req.query.fcm_token;
    await user.save();

    return res.status(200).json({ status: true, message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//clearAll
exports.clearAll = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(200).json({ status: false, message: "Invalid Details!" });
    }

    const userId = new mongoose.Types.ObjectId(req.query.userId);

    const [user, data] = await Promise.all([User.findById(userId), Notification.deleteMany({ receiverId: userId })]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({ status: true, message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

// View
exports.viewUserNotification = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(200).json({ status: false, message: "Invalid Details!" });
    }

    const userId = new mongoose.Types.ObjectId(req.query.userId);

    const [user, notification] = await Promise.all([
      User.findById(userId),
      Notification.aggregate([
        {
          $match: { receiverId: userId },
        },
        {
          $lookup: {
            from: "users",
            as: "user",
            localField: "userId",
            foreignField: "_id",
          },
        },
        {
          $unwind: {
            path: `$user`,
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            receiverId: 1,
            type: 1,
            from: 1,
            to: 1,
            friends: 1,
            postImage: 1,
            description: 1,
            giftImage: 1,
            createdAt: 1,
            updatedAt: 1,
            userId: 1,
            comment: 1,
            title: 1,
            message: 1,
            image: 1,
            name: "$user.name",
            profileImage: "$user.profileImage",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            _id: 1,
            receiverId: 1,
            type: 1,
            userId: 1,
            name: 1,
            profileImage: 1,
            from: {
              $cond: {
                if: { $eq: ["$type", 0] },
                then: "$from",
                else: "$false",
              },
            },
            to: {
              $cond: {
                if: { $eq: ["$type", 0] },
                then: "$to",
                else: "$false",
              },
            },
            friends: {
              $cond: {
                if: { $eq: ["$type", 0] },
                then: "$friends",
                else: "$false",
              },
            },
            giftImage: {
              $cond: {
                if: { $eq: ["$type", 2] },
                then: "$giftImage",
                else: "$false",
              },
            },
            comment: {
              $cond: {
                if: { $eq: ["$type", 3] },
                then: "$comment",
                else: "$false",
              },
            },
            postImage: {
              $cond: {
                if: {
                  $or: [{ $eq: ["$type", 1] }, { $eq: ["$type", 2] }, { $eq: ["$type", 3] }],
                },
                then: "$postImage",
                else: "$false",
              },
            },
            description: {
              $cond: {
                if: {
                  $or: [{ $eq: ["$type", 1] }, { $eq: ["$type", 2] }, { $eq: ["$type", 3] }],
                },
                then: "$description",
                else: "$false",
              },
            },
            image: {
              $cond: {
                if: { $eq: ["$type", 4] },
                then: "$image",
                else: "$false",
              },
            },
            message: {
              $cond: {
                if: { $eq: ["$type", 4] },
                then: "$message",
                else: "$false",
              },
            },
            title: {
              $cond: {
                if: { $eq: ["$type", 4] },
                then: "$title",
                else: "$false",
              },
            },
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]),
    ]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({ status: true, message: "Success", notification });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//send notification by admin panel
exports.sendNotification = async (req, res) => {
  try {
    const users = await User.find({ isBlock: false });
    const userTokens = users.filter((user) => user.fcm_token).map((user) => user.fcm_token);

    if (userTokens.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No active users with FCM tokens to send notifications to!",
      });
    }

    const adminPromise = await admin;

    const payload = {
      tokens: userTokens,
      notification: {
        body: req.body.description,
        title: req.body.title,
        image: req.file ? baseURL + req.file.path : "",
      },
      data: {
        type: "ADMIN",
      },
    };

    adminPromise
      .messaging()
      .sendMulticast(payload)
      .then(async (response) => {
        console.log("Successfully sent with response: ", response);

        const notifications = users.map(async (user) => {
          if (user.fcm_token) {
            const notification = new Notification({
              userId: user._id,
              receiverId: user._id,
              title: req.body.title,
              message: req.body.description,
              image: req.file ? baseURL + req.file.path : "",
              type: 4,
            });
            await notification.save();
          }
        });

        await Promise.all(notifications);

        return res.status(200).json({
          status: true,
          message: "Successfully sent messages!",
        });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        return res.status(200).json({
          status: false,
          message: "Something went wrong while sending notifications!",
          error: error.message || error,
        });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
      error: error.message || error,
    });
  }
};
