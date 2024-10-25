const Chat = require("./chat.model");
const ChatTopic = require("../chatTopic/chatTopic.model");

//fs
const fs = require("fs");

//config
var config = require("../../config");

//create chat [with image,video,audio]
exports.store = async (req, res) => {
  try {
    if (!req.body.topicId || !req.body.messageType || !req.body.senderId) {
      return res.status(200).json({ status: false, message: "Invalid details!!" });
    }

    const chatTopic = await ChatTopic.findById(req.body.topicId).populate("senderId receiverId");
    if (!chatTopic) {
      return res.status(200).json({ status: false, message: "Topic not Exist!!" });
    }

    // Send Image,Audio And Video Send In Chat
    const chat = new Chat();

    chat.senderId = req.body.senderId;
    chat.topicId = chatTopic._id;
    chat.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    if (req.body.messageType == 2) {
      chat.messageType = 2;
      chat.message = "📸 Image";
      if (req.files.image) {
        chat.image = config.baseURL + req.files.image[0].path;
      }
    } else if (req.body.messageType == 3) {
      chat.messageType = 3;
      chat.message = "📸 Video";
      if (req.files.video) {
        chat.video = config.baseURL + req.files.video[0].path;
      }
    } else if (req.body.messageType == 4) {
      chat.messageType = 4;
      chat.message = "🎤 Audio";
      if (req.files.audio) {
        chat.audio = config.baseURL + req.files.audio[0].path;
      }
    }

    chatTopic.chat = chat._id;

    await Promise.all([chat.save(), chatTopic.save()]);

    return res.status(200).json({
      status: true,
      message: "Success",
      chat,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//get old chat
exports.getOldChat = async (req, res) => {
  try {
    const chat = await Chat.find({ topicId: req.query.topicId });
    // .skip(req.query.start ? parseInt(req.query.start) : 0)
    // .limit(req.query.limit ? parseInt(req.query.limit) : 20);

    if (!chat) {
      return res.status(200).json({ status: false, message: "No data found!" });
    }

    return res.status(200).json({ status: true, message: "Success", chat });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

//delete Chat
exports.deleteChat = async (req, res) => {
  try {
    if (!req.query.chatId) {
      return res.status(200).json({ status: false, message: "ChatId is required!!" });
    }

    const chat = await Chat.findById(req.query.chatId);
    if (!chat) {
      return res.status(200).json({ status: false, message: "Chat does not exist!!" });
    }

    const chatTopic = await ChatTopic.findById(chat.topicId);

    if (chat.messageType === 0) {
      if (fs.existsSync(chat.image)) {
        fs.unlinkSync(chat.image);
      }
    } else if (chat.messageType === 1) {
      if (fs.existsSync(chat.video)) {
        fs.unlinkSync(chat.video);
      }
    } else if (chat.messageType === 2) {
      if (fs.existsSync(chat.audio)) {
        fs.unlinkSync(chat.audio);
      }
    }

    await chat.deleteOne();

    if (chatTopic && chatTopic.chat.toString() === req.query.chatId.toString()) {
      const newChat = await Chat.findOne({ topicId: chatTopic._id }).sort({ createdAt: -1 });
      if (newChat) {
        chatTopic.chat = newChat._id;
      }

      await chatTopic.save();
    }

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};
