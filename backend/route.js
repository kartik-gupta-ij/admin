const express = require("express");
const app = express.Router();

const adminRouter = require("./server/admin/admin.route");
app.use("/admin", adminRouter);

const DashboardRoute = require("./server/dashboard/dashboard.route");
app.use("/dashboard", DashboardRoute);

const UserRoute = require("./server/user/user.route");
app.use("/user", UserRoute);

const UserFakeRoute = require("./server/userFake/userFake.route");
app.use("/userFake", UserFakeRoute);

const SettingRoute = require("./server/setting/setting.route");
app.use("/setting", SettingRoute);

const FlagRoute = require("./server/flag/flag.route");
app.use("/flag", FlagRoute);

const BannerRoute = require("./server/banner/banner.route");
app.use("/banner", BannerRoute);

const LoginRoute = require("./server/login/login.route");
app.use("/login", LoginRoute);

const CoinPlanRoute = require("./server/coinPlan/coinPlan.route");
app.use("/coinPlan", CoinPlanRoute);

const FollowRoute = require("./server/follow/follow.route");
app.use("/follow", FollowRoute);

const PostRoute = require("./server/post/post.route");
app.use("/post", PostRoute);

const GiftRoute = require("./server/gift/gift.route");
app.use("/gift", GiftRoute);

const UserGiftRoute = require("./server/userGift/userGift.route");
app.use("/userGift", UserGiftRoute);

const LikeRoute = require("./server/like/like.route");
app.use("/like", LikeRoute);

const CommentRoute = require("./server/comment/comment.route");
app.use("/comment", CommentRoute);

const ReportRoute = require("./server/report/report.route");
app.use("/report", ReportRoute);

const BlockRoute = require("./server/block/block.route");
app.use("/block", BlockRoute);

const RedeemRoute = require("./server/redeem/redeem.route");
app.use("/redeem", RedeemRoute);

const NotificationRoute = require("./server/notification/notification.route");
app.use("/notification", NotificationRoute);

const ChatTopicRoute = require("./server/chatTopic/chatTopic.route");
app.use("/chatTopic", ChatTopicRoute);

const ChatRoute = require("./server/chat/chat.route");
app.use("/chat", ChatRoute);

const LiveUserRoute = require("./server/liveUser/liveUser.route");
app.use("/liveUSer", LiveUserRoute);

const WithdrawRoute = require("./server/withdraw/withdraw.route");
app.use("/withdraw", WithdrawRoute);

const WithdrawRequestRoute = require("./server/withDrawRequest/withDrawRequest.route");
app.use("/withdrawRequest", WithdrawRequestRoute);

const HistoryRoute = require("./server/history/history.route");
app.use("/history", HistoryRoute);

module.exports = app;
