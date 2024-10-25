import { GET_SETTING, UPDATE_SETTING } from "./setting.type";

const initialState = {
  setting: {},
};

const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SETTING:
      return {
        ...state,
        setting: action.payload,
      };

    case UPDATE_SETTING:
      return {
        ...state,
        setting: {
          ...state.setting,
          razorPaySwitch: action.payload.razorPaySwitch,
          stripeSwitch: action.payload.stripeSwitch,
          isAppActive: action.payload.isAppActive,
          razorPay:action.payload.razorPay,
          isFake : action.payload.isFake
        },
      };
    default:
      return state;
  }
};

export default settingReducer;
