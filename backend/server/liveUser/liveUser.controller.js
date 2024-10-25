const LiveUser = require("./liveUser.model");
const LiveStreamingHistory = require("../liveStreamingHistory/liveStreamingHistory.model");
const Block = require("../block/block.model");
const User = require("../user/user.model");

const { RtcRole, RtcTokenBuilder } = require("agora-access-token");

const config = require("../../config");
const mongoose = require("mongoose");
const admin = require("../../util/privateKey");

const LiveUserFunction = async (liveUser, user) => {
  liveUser.name = user.name;
  liveUser.country = user.country;
  liveUser.profileImage = user.profileImage;
  liveUser.album = user.album;
  liveUser.token = user.token;
  liveUser.channel = user.channel;
  liveUser.coin = user.coin;
  liveUser.userId = user._id;
  liveUser.dob = user.dob;
  // liveUser.view = null;
  await liveUser.save();
  return liveUser;
};

exports.userIsLive = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(200).json({ status: false, message: "Invalid Detail...!" });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User Is Not Exist...!" });
    }

    if (!global.settingJSON) {
      return res.status(200).json({ status: false, message: "Setting Is Not Exist...!" });
    }

    const liveStreamingHistory = new LiveStreamingHistory();

    //Generate Token
    const role = RtcRole.PUBLISHER;
    const uid = req.body.agoraUID ? req.body.agoraUID : 0;
    const expirationTimeInSeconds = 24 * 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = await RtcTokenBuilder.buildTokenWithUid(global.settingJSON.agoraKey, global.settingJSON.agoraCertificate, liveStreamingHistory._id.toString(), uid, role, privilegeExpiredTs);

    user.isOnline = true;
    user.isBusy = true;
    user.isLive = true;
    user.token = token;
    user.channel = liveStreamingHistory._id.toString();
    user.liveStreamingId = liveStreamingHistory._id.toString();
    user.agoraUID = req.body.agoraUID ? req.body.agoraUID : 0;

    liveStreamingHistory.userId = user._id;
    liveStreamingHistory.coverImage = req.file ? config.baseURL + req.file.path : user.profileImage;
    liveStreamingHistory.profileImage = user.profileImage;
    liveStreamingHistory.startTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    await Promise.all([user.save(), liveStreamingHistory.save(), LiveUser.deleteOne({ userId: user._id })]);

    let liveUserStreaming;
    const newLiveUser = new LiveUser();
    newLiveUser.liveStreamingId = liveStreamingHistory._id;
    newLiveUser.agoraUID = req.body.agoraUID;
    newLiveUser.diamond = user.diamond;
    newLiveUser.coverImage = req.file ? config.baseURL + req.file.path : user.profileImage;

    liveUserStreaming = await LiveUserFunction(newLiveUser, user);

    const data = await LiveUser.findById(newLiveUser._id);

    res.status(200).json({
      status: true,
      message: "Success",
      liveHost: data,
    });

    const users = await User.find({
      $and: [{ isBlock: false }, { _id: { $ne: user._id } }],
    }).distinct("fcm_token");

    if (users.length !== 0) {
      const adminPromise = await admin;

      const payload = {
        tokens: users,
        notification: {
          title: `${user.name} is live now`,
          body: "Click and watch now!",
          image: user.profileImage,
        },
        data: {
          _id: user._id.toString(),
          profileImage: user.profileImage.toString(),
          isLive: user.isLive.toString(),
          token: user.token.toString(),
          diamond: user.diamond.toString(),
          channel: user.channel.toString(),
          level: user.level?.toString() || "",
          name: user.name.toString(),
          age: user.age?.toString() || "",
          callCharge: user.callCharge?.toString() || "",
          isOnline: user.isOnline.toString(),
          coin: user.coin.toString(),
          liveStreamingId: liveStreamingHistory._id.toString(),
          mongoId: newLiveUser._id.toString(),
          view: data.view.toString(),
          isBusy: user.isBusy.toString(),
          type: "LIVE",
        },
      };

      adminPromise
        .messaging()
        .sendMulticast(payload)
        .then((response) => {
          console.log("Successfully sent with response: ", response);
        })
        .catch((error) => {
          console.log("Error sending message:      ", error);
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};

exports.getLiveUserList = async (req, res) => {
  try {
    if (!req.query.loginUserId) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const loginUserId = new mongoose.Types.ObjectId(req.query.loginUserId);

    const [loginUser, array1, array2] = await Promise.all([User.findById(loginUserId), Block.find({ from: loginUserId }).distinct("to"), Block.find({ to: loginUserId }).distinct("from")]);

    if (!global.settingJSON) {
      return res.status(200).json({ status: false, message: "Setting does not found." });
    }

    const blockUser = [...array1, ...array2];

    const [user, fakeUserList] = await Promise.all([
      LiveUser.aggregate([
        {
          $match: {
            userId: { $nin: blockUser },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: "liveViews",
            as: "totalUser",
            localField: "liveStreamingId",
            foreignField: "liveStreamingId",
          },
        },
        {
          $lookup: {
            from: "follows",
            as: "friends",
            let: {
              fromId: loginUser._id,
              toId: "$userId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $and: [{ $eq: ["$from", "$$fromId"] }, { $eq: ["$to", "$$toId"] }],
                      },
                      {
                        $and: [{ $eq: ["$to", "$$fromId"] }, { $eq: ["$from", "$$toId"] }],
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
            isFake: false,
            video: "",
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            name: 1,
            country: 1,
            profileImage: 1,
            diamond: 1,
            coverImage: 1,
            token: 1,
            channel: 1,
            coin: 1,
            dob: 1,
            agoraUID: 1,
            isFake: 1,
            video: 1,
            liveStreamingId: 1,
            totalUser: { $size: "$totalUser" },
            friends: { $first: "$friends" },
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            name: 1,
            country: 1,
            profileImage: 1,
            diamond: 1,
            coverImage: 1,
            token: 1,
            channel: 1,
            coin: 1,
            dob: 1,
            agoraUID: 1,
            liveStreamingId: 1,
            totalUser: 1,
            isFake: 1,
            video: 1,
            friends: {
              $switch: {
                branches: [
                  { case: { $eq: ["$friends.friends", true] }, then: "Friends" },
                  {
                    case: { $eq: ["$friends.friends", false] },
                    then: "Following",
                  },
                ],
                default: "Follow",
              },
            },
          },
        },
      ]),

      User.aggregate([
        {
          $match: {
            $and: [{ isFake: true }, { isLive: true }],
          },
        },
        {
          $addFields: {
            totalUser: {
              $floor: { $add: [30, { $multiply: [{ $rand: {} }, 121] }] },
            },
            friends: "Follow",
            token: "",
            channel: "",
            liveStreamingId: "",
          },
        },
        {
          $project: {
            _id: 1,
            userId: "$_id",
            name: 1,
            country: 1,
            profileImage: 1,
            diamond: 1,
            coverImage: "$profileImage",
            token: 1,
            channel: 1,
            coin: 1,
            dob: 1,
            isFake: 1,
            agoraUID: 1,
            liveStreamingId: 1,
            totalUser: 1,
            friends: 1,
            video: 1,
          },
        },
      ]),
    ]);

    if (global.settingJSON.isFake) {
      return res.status(200).json({
        status: true,
        message: "Success!!",
        user: [...user, ...fakeUserList],
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Success!!",
        user: user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

exports.afterLiveHistory = async (req, res) => {
  try {
    if (!req.query.liveStreamingId) {
      return res.status(200).json({ status: false, message: "Invalid Detail...!" });
    }

    const liveStreaming = await LiveStreamingHistory.findById(req.query.liveStreamingId);

    return res.status(200).json({
      status: true,
      message: "Success!!",
      liveStreaming,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};
