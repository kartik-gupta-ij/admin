const History = require("./history.model");

//import model
const User = require("../user/user.model");

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

//mongoose
const mongoose = require("mongoose");

exports.historyAdmin = async (req, res) => {
  try {
    if (!req.query.userId || !req.query.type) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!!" });
    }

    let type;
    if (req.query.type === "gift") {
      type = 0;
    } else if (req.query.type === "call") {
      type = 1;
    } else if (req.query.type === "purchase") {
      type = 2;
    } else if (req.query.type === "admin") {
      type = 3;
    }

    let userQuery, matchQuery, lookupQuery, unwindQuery, projectQuery, user;

    if (req.query.userId) {
      userQuery = await User.findById(req.query.userId);

      user = userQuery;

      if (!user) {
        return res.status(200).json({ status: false, message: "User does not found!!" });
      }

      // matchQuery = {
      //   $and: [
      //     { userId: { $eq: user._id } },
      //     { type: { $eq: type } },
      //     {
      //       $or: [
      //         { isIncome: { $eq: false } },
      //         {
      //           $and: [{ isIncome: { $eq: true } }, { hostId: { $eq: null } }],
      //         },
      //       ],
      //     },
      //   ],
      // };

      // lookupQuery = {
      //   $lookup: {
      //     from: "hosts",
      //     let: { hostId: "$hostId" },
      //     as: "host",
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $eq: ["$$hostId", "$_id"],
      //           },
      //         },
      //       },
      //       {
      //         $project: {
      //           name: 1,
      //         },
      //       },
      //     ],
      //   },
      // };

      // projectQuery = {
      //   $project: {
      //     callStartTime: 1,
      //     callEndTime: 1,
      //     callConnect: 1,
      //     videoCallType: 1,
      //     duration: 1,
      //     coin: 1,
      //     diamond: 1,
      //     date: 1,
      //     isIncome: 1,
      //     type: 1,
      //     callType: {
      //       $cond: [
      //         { $eq: ["$callConnect", false] },
      //         "MissedCall",
      //         {
      //           $cond: [{ $eq: ["$userId", user._id] }, "Outgoing", "Incoming"],
      //         },
      //       ],
      //     },
      //     hostId: "$host._id",
      //     hostName: { $ifNull: ["$host.name", null] },
      //   },
      // };

      // unwindQuery = {
      //   $unwind: {
      //     path: "$host",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // };
    }

    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const addFieldQuery_ = {
      shortDate: {
        $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
      },
    };

    let dateFilterQuery = {};

    if (req.query.startDate && req.query.endDate) {
      sDate = req.query.startDate + "T00:00:00.000Z";
      eDate = req.query.endDate + "T00:00:00.000Z";

      dateFilterQuery = {
        shortDate: { $gte: new Date(sDate), $lte: new Date(eDate) },
      };
    }

    if (req.query.type === "gift" || req.query.type === "call") {
      const history = await History.aggregate([
        {
          $match: {
            $or: [
              {
                $and: [{ userId: { $eq: user._id } }, { type: { $eq: type } }, { isIncome: { $eq: false } }],
              },
              {
                $and: [{ receiverId: { $eq: user._id } }, { type: { $eq: type } }, { isIncome: { $eq: true } }],
              },
            ],
          },
        },
        {
          $addFields: {
            shortDate: {
              $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
            },
          },
        },
        {
          $match: dateFilterQuery,
        },
        {
          $sort: { date: -1 },
        },
        {
          $lookup: {
            from: "users",
            as: "user",
            let: {
              userId: {
                $cond: [{ $eq: ["$isIncome", true] }, "$userId", "$receiverId"],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$userId", "$_id"],
                  },
                },
              },
              {
                $project: {
                  name: 1,
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
          $project: {
            callStartTime: 1,
            callEndTime: 1,
            callConnect: 1,
            coin: 1,
            diamond: 1,
            receiverId: 1,
            date: 1,
            videoCallType: 1,
            isIncome: 1,
            duration: 1,
            type: 1,
            check: {
              $cond: [{ $eq: ["$isIncome", false] }, "$userId", "$receiverId"],
            },
            callType: {
              $cond: [
                { $eq: ["$callConnect", false] },
                "MissedCall",
                {
                  $cond: [
                    {
                      $eq: ["$userId", user._id],
                    },
                    "Outgoing",
                    "Incoming",
                  ],
                },
              ],
            },
            userId: "$user._id",
            name: { $ifNull: ["$user.name", null] },
          },
        },
        { $addFields: { sorting: { $toDate: "$date" } } },
        {
          $sort: { sorting: -1 },
        },
        {
          $facet: {
            callHistory: [
              { $skip: (start - 1) * limit }, //how many records you want to skip
              { $limit: limit },
            ],
            pageInfo: [
              { $group: { _id: null, totalRecord: { $sum: 1 } } }, //get total records count
            ],
            callCharge: [
              {
                $group: {
                  _id: null,
                  totalCoin: {
                    $sum: "$coin",
                  },
                  totalDiamond: {
                    $sum: "$diamond",
                  },
                },
              },
            ],
          },
        },
      ]);
      return res.status(200).json({
        status: true,
        message: "Success!!",
        // history,
        total: history[0].pageInfo.length > 0 ? history[0].pageInfo[0].totalRecord : 0,
        totalCoin: history[0].callCharge.length > 0 ? history[0].callCharge[0].totalCoin : 0,
        totalDiamond: history[0].callCharge.length > 0 ? history[0].callCharge[0].totalDiamond : 0,
        history: history[0].callHistory,
      });
    } else if (req.query.type === "admin") {
      //console.log("----ids----", ids);

      const history = await History.aggregate([
        { $match: { userId: { $eq: user._id }, type: 3 } },
        {
          $addFields: addFieldQuery_,
        },
        {
          $match: dateFilterQuery,
        },
        {
          $sort: { date: -1 },
        },
        {
          $project: {
            _id: 1,
            hostId: 1,
            isIncome: 1,
            coin: 1,
            userId: 1,
            type: 1,
            date: 1,
          },
        },
        {
          $facet: {
            history: [
              { $skip: (start - 1) * limit }, //how many records you want to skip
              { $limit: limit },
            ],
            pageInfo: [
              { $group: { _id: null, totalRecord: { $sum: 1 } } }, //get total records count
            ],
            totalCoin: [
              {
                $group: {
                  _id: null,
                  receiveCoin: {
                    $sum: {
                      $cond: [
                        {
                          $eq: ["$isIncome", true],
                        },
                        "$coin",
                        0,
                      ],
                    },
                  },
                  spendCoin: {
                    $sum: {
                      $cond: [
                        {
                          $eq: ["$isIncome", false],
                        },
                        "$coin",
                        0,
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ]);

      //console.log("------History------", history);

      return res.status(200).json({
        status: true,
        message: "Success!!",
        total: history[0].pageInfo.length > 0 ? history[0].pageInfo[0].totalRecord : 0,
        totalCoin: history[0].totalCoin.length > 0 ? history[0].totalCoin[0].receiveCoin - history[0].totalCoin[0].spendCoin : 0,
        history: history[0].history,
      });
    } else if (req.query.type === "purchase") {
      const history = await History.aggregate([
        { $match: { userId: user._id, type: 2, coinPlanId: { $ne: null } } },
        {
          $addFields: addFieldQuery_,
        },
        {
          $match: dateFilterQuery,
        },
        {
          $sort: { date: -1 },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
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
            from: "coinplans",
            localField: "coinPlanId",
            foreignField: "_id",
            as: "coinPlan",
          },
        },
        {
          $unwind: {
            path: "$coinPlan",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            paymentGateway: 1,
            name: "$user.name",
            purchaseDate: "$date",
            analyticDate: 1,
            coin: 1,
          },
        },
        {
          $facet: {
            history: [
              { $skip: (start - 1) * limit }, //how many records you want to skip
              { $limit: limit },
            ],
            pageInfo: [
              { $group: { _id: null, totalRecord: { $sum: 1 } } }, //get total records count
            ],
            planCoin: [
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: "$coin",
                  },
                },
              },
            ],
          },
        },
      ]);

      return res.status(200).json({
        status: true,
        message: "Success!!",
        total: history[0].pageInfo.length > 0 ? history[0].pageInfo[0].totalRecord : 0,
        totalCoin: history[0].planCoin.length > 0 ? history[0].planCoin[0].total : 0,
        history: history[0].history,
      });
    } else {
      return res.status(200).json({ status: false, message: "type must be passed valid." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

exports.makeCall = async (req, res) => {
  try {
    if (!req.body.callerUserId || !req.body.receiverUserId) {
      return res.status(200).json({ status: false, message: "Invalid Details!" });
    }

    const callerUserId = new mongoose.Types.ObjectId(req.body.callerUserId);
    const receiverUserId = new mongoose.Types.ObjectId(req.body.receiverUserId);

    const [callerUser, receiverUser] = await Promise.all([User.findById(callerUserId), User.findById(receiverUserId)]);

    if (!callerUser) {
      return res.status(200).json({ status: false, message: "Caller user does not Exist!" });
    }

    if (!receiverUser) {
      return res.status(200).json({ status: false, message: "Receiver user does not Exist!" });
    }

    if (!global.settingJSON) {
      return res.status(200).json({ status: false, message: "Setting does not found!!" });
    }

    const outgoing = new History();

    //Generate Token
    const role = RtcRole.PUBLISHER;
    const uid = req.body.agoraUID ? req.body.agoraUID : 0;
    const expirationTimeInSeconds = 24 * 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = await RtcTokenBuilder.buildTokenWithUid(global.settingJSON.agoraKey, global.settingJSON.agoraCertificate, outgoing._id.toString(), uid, role, privilegeExpiredTs);

    outgoing.userId = callerUser._id; //caller userId
    outgoing.type = 1; //3:call
    outgoing.isIncome = false;
    outgoing.receiverId = receiverUser._id; //call receiver hostId
    outgoing.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    outgoing.callUniqueId = outgoing._id;

    const income = new History();
    income.userId = callerUser._id; //caller userId
    income.type = 1; //3:call
    income.isIncome = true;
    income.receiverId = receiverUser._id; //call receiver hostId
    income.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    income.callUniqueId = outgoing._id;

    const videoCall = {
      callerId: req.body.callerUserId,
      receiverId: req.body.receiverUserId,
      callerImage: req.body.callerImage,
      callerName: req.body.callerName,
      token: token,
      channel: outgoing._id.toString(),
      callId: outgoing._id,
      isOnline: receiverUser.isOnline,
    };

    await Promise.all([outgoing.save(), income.save()]);

    return res.status(200).json({ status: true, message: "Success!!", callId: videoCall });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
