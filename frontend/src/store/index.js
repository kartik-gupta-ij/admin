import { combineReducers } from "redux";
import { adminReducer } from "./Admin/admin.reducer";
import { bannerReducer } from "./Banner/banner.reducer";
import { coinPlanReducer } from "./CoinPlan/CoinPlan.reducer";
import { GiftReducer } from "./Gift/gift.reducer";
import { loaderReducer } from "./Lodaer/loader.reducer";
import settingReducer from "./setting/setting.reducer";
import { UserReducer } from "./user/user.reducer";
import complaintReducer from "./Complaint/complaint.reducer";
import { dashboardReducer } from "./dashboard/dashboard.reducer";
import { redeemReducer } from "./Redeem/RedeemReducer";
import { withdrawReducer } from "./withdraw/withdraw.reducer";
import { fakeUserReducer } from "./fakeUser/fakeUser.reducer";
import { fakePostReducer } from "./fakePost/fakePost.reducer";
import { dialogueReducer } from "./dialog/dialog.reducer";

export default combineReducers({
  admin: adminReducer,
  dashboard: dashboardReducer,
  user: UserReducer,
  fakeUser: fakeUserReducer,
  fakePost: fakePostReducer,
  gift: GiftReducer,
  banner: bannerReducer,
  coinPlan: coinPlanReducer,
  complaint: complaintReducer,
  setting: settingReducer,
  isLoading: loaderReducer,
  redeem: redeemReducer,
  withdraw: withdrawReducer,
  dialog:dialogueReducer
});
