const Post = require("../post/post.model");
const User = require("../user/user.model");
const Notification = require("../notification/notification.model");
const Comment = require("./comment.model");

const mongoose = require("mongoose");

const admin = require("../../util/privateKey");

exports.comment = async (req, res) => {
  try {
    if (!req.query.postId || !req.query.userId || !req.body.comment) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const postId = new mongoose.Types.ObjectId(req.query.postId);
    const userId = new mongoose.Types.ObjectId(req.query.userId);

    const [user, post] = await Promise.all([User.findById(userId), Post.findById(postId)]);

    if (!user || !post) {
      return res.status(200).json({ status: false, message: "UserId Or PostId Doesn't Match" });
    }

    const comment = new Comment();
    comment.postId = post._id;
    comment.userId = user._id;
    comment.comment = req.body.comment;
    comment.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    await comment.save();

    res.status(200).json({
      status: true,
      message: "Successfully Comment......!",
      comment,
    });

    const receiverId = await User.findById(post.userId);

    if (receiverId && receiverId.fcm_token !== null) {
      const adminPromise = await admin;

      const payload = {
        token: receiverId?.fcm_token,
        notification: {
          body: post.description,
          title: user.name,
          image: post ? post.postImage : "",
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
          notification.type = 3;
          notification.userId = user._id;
          notification.comment = comment.comment;
          notification.postImage = post.postImage;
          notification.description = post.description;
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

exports.showComment = async (req, res) => {
  try {
    if (!req.query.postId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const postId = new mongoose.Types.ObjectId(req.query.postId);

    const [post, comment] = await Promise.all([
      Post.findById(postId),
      Comment.aggregate([
        {
          $match: { postId: postId },
        },
        {
          $lookup: {
            from: "users",
            as: "userId",
            let: { userId: "$userId" },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$$userId", "$_id"] } },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$userId",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            _id: 1,
            postId: 1,
            comment: 1,
            createdAt: 1,
            date: 1,
            userId: "$userId._id",
            profileImage: "$userId.profileImage",
            name: "$userId.name",
          },
        },
      ]),
    ]);

    if (!post) {
      return res.status(200).json({ status: false, message: "postId Doesn't Match" });
    }

    return res.status(200).json({
      status: true,
      message: "Successfully Comment......!",
      comment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
