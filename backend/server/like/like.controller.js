const Like = require("./like.model");
const User = require("../user/user.model");
const Post = require("../post/post.model");
const Notification = require("../notification/notification.model");

const mongoose = require("mongoose");

const admin = require("../../util/privateKey");

exports.likePost = async (req, res) => {
  try {
    if (!req.query.postId || !req.query.userId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const postId = new mongoose.Types.ObjectId(req.query.postId);

    const [user, post, likes] = await Promise.all([
      User.findById(userId),
      Post.findById(postId),
      Like.findOne({
        $and: [{ postId: postId }, { userId: userId }],
      }),
    ]);

    if (!user || !post) {
      return res.status(200).json({ status: false, message: "UserId Or PostId Doesn't Match" });
    }

    if (likes) {
      await Like.deleteOne({
        postId: post._id,
        userId: user._id,
      });

      return res.status(200).send({
        status: true,
        message: "Dislike Successfully......! ",
        like: false,
      });
    }

    const like = new Like();
    like.postId = post._id;
    like.userId = user._id;
    await like.save();

    res.status(200).json({
      status: true,
      message: "Successfully Like......!",
      like: true,
    });

    const receiverId = await User.findById(post.userId);

    if (receiverId.fcm_token !== null) {
      const adminPromise = await admin;

      const payload = {
        token: receiverId.fcm_token,
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
          notification.type = 1;
          notification.userId = user._id;
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

// [App]
exports.showPostLike = async (req, res) => {
  try {
    if (!req.query.postId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const postId = new mongoose.Types.ObjectId(req.query.postId);
    const loginUserId = new mongoose.Types.ObjectId(req.query.loginUserId);

    const likes = await Like.aggregate([
      {
        $match: { postId: postId },
      },
      {
        $lookup: {
          from: "follows",
          as: "friends",
          let: {
            fromId: loginUserId,
            toId: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$from", "$$fromId"] }, { $eq: ["$to", "$$toId"] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$friends",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          localField: "userId",
          foreignField: "_id",
          from: "users",
          as: "userId",
        },
      },
      {
        $unwind: {
          path: "$userId",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          postId: 1,
          userId: "$userId._id",
          name: "$userId.name",
          profileImage: "$userId.profileImage",
          friends: {
            $switch: {
              branches: [
                { case: { $eq: ["$friends.friends", true] }, then: "Friends" },
                {
                  case: { $eq: ["$friends.friends", false] },
                  then: "Following",
                },
                {
                  case: {
                    $eq: [loginUserId, "$userId._id"],
                  },
                  then: "me",
                },
              ],
              default: "Follow",
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Successfully Likes......!",
      likes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
