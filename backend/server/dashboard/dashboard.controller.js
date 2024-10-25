const Post = require("../post/post.model");
const User = require("../user/user.model");
const LiveUser = require("../liveUser/liveUser.model");
const Gift = require("../gift/gift.model");
const CoinPlan = require("../coinPlan/coinPlan.model");
const History = require("../history/history.model");

const moment = require("moment");

exports.dashboard = async (req, res) => {
  try {
    const promises = [
      User.find().countDocuments(),
      User.find({ isOnline: true }).countDocuments(),
      LiveUser.find().countDocuments(),
      Gift.find().countDocuments(),
      History.aggregate([
        {
          $match: {
            $expr: { $eq: ["$type", 2] },
          },
        },
        {
          $group: {
            _id: null,
            totalEarn: { $sum: "$dollar" },
            totalCoin: { $sum: "$coin" },
          },
        },
      ]),
    ];

    const [totalUser, activeUser, liveUser, totalGift, purchasePlan] = await Promise.all(promises);

    const dashboard = {
      totalUser,
      activeUser,
      liveUser,
      totalGift,
      totalEarn: purchasePlan.length > 0 ? purchasePlan[0].totalEarn : 0,
      totalCoin: purchasePlan.length > 0 ? purchasePlan[0].totalCoin : 0,
    };

    return res.status(200).json({
      status: true,
      message: "Successfully Commented!",
      dashboard,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

exports.analytic = async (req, res) => {
  try {
    var dateQuery;

    if (req.query.date == "year") {
      // ==== year ===
      var currentDate = new Date();

      var firstDayYear = new Date(currentDate.getFullYear(), 0, 1);
      var lastDayYear = new Date(currentDate.getFullYear(), 11, 31);

      const first = moment(firstDayYear).format("YYYY-MM-DD, HH:mm:ss A");
      const last = moment(lastDayYear).format("YYYY-MM-DD, HH:mm:ss A");
      dateQuery = {
        $gte: first,
        $lte: last,
      };
    } else if (req.query.date == "month") {
      // ==== month ===
      var month = new Date();
      var firstDayMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      var lastDayMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const first = moment(firstDayMonth).format("YYYY-MM-DD, HH:mm:ss A");
      const last = moment(lastDayMonth).format("YYYY-MM-DD, HH:mm:ss A");
      dateQuery = {
        $gte: first,
        $lte: last,
      };
    } else if (req.query.date == "week") {
      // ==== week ===
      var curr = new Date();
      var firstWeek = curr.getDate() - curr.getDay();
      var lastWeek = firstWeek + 6;
      var firstDayWeek = new Date(curr.setDate(firstWeek)).toUTCString();
      var lastDayWeek = new Date(curr.setDate(lastWeek)).toUTCString();

      const first = moment(firstDayWeek).format("YYYY-MM-DD, HH:mm:ss A");
      const last = moment(lastDayWeek).format("YYYY-MM-DD, HH:mm:ss A");
      dateQuery = {
        $gte: first,
        $lte: last,
      };
    } else {
      dateQuery = {
        $gte: req.query.startDate,
        $lte: req.query.endDate,
      };
    }

    if (req.query.type === "USER") {
      const user = await User.aggregate([
        {
          $addFields: {
            analyticDate: {
              $arrayElemAt: [{ $split: ["$date", ", "] }, 0],
            },
          },
        },
        {
          $match: {
            analyticDate: dateQuery,
          },
        },
        { $group: { _id: "$analyticDate", count: { $sum: 1 } } },
        {
          $sort: { _id: 1 },
        },
      ]);

      return res.status(200).json({ status: true, message: "Success!!", analytic: user });
    }

    // if (req.query.type === "LIVE USER") {
    //   const user = await LiveStreamingHistory.aggregate([
    //     {
    //       $addFields: {
    //         startTime: { $arrayElemAt: [{ $split: ["$startTime", ", "] }, 0] },
    //       },
    //     },
    //     {
    //       $match: {
    //         startTime: { $gte: req.query.startDate, $lte: req.query.endDate },
    //       },
    //     },
    //     {
    //       $group: {
    //         _id: { id: "$userId", time: "$startTime" },
    //         doc: { $first: "$$ROOT" },
    //       },
    //     },
    //     {
    //       $replaceRoot: { newRoot: "$doc" },
    //     },
    //     { $group: { _id: "$startTime", count: { $sum: 1 } } },
    //   ]);

    //   return res
    //     .status(200)
    //     .json({ status: true, message: "Success!!", analytic: user });
    // }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
