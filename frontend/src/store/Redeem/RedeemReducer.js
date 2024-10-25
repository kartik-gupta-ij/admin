import * as ActionType from "./RedeemType";

const initialState = {
  redeem: [],
};

export const redeemReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_REDEEM:
      return {
        ...state,
        redeem: action.payload,
      };
    case ActionType.ACCEPT_REDEEM:
      return {
        ...state,
        redeem: state.redeem.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    default:
      return state;
  }
};
