const ChatTopic = require("./chatTopic.model");
const User = require("../user/user.model");
const Block = require("../block/block.model");

const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
var advanced = require("dayjs/plugin/advancedFormat");

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(advanced);

const mongoose = require("mongoose");

//Create Chat topic
exports.store = async (req, res) => {
  try {
    if (!req.query.senderId || !req.query.receiverId) {
      return res.status(200).json({ status: false, message: "Invalid details!!" });
    }

    const senderId = new mongoose.Types.ObjectId(req.query.senderId);
    const receiverId = new mongoose.Types.ObjectId(req.query.receiverId);

    const [sender, receiver, chatTopic] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
      ChatTopic.findOne({
        $or: [
          {
            $and: [{ senderId: senderId }, { receiverId: receiverId }],
          },
          {
            $and: [{ senderId: receiverId }, { receiverId: senderId }],
          },
        ],
      }),
    ]);

    if (!sender || !receiver) {
      return res.status(200).json({ status: "false", message: "User does not Exist!!" });
    }

    if (chatTopic) {
      return res.status(200).json({ status: true, message: "Old Success!!", chatTopic });
    }

    const newChatTopic = new ChatTopic();
    newChatTopic.senderId = sender._id;
    newChatTopic.receiverId = receiver._id;
    await newChatTopic.save();

    return res.status(200).json({
      status: true,
      message: "Success!!",
      chatTopic: newChatTopic,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//Get Thumb List of chat
exports.getChatThumbList = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(200).json({ status: false, message: "UserId must be required!!" });
    }

    const userId = new mongoose.Types.ObjectId(req.query.userId);

    const [user, array1, array2] = await Promise.all([User.findById(userId), Block.find({ from: userId }).distinct("to"), Block.find({ to: userId }).distinct("from")]);

    if (!user) {
      return res.status(200).json({ status: false, message: "user does not found." });
    }

    if (!global.settingJSON) {
      return res.status(200).json({ status: false, message: "setting does not found." });
    }

    const blockUser = [...array1, ...array2];

    const [chatList, fakeUserChatList] = await Promise.all([
      ChatTopic.aggregate([
        {
          $match: {
            $or: [
              {
                $and: [{ senderId: { $eq: user._id } }, { senderId: { $nin: blockUser } }],
              },
              {
                $and: [{ receiverId: { $eq: user._id } }, { receiverId: { $nin: blockUser } }],
              },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            as: "user",
            let: {
              senderId: "$senderId",
              receiverId: "$receiverId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $cond: {
                      if: { $eq: ["$$senderId", user._id] },
                      then: { $eq: ["$$receiverId", "$_id"] },
                      else: { $eq: ["$$senderId", "$_id"] },
                    },
                  },
                },
              },
              {
                $project: {
                  name: 1,
                  uniqueId: 1,
                  profileImage: 1,
                  country: 1,
                  isFake: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "chats",
            localField: "chat",
            foreignField: "_id",
            as: "chat",
          },
        },
        {
          $unwind: {
            path: "$chat",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $addFields: {
            video: "",
          },
        },
        {
          $project: {
            _id: 0,
            video: 1,
            topic: "$_id",
            message: "$chat.message",
            messageType: "$chat.messageType",
            date: "$chat.date",
            createdAt: "$chat.createdAt",
            userId: "$user._id",
            name: "$user.name",
            profileImage: "$user.profileImage",
            country: "$user.country",
            isFake: "$user.isFake",
          },
        },
        { $sort: { createdAt: -1 } },
      ]),

      User.aggregate([
        {
          $match: {
            $and: [{ isFake: true }, { isLive: false }],
          },
        },
        {
          $addFields: {
            topic: "",
            message: "Hello",
            messageType: 0,
            chatDate: "",
            time: "",
          },
        },
        {
          $project: {
            _id: 0,
            topic: 1,
            message: 1,
            messageType: 1,
            date: 1,
            chatDate: 1,
            userId: "$_id",
            name: 1,
            profileImage: 1,
            country: 1,
            isFake: 1,
            time: 1,
            video: 1,
            createdAt: 1,
          },
        },
      ]),
    ]);

    let now = dayjs();
    const realUserChatList = chatList.map((data) => ({
      ...data,
      time:
        now.diff(data.createdAt, "minute") === 0
          ? "Just Now"
          : now.diff(data.createdAt, "minute") <= 60 && now.diff(data.createdAt, "minute") >= 0
          ? now.diff(data.createdAt, "minute") + " minutes ago"
          : now.diff(data.createdAt, "hour") >= 24
          ? dayjs(data.createdAt).format("DD MM YYYY")
          : now.diff(data.createdAt, "hour") + " hour ago",
    }));

    if (global.settingJSON?.isFake) {
      return res.status(200).json({
        status: true,
        message: "Success",
        chatList: [...realUserChatList, ...fakeUserChatList],
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Success",
        chatList: realUserChatList,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};
