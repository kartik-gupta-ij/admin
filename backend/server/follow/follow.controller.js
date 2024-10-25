const Follow = require("./follow.model");
const User = require("../user/user.model");
const Notification = require("../notification/notification.model");
const Block = require("../block/block.model");

const mongoose = require("mongoose");

const admin = require("../../util/privateKey");

exports.followRequest = async (req, res) => {
  try {
    if (!req.query.userFromId || !req.query.userToId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const userFromId = new mongoose.Types.ObjectId(req.query.userFromId);
    const userToId = new mongoose.Types.ObjectId(req.query.userToId);

    const [userFrom, userTo, followUser, followUser_] = await Promise.all([
      User.findById(userFromId),
      User.findById(userToId),
      Follow.findOne({
        $and: [{ from: userFromId }, { to: userToId }],
      }),
      Follow.findOne({
        $and: [{ to: userFromId }, { from: userToId }],
      }),
    ]);

    if (!userTo || !userFrom) {
      return res.status(200).json({ status: false, message: "User does not exists !" });
    }

    if (followUser) {
      await Follow.deleteOne({
        from: userFrom._id,
        to: userTo._id,
      });

      if (followUser_) {
        followUser_.friends = false;
        await followUser_.save();
      }

      return res.status(200).send({
        status: true,
        message: "UnFollow Successfully......! ",
        isFollow: false,
      });
    }

    //follow
    const followRequest = new Follow();
    followRequest.from = userFrom._id;
    followRequest.to = userTo._id;

    if (followUser_) {
      followRequest.friends = true;
      followUser_.friends = true;
      await followUser_.save();
    }

    await followRequest.save();

    res.status(200).json({
      status: true,
      message: "Follow Successfully......!",
      isFollow: true,
    });

    if (userTo.fcm_token !== null) {
      const adminPromise = await admin;

      const payload = {
        token: userTo.fcm_token,
        notification: {
          body: `${userFrom.name} Follow You`,
          title: userFrom.name,
          image: userFrom ? userFrom.profileImage : "",
        },
        data: {
          type: "ADMIN",
        },
      };

      try {
        const response = await adminPromise.messaging().send(payload);
        console.log("Successfully sent with response: ", response);

        const notification = new Notification();
        notification.receiverId = followRequest.to;
        notification.type = 0;
        notification.from = followRequest.from;
        notification.to = followRequest.to;
        notification.friends = followRequest.friends;
        notification.userId = followRequest.from;
        await notification.save();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

exports.showFriends = async (req, res) => {
  try {
    if (!req.query.userId || !req.query.type) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const userId = new mongoose.Types.ObjectId(req.query.userId);

    const [array1, array2] = await Promise.all([Block.find({ from: userId }).distinct("to"), Block.find({ to: userId }).distinct("from")]);

    const blockUser = [...array1, ...array2];

    var matchQuery, lookUp;
    if (req.query.type === "following") {
      matchQuery = { from: { $eq: mongoose.Types.ObjectId(req.query.userId) } };
      lookUp = "to";
    } else if (req.query.type === "followers") {
      matchQuery = { to: { $eq: mongoose.Types.ObjectId(req.query.userId) } };
      lookUp = "from";
    }

    const userFollow = await Follow.aggregate([
      {
        $match: matchQuery,
      },
      {
        $match: {
          $and: [{ from: { $nin: blockUser } }, { to: { $nin: blockUser } }],
        },
      },
      {
        $lookup: {
          from: "users",
          as: lookUp,
          localField: lookUp,
          foreignField: "_id",
        },
      },
      {
        $unwind: {
          path: `$${lookUp}`,
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          friends: 1,
          from: 1,
          to: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Successfully Request Show......!",
      userFollow,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// [Backend]
exports.showList = async (req, res) => {
  try {
    if (!req.query.userId || !req.query.type) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    var matchQuery, lookUp, projectQuery;
    if (req.query.type === "following") {
      matchQuery = {
        $and: [{ from: { $eq: new mongoose.Types.ObjectId(req.query.userId) } }, { isBlock: false }],
      };
      lookUp = "to";
      projectQuery = {
        $project: {
          _id: 1,
          friends: 1,
          from: 1,
          to: "$to._id",
          name: "$to.name",
          bio: "$to.bio",
          profileImage: "$to.profileImage",
          isOnline: "$to.isOnline",
          createdAt: 1,
          post: { $size: "$post" },
          following: {
            $size: {
              $filter: {
                input: "$follow",
                cond: {
                  $eq: ["$$this.from", `$${lookUp}._id`],
                },
              },
            },
          },
          followers: {
            $size: {
              $filter: {
                input: "$follow",
                cond: {
                  $eq: ["$$this.to", `$${lookUp}._id`],
                },
              },
            },
          },
        },
      };
    } else if (req.query.type === "followers") {
      matchQuery = {
        $and: [{ to: { $eq: new mongoose.Types.ObjectId(req.query.userId) } }, { isBlock: false }],
      };
      lookUp = "from";
      projectQuery = {
        $project: {
          _id: 1,
          friends: 1,
          to: 1,
          from: "$from._id",
          name: "$from.name",
          bio: "$from.bio",
          profileImage: "$from.profileImage",
          isOnline: "$from.isOnline",
          createdAt: 1,
          post: { $size: "$post" },
          following: {
            $size: {
              $filter: {
                input: "$follow",
                cond: {
                  $eq: ["$$this.from", `$${lookUp}._id`],
                },
              },
            },
          },
          followers: {
            $size: {
              $filter: {
                input: "$follow",
                cond: {
                  $eq: ["$$this.to", `$${lookUp}._id`],
                },
              },
            },
          },
        },
      };
    }

    const userFollow = await Follow.aggregate([
      {
        $lookup: {
          from: "blocks",
          as: "isBlock",
          let: { from: "$from", to: "$to" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [{ $eq: ["$$from", "$from"] }, { $eq: ["$$to", "$to"] }],
                    },
                    {
                      $and: [{ $eq: ["$$from", "$to"] }, { $eq: ["$$to", "$from"] }],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          block: { $size: "$isBlock" },
        },
      },
      {
        $addFields: {
          isBlock: { $cond: [{ $gte: ["$block", 1] }, true, false] },
        },
      },
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "posts",
          as: "post",
          localField: lookUp,
          foreignField: "userId",
        },
      },
      {
        $lookup: {
          from: "follows",
          as: "follow",
          let: {
            fromId: `$${lookUp}`,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [{ $eq: ["$from", "$$fromId"] }, { $eq: ["$to", "$$fromId"] }],
                },
              },
            },
            {
              $lookup: {
                from: "blocks",
                as: "isBlock",
                let: { from: "$from", to: "$to" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          {
                            $and: [{ $eq: ["$$from", "$from"] }, { $eq: ["$$to", "$to"] }],
                          },
                          {
                            $and: [{ $eq: ["$$from", "$to"] }, { $eq: ["$$to", "$from"] }],
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                block: { $size: "$isBlock" },
              },
            },
            {
              $addFields: {
                isBlock: { $cond: [{ $gte: ["$block", 1] }, true, false] },
              },
            },
            {
              $match: { isBlock: false },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          as: lookUp,
          localField: lookUp,
          foreignField: "_id",
        },
      },
      {
        $unwind: {
          path: `$${lookUp}`,
          preserveNullAndEmptyArrays: true,
        },
      },

      projectQuery,
    ]);

    return res.status(200).json({
      status: true,
      message: "Successfully Request Show......!",
      userFollow,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
