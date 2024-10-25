import * as ActionType from "./CoinPlan.Type";
const initialState = {
  coinPlan: [],
  dialog: false,
  dialogData: null,
  total: null,
  totalCoin: null,
  totalDollar: null,
  history : [],

};
export const coinPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_COIN_PLAN:
      return {
        ...state,
        coinPlan: action.payload,
      };
    case ActionType.OPEN_COIN_PLAN_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case ActionType.CLOSE_COIN_PLAN_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    case ActionType.CREATE_COIN_PLAN:
      let data = [...state.coinPlan];
      data.unshift(action.payload);
      return {
        ...state,
        coinPlan: data,
      };
    case ActionType.EDIT_COIN_PLAN:
      return {
        ...state,
        coinPlan: state.coinPlan.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.DELETE_COIN_PLAN:
      return {
        ...state,
        coinPlan: state.coinPlan.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    case ActionType.ACTIVE_SWITCH:
      return {
        ...state,
        coinPlan: state.coinPlan.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
      case ActionType.PURCHASE_HISTORY:
        return {
          ...state,
          history : action.payload.history,
          totalCoin : action.payload.totalCoin,
          totalDollar : action.payload.totalDollar,
          total : action.payload.total,
        };
    default:
      return state;
  }
};
