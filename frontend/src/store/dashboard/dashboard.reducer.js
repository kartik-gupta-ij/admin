import * as ActionType from "./dashboard.type";

const initialState = {
  dashboard: {},
  analytic: [],
};

export const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_DASHBOARD:
      return {
        ...state,
        dashboard: action.payload,
      };
    case ActionType.GET_ANALCITE:
      return {
        ...state,
        analytic: action.payload,
      };
    default:
      return state;
  }
};
