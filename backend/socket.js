const { roundNumber } = require("./util/roundNumber");

//moment
const moment = require("moment");

//mongoose
const mongoose = require("mongoose");

//import model
const User = require("./server/user/user.model");
const LiveView = require("./server/liveView/liveView.model");
const LiveStreamingHistory = require("./server/liveStreamingHistory/liveStreamingHistory.model");
const LiveUser = require("./server/liveUser/liveUser.model");
const ChatTopic = require("./server/chatTopic/chatTopic.model");
const History = require("./server/history/history.model");
const Chat = require("./server/chat/chat.model");
const Gift = require("./server/gift/gift.model");

//private key
const admin = require("./util/privateKey");

io.on("connect", async (socket) => {
  console.log("Socket Is Connect Successfully.....!");

  // Global Socket For Login User
  const { globalRoom } = socket.handshake.query;
  console.log("------globalRoom Connect------", globalRoom);

  //socket join into room
  socket.join(globalRoom);

  //user Is Online
  if (globalRoom) {
    console.log("check In globalRoom Connect ==================>", globalRoom);

    const user = await User.findById(globalRoom);
    if (user) {
      user.isOnline = true;
      await user.save();
    }
  }

  const live = socket.handshake.query.obj ? JSON.parse(socket.handshake.query.obj) : null;
  console.log("------------ socket.handshake.query.obj", socket.handshake.query.obj);

  let liveRoom, liveUserRoom, showUserRoom;

  if (live !== null) {
    liveRoom = live.liveRoom;
    liveUserRoom = live.liveUserRoom;
    showUserRoom = live.showUserRoom;
  }

  console.log("------liveRoom------", liveRoom);
  console.log("------liveUserRoom------", liveUserRoom);
  console.log("------showUserRoom------", showUserRoom);

  socket.join(liveRoom); // liveUser's LiveStreamingId
  socket.join(liveUserRoom); // liveUser's userId
  socket.join(showUserRoom); // showUserRoom's userId

  socket.on("addView", async (data) => {
    console.log("========= addView In Data =========", data);
    console.log("========= addView In LiveRoom =========", liveRoom);

    const liveStreamingHistory = await LiveStreamingHistory.findById(data.liveStreamingId);

    // liveRoom = LiveStreamingId
    // userId

    // if (liveUser) {
    //   liveUser.view += 1;
    //   await liveUser.save();
    // }

    const liveUser = await LiveUser.findById(data.mongoId);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& 000", liveUser);

    if (liveUser) {
      const joinedUserExist = await LiveUser.findOne({
        _id: liveUser._id,
        "view.userId": data.userId,
      });

      console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& 111", joinedUserExist);

      if (joinedUserExist) {
        await LiveUser.updateOne(
          { _id: liveUser._id, "view.userId": data.userId },
          {
            $set: {
              "view.$.userId": data.userId,
              "view.$.name": data.name,
              "view.$.profileImage": data.profileImage,
              "view.$.liveStreamingId": data.liveStreamingId,
              "view.$.isAdd": true,
            },
          }
        );
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& 222", joinedUserExist);
      } else {
        liveUser.view.push({
          userId: data.userId,
          name: data.name,
          profileImage: data.profileImage,
          liveStreamingId: data.liveStreamingId,
          isAdd: true,
        });

        console.log("%%%%%%%%%%%%%%%%%%%%%% Live User %%%%%%%%%%%%%%%%%%%%%%", liveUser);

        await liveUser.save();
      }
    }

    const liveView = await new LiveView();

    liveView.userId = data.userId;
    liveView.name = data.name;
    liveView.profileImage = data.profileImage;
    liveView.liveStreamingId = data.liveStreamingId;

    await liveView.save();

    // const _liveUser = await LiveUser.findById(data.mongoId);

    if (liveStreamingHistory && liveUser) {
      liveStreamingHistory.userView = liveUser.view.length;
      liveStreamingHistory.endTime = new Date().toLocaleString();
      await liveStreamingHistory.save();
      io.in(liveRoom).emit("view", liveUser.view);
    }
  });

  socket.on("lessView", async (data) => {
    console.log("========= lessView In Data =========", data);
    console.log("========= lessView In LiveRoom =========", liveRoom);

    const liveStreamingHistory = await LiveStreamingHistory.findById(data.liveStreamingId);

    await LiveUser.updateOne(
      { _id: data.mongoId, "view.userId": data.userId },
      {
        $set: {
          "view.$.isAdd": false,
        },
      }
    );

    const liveUser = await LiveUser.findOne({
      _id: data.mongoId,
      "view.isAdd": true,
    });

    console.log("-----------liveUser-----------", liveUser);

    if (liveStreamingHistory) {
      liveStreamingHistory.endTime = new Date().toLocaleString();
      await liveStreamingHistory.save();
    }
    await io.in(liveRoom).emit("view", liveUser ? liveUser.view : []);
  });

  socket.on("comment", async (data) => {
    console.log("========= Comment In Data =========", data);
    console.log("========= Comment In LiveRoom =========", liveRoom);

    const liveStreamingHistory = await LiveStreamingHistory.findById(data.liveStreamingId);

    if (liveStreamingHistory) {
      liveStreamingHistory.comment += 1;
      await liveStreamingHistory.save();
    }
    io.in(liveRoom).emit("comment", data);
  });

  socket.on("UserGift", async (data) => {
    console.log("========= User Gift In Data =========", data);

    // senderUserId
    // receiverUserId
    // Gift Object
    // coin
    // liveStreamingId

    const giftData = data.gift; //giftId
    console.log("========= User Gift =========", giftData);

    const senderUser = await User.findById(data.senderUserId);
    const receiverUser = await User.findById(data.receiverUserId);

    const gift = await Gift.findById(giftData._id);
    console.log("<==================== User Gift Check ====================>", data, senderUser, receiverUser);

    //randomCoin generator
    const number = await roundNumber(data.coin);

    if (senderUser.coin < number) {
      return io.in(liveRoom).emit("gift", null, "Insufficient coin");
    }

    if (senderUser && receiverUser) {
      // User Spend Coin
      senderUser.coin -= number;
      await senderUser.save();

      // User Earn Diamond
      receiverUser.diamond += parseInt(number);
      await receiverUser.save();

      const liveStreamingHistory = await LiveStreamingHistory.findById(data.liveStreaming);

      if (liveStreamingHistory) {
        liveStreamingHistory.gift += 1;
        liveStreamingHistory.diamond += parseInt(number);
        await liveStreamingHistory.save();
      }

      io.in(liveRoom).emit("gift", data, senderUser, receiverUser);

      // Add Diamond Count In Live User ThumbList
      const liveUser = await LiveUser.findOne({ userId: receiverUser._id });
      liveUser.diamond += parseInt(number);
      await liveUser.save();

      //User Spend Coin History
      const userSpend = new History();

      userSpend.userId = senderUser._id;
      userSpend.coin = number;
      userSpend.type = 0;
      userSpend.isIncome = false;
      userSpend.receiverId = receiverUser._id;
      userSpend.giftId = gift._id;
      userSpend.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      await userSpend.save();

      //User Earn Diamond History
      const userEarn = new History();

      userEarn.receiverId = receiverUser._id;
      userEarn.diamond = parseInt(number);
      userEarn.type = 0;
      userEarn.isIncome = true;
      userEarn.userId = senderUser._id;
      userEarn.giftId = gift._id;
      userEarn.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      await userEarn.save();

      // Add Gift And Diamond In LiveStreaming History
      if (data.liveStreamingId) {
        const liveStreamingHistory = await LiveStreamingHistory.findById(data.liveStreamingId);

        if (liveStreamingHistory) {
          liveStreamingHistory.diamond += parseInt(number);
          liveStreamingHistory.gift += 1;
          await liveStreamingHistory.save();
        }
      }
    }
  });

  socket.on("getUserProfile", async (data) => {
    console.log("=========  Get User Profile In Data =========", data);
    // userId
    const user = await User.findById(data.userId);

    io.in(liveRoom).emit("getUserProfile", user);
  });

  socket.on("blockList", (data) => {
    io.in(liveRoom).emit("blockList", data);
  });

  const { chatRoom } = socket.handshake.query;
  socket.join(chatRoom);

  //Chat Socket event
  socket.on("chat", async (data) => {
    console.log("========= Chat In Data =========", data);
    console.log("========= Chat In chatRoom =========", chatRoom);

    // topicId
    // senderId
    // message
    // messageType

    if (data.messageType == 0) {
      const chatTopic = await ChatTopic.findById(data.topicId).populate("senderId receiverId");

      if (chatTopic) {
        // Create Chat
        const chat = new Chat();
        chat.senderId = data.senderId;
        chat.messageType = 0;
        chat.message = data.message;
        chat.image = null;
        chat.audio = null;
        chat.video = null;
        chat.topicId = chatTopic._id;
        chat.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        await chat.save();

        //Last Message Show In ThumbList
        chatTopic.chat = chat._id;
        await chatTopic.save();

        const receiverUser = await User.findById(data.receiverId);
        const senderUser = await User.findById(data.senderId);

        io.in(chatRoom).emit("chat", chat);

        if (receiverUser && !receiverUser.isBlock && receiverUser.fcm_token !== null) {
          const adminPromise = await admin;

          const payload = {
            token: receiverUser.fcm_token,
            notification: {
              body: `New message: ${chat.message}`,
              title: senderUser.name ? `Message from ${senderUser.name}` : "New Message",
            },
            data: {
              senderProfileImage: senderUser.profileImage.toString(),
              senderName: senderUser.name.toString(),
              senderId: senderUser._id.toString(),
              chatRoom: chatRoom.toString(),
              type: "CHAT",
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
      }
    } else if (data.messageType == 1) {
      console.log("========= User Gift In Data =========", data);

      // senderUserId
      // receiverUserId
      // gift Object
      // message
      // coin
      // chatTopic
      // messageType

      const giftData = data.gift; //giftId
      console.log("========= User Gift =========", giftData);

      const senderUser = await User.findById(data.senderUserId);
      const receiverUser = await User.findById(data.receiverUserId);

      const gift = await Gift.findById(giftData._id);
      const chatTopic = await ChatTopic.findById(data.chatTopic).populate("senderId receiverId");

      if (chatTopic) {
        if (chatTopic.senderId._id.toString() === data.senderUserId.toString()) {
          const user = await User.findById(chatTopic.senderId._id);

          if (user.coin < data.coin) {
            console.log("--------1.emit chat event------");
            return io.in(chatRoom).emit("chat", null, "Insufficient coin");
          }
        }

        // Create Chat
        const chat = new Chat();
        chat.senderId = data.senderUserId;
        chat.messageType = 1;
        chat.message = data.message;
        chat.image = null;
        chat.audio = null;
        chat.video = null;
        chat.topicId = chatTopic._id;
        chat.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        await chat.save();

        //Last Message Show In ThumbList
        chatTopic.chat = chat._id;
        await chatTopic.save();

        console.log("========= 2. Chat Gift Emit =========", chat, senderUser, receiverUser);

        //randomCoin generator
        const number = await roundNumber(data.coin);

        if (senderUser && receiverUser) {
          // User Spend Coin
          senderUser.coin -= number;
          await senderUser.save();

          // User Earn Diamond
          receiverUser.diamond += parseInt(number);
          await receiverUser.save();
        }

        io.in(chatRoom).emit("chat", chat);

        if (receiverUser && !receiverUser.isBlock && receiverUser.fcm_token !== null) {
          const adminPromise = await admin;

          const payload = {
            token: receiverUser.fcm_token,
            notification: {
              body: `New message`,
              title: senderUser.name ? `Message from ${senderUser.name}` : "New Message",
            },
            data: {
              type: "CHAT",
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

        //User Spend Coin History
        const userSpend = new History();

        userSpend.userId = senderUser._id;
        userSpend.coin = number;
        userSpend.type = 0;
        userSpend.isIncome = false;
        userSpend.receiverId = receiverUser._id;
        userSpend.giftId = gift._id;
        userSpend.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        await userSpend.save();

        //User Earn Diamond History
        const userEarn = new History();

        userEarn.receiverId = receiverUser._id;
        userEarn.diamond = parseInt(number);
        userEarn.type = 0;
        userEarn.isIncome = true;
        userEarn.userId = senderUser._id;
        userEarn.giftId = gift._id;
        userEarn.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        await userEarn.save();
      }
    } else {
      console.log("========= 2. Chat Emit =========", data);
      io.in(chatRoom).emit("chat", data);

      const chatTopic = await ChatTopic.findById(data.topicId).populate("senderId receiverId");

      const [senderUser, receiverUser] = await Promise.all([User.findById(data.senderId), User.findById(chatTopic.receiverId._id)]);

      if (receiverUser && !receiverUser.isBlock && receiverUser.fcm_token !== null) {
        const adminPromise = await admin;

        const payload = {
          token: receiverUser.fcm_token,
          notification: {
            body: data.messageType === 2 ? "📸 Image" : data.messageType === 3 ? "🎥 Video" : data.messageType === 4 ? "🎤 Audio" : "New message",
            title: senderUser.name ? `Message from ${senderUser?.name}` : "New Message",
          },
          data: {
            type: "CHAT",
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
    }
  });

  const { videoCallRoom } = socket.handshake.query;
  socket.join(videoCallRoom);

  // callRoom, globalRoom and videoCallRoom for one to one call
  const { callRoom } = socket.handshake.query;
  socket.join(callRoom);

  //videoCallRoom
  if (videoCallRoom) {
    const history = await History.findById(videoCallRoom);

    if (history) {
      const caller = await User.findById(history.userId);
      const receiver = await User.findById(history.hostId);

      if (caller) {
        caller.isBusy = true;
        await caller.save();
        console.log("caller is busy when socket connect --------", caller.isBusy);
      }
      if (receiver) {
        receiver.isBusy = true;
        await receiver.save();
        console.log("receiver is busy when socket connect ------", receiver.isBusy);
      }
    }
  }

  // ===================== callRequest Socket (After API) =====================
  socket.on("callRequest", (data) => {
    console.log("========= callRequest In Data =========", data);
    io.in(data.receiverId).emit("callRequest", data);
  });

  // ===================== callConfirmed Socket (Receiver In Ringing) =====================
  socket.on("callConfirmed", async (data) => {
    console.log("========= callConfirmed In Data =========", data);

    const sender = await User.findById(data.callerId);
    const receiver = await User.findById(data.receiverId);

    const chatTopic = await ChatTopic.findOne({
      $or: [
        {
          $and: [{ senderId: sender._id }, { receiverId: receiver._id }],
        },
        {
          $and: [{ senderId: receiver._id }, { receiverId: sender._id }],
        },
      ],
    });

    const chat = new Chat();

    if (chatTopic) {
      chatTopic.chat = chat._id;
      chatTopic.senderId = sender._id;
      chatTopic.receiverId = receiver._id;

      await chatTopic.save();
      chat.topicId = chatTopic._id;
    } else {
      const newChatTopic = new ChatTopic();

      newChatTopic.chat = chat._id;
      newChatTopic.senderId = sender._id;
      newChatTopic.receiverId = receiver._id;

      await newChatTopic.save();
      chat.topicId = newChatTopic._id;
    }
    chat.senderId = data.callerId;
    chat.callType = 1;
    chat.messageType = 5;
    chat.message = "📽 Video Call";
    chat.callId = callRoom; //historyId to be stored in callId of chat collection
    chat.audio = null;
    chat.video = null;
    chat.date = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    await chat.save();

    if (sender) {
      sender.isBusy = true;
      await sender.save();
      console.log("=======sender busy in call Confirm=======", sender.isBusy);
    }
    if (receiver) {
      receiver.isBusy = true;
      await receiver.save();
      console.log("=======receiver busy in call Confirm =======", receiver.isBusy);
    }

    console.log("=======callRoom in call Confirm=======", callRoom);

    io.in(callRoom).emit("callConfirmed", data);
  });

  // ===================== callAnswer Socket (Accept Call) =====================
  socket.on("callAnswer", async (data) => {
    console.log("========= callAnswer In Data =========", data);
    console.log("========= callAnswer In callRoom =========", callRoom);
    console.log("========= callAnswer In videoCallRoom =========", videoCallRoom);

    const callDetail = await History.findById(callRoom);
    const chat = await Chat.findOne({ callId: callRoom }); //historyId

    if (!data.accept) {
      const receiver = await User.findById(callDetail.receiverId);
      if (receiver) {
        receiver.isBusy = false;
        receiver.isConnect = false;
        await receiver.save();
      }

      const user = await User.findById(callDetail.userId);

      if (user) {
        user.isBusy = false;
        await user.save();

        console.log("############### user busy in call Answer -----", user.isBusy);
      }
      if (chat) {
        chat.callType = 2; // 2. decline
        chat.isRead = true;
        chat.messageType = 5;
        await chat.save();
      }
    }

    io.in(callRoom).emit("callAnswer", data);
  });

  // ===================== callReceive Socket (Connect Call) =====================
  socket.on("callReceive", async (data) => {
    console.log("========= callReceive In Data =========", data);
    console.log("========= callReceive In videoCallRoom =========", videoCallRoom);
    const callDetail = await History.findById(data.callId);
    if (callDetail) {
      const sender = await User.findById(callDetail.userId);
      const receiver = await User.findById(callDetail.receiverId);

      const number = await roundNumber(data.coin);

      if (sender && sender.coin >= data.coin) {
        // Call History
        await History.updateMany(
          { callUniqueId: data.callId, callConnect: false },
          {
            $set: {
              callConnect: true,
              callStartTime: new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
              }),
            },
          },
          {
            $new: true,
          }
        );
        // Sender History
        await History.updateOne(
          { callUniqueId: data.callId, isIncome: false },
          {
            $inc: { coin: number },
          },
          {
            $new: true,
          }
        );
        // Receiver History
        await History.updateOne(
          { callUniqueId: data.callId, isIncome: true },
          {
            $inc: { diamond: parseInt(number) },
          },
          {
            $new: true,
          }
        );
      }

      sender.coin -= number;
      await sender.save();

      receiver.diamond += parseInt(number);
      await receiver.save();

      const chat = await Chat.findOne({ callId: videoCallRoom });

      if (chat) {
        chat.callType = 1; //1. receive , 2. decline , 3. missCall
        chat.isRead = true;

        await chat.save();
      }

      if (videoCallRoom) {
        io.in(videoCallRoom).emit("callReceive", sender, receiver);
      } else {
        io.in(data.videoCallRoom).emit("callReceive", sender, receiver);
      }
    }
  });

  // ===================== callCancel Socket (Sender Cut Call) =====================
  socket.on("callCancel", async (data) => {
    console.log("========= callCancel In Data =========", data);
    console.log("========= callCancel In callRoom =========", callRoom);

    if (callRoom) {
      console.log(" ================= callCancel emit =================");
      io.in(callRoom).emit("callCancel", data);

      const history = await History.findById(callRoom);
      const receiver = await User.findById(history.receiverId);
      const sender = await User.findById(history.userId);
      if (history) {
        if (receiver) {
          receiver.isBusy = false;
          await receiver.save();
          console.log("receiver busy false in call Cancel", receiver.isBusy);
        }

        if (sender) {
          sender.isBusy = false;
          await sender.save();
          console.log("sender busy false in call Cancel", sender.isBusy);
        }
      }
      const chatTopic = await ChatTopic.findOne({
        $or: [
          {
            $and: [{ senderId: sender._id }, { receiverId: receiver._id }],
          },
          {
            $and: [{ senderId: receiver._id }, { receiverId: sender._id }],
          },
        ],
      });
      var newChatTopic;
      if (!chatTopic) {
        newChatTopic = new ChatTopic();
      }
      const chat = await Chat.findOne({ callId: callRoom });

      if (chat) {
        console.log("SENDER &&&&&&&&&&&&&&&&&&&&", history.userId);
        chat.senderId = history.userId;
        chat.callType = 3; //3.missCall
        chat.isRead = true;
        await chat.save();

        const sender = await User.findById(data.callerId);
        const receiver = await User.findById(data.receiverId);

        if (receiver.fcm_token !== null) {
          const adminPromise = await admin;

          const payload = {
            token: receiver.fcm_token,
            notification: {
              body: "Miscall you",
              title: sender.name,
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
      }
    }
  });

  // ===================== callDisconnect Socket (Receiver Cut Call) =====================

  socket.on("callDisconnect", async (data) => {
    console.log("========= callDisconnect In Data =========", data);
    console.log("========= callDisconnect In callRoom =========", callRoom);

    if (callRoom) {
      query = callRoom;
    } else if (videoCallRoom) {
      query = videoCallRoom;
    }
    if (query) {
      const history = await History.findById(query);

      if (history) {
        await History.updateMany(
          { callUniqueId: new mongoose.Types.ObjectId(data.callId) },
          {
            $set: {
              callEndTime: new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
              }),
              duration: moment.utc(moment(new Date(history.callEndTime)).diff(moment(new Date(history.callStartTime)))) / 1000,
            },
          },
          { new: true }
        );

        const chat = await Chat.findOne({ callId: query }); //historyId

        console.log("{{{{{{{{{{{{{{{{{{{{ Before Chat }}}}}}}}}}}}}}}}}}}", chat);

        if (chat) {
          console.log("{{{{{{{{{{{{{{{{{{{{ After Chat }}}}}}}}}}}}}}}}}}}", chat);
          chat.callDuration = moment.utc(moment(new Date(history.callEndTime)).diff(moment(new Date(history.callStartTime)))).format("HH:mm:ss");
          chat.callType = 1; // 1. receive
          chat.isRead = true;
          chat.messageType = 5;
          await chat.save();
        }

        console.log("{{{{{{{{{{{{{{{{{{{{ After SAVE Chat }}}}}}}}}}}}}}}}}}}", chat);
      }
    }

    const callHistory = await History.find({ callUniqueId: data.callId });

    if (callHistory.length > 0) {
      const receiver = await User.findById(callHistory[0].receiverId);

      if (receiver) {
        receiver.isBusy = false;
        await receiver.save();

        console.log("receiver busy in callDisconnect", receiver.isBusy);
      }

      const user = await User.findById(callHistory[0].userId);

      if (user) {
        user.isBusy = false;
        await user.save();

        console.log("user busy in callDisconnect---------", user.isBusy);
      }
    }
  });

  socket.on("disconnect", async () => {
    //host Is Offline
    if (globalRoom) {
      console.log("check In globalRoom Disconnect +++++++++++++++++++++", globalRoom);
      const user = await User.findById(globalRoom);

      if (user) {
        user.isOnline = false;
        user.isBusy = false;
        user.isLive = false;
        await user.save();
      }
    }

    //Save Live Duration And End Time Save In History
    const liveStreamingHistory = await LiveStreamingHistory.findById(liveRoom);

    if (showUserRoom) {
      const user = await User.findById(showUserRoom);
      if (user.isLive) {
        if (liveStreamingHistory) {
          liveStreamingHistory.endTime = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          });

          liveStreamingHistory.duration = moment.utc(moment(new Date(liveStreamingHistory.endTime)).diff(moment(new Date(liveStreamingHistory.startTime)))) / 1000;

          await liveStreamingHistory.save();

          await LiveView.deleteMany({
            liveStreamingId: liveStreamingHistory._id,
          });

          const liveUser = await LiveUser.findOne({
            liveStreamingId: liveStreamingHistory._id,
          });
          if (liveUser) {
            await liveUser.deleteOne();
          }
          console.log("-------- DELETE SUCCESS LIVE USER $$$$$$$$$$$$$$$$$$$");
        }
      }
    }

    if (liveUserRoom) {
      const user = await User.findById(liveUserRoom);

      user.isLive = false;
      user.isBusy = false;
      await user.save();

      const liveView = await LiveView.findOne({
        userId: liveUserRoom,
        liveStreamingId: liveRoom,
      });
      console.log("------------------- liveView in liveUserRoom^^^^^^^^^^^^^", liveView);

      if (liveView) {
        const liveStreamingHistory = await LiveStreamingHistory.findById(liveView.liveStreamingId);
        console.log("LiveStreaming-----------", liveStreamingHistory);

        await LiveUser.updateOne(
          { _id: liveStreamingHistory._id, "view.userId": liveUserRoom },
          {
            $set: {
              "view.$.isAdd": false,
            },
          }
        );
        await liveView.deleteOne();
      }

      const liveUser = await LiveUser.findOne({ userId: liveUserRoom });
      console.log("-----------liveUser in liveUserRoom-----------", liveUser);

      if (liveUser) {
        await liveUser.deleteOne();
      }

      console.log("-------- DELETE SUCCESS liveUser $$$$$$$$$$$$$$$$$$$");
    }

    if ((videoCallRoom && !callRoom) || (callRoom && !videoCallRoom)) {
      if (callRoom) {
        query = callRoom;
      } else if (videoCallRoom) {
        query = videoCallRoom;
      }

      const history = await History.findById(query);
      if (query) {
        if (history) {
          await History.updateMany(
            { callUniqueId: new mongoose.Types.ObjectId(query) },
            {
              $set: {
                callEndTime: new Date().toLocaleString("en-US", {
                  timeZone: "Asia/Kolkata",
                }),
                duration: moment.utc(moment(new Date(history.callEndTime)).diff(moment(new Date(history.callStartTime)))) / 1000,
              },
            },
            { new: true }
          );

          const chat = await Chat.findOne({ callId: query }); //historyId

          if (chat) {
            chat.callDuration = moment.utc(moment(new Date(history.callEndTime)).diff(moment(new Date(history.callStartTime)))).format("HH:mm:ss");
            chat.callType = 1; // 1. receive
            chat.isRead = true;
            chat.messageType = 5;
            await chat.save();
          }

          const callerId = await User.findById(history.userId);
          const receiverId = await User.findById(history.receiverId);

          // Busy False Caller
          if (callerId) {
            callerId.isBusy = false;
            await callerId.save();
          }
          // Busy False receiver
          if (receiverId) {
            receiverId.isBusy = false;
            await receiverId.save();
          }
        }

        // Set Call StartTime To EndTime Duration In Chat List
        if (callRoom) {
          const chat = await Chat.findOne({ callId: callRoom }); //historyId

          if (chat) {
            chat.callDuration = moment.utc(moment(new Date(history.callEndTime)).diff(moment(new Date(history.callStartTime)))).format("HH:mm:ss");
            chat.callType = 1; // 1. receive
            chat.isRead = true;
            chat.messageType = 5;
            await chat.save();
          }
        }
      }
    }
  });
});
