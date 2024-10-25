import * as ActionType from "./banner.type";
const initialState = {
  banner: [],
  dialog: false,
  dialogData: null,
};
export const bannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_BANNER:
      return {
        ...state,
        banner: action.payload,
      };
    case ActionType.OPEN_BANNER:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case ActionType.CLOSE_BANNER:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    case ActionType.CREATE_BANNER:
      let data = [...state.banner];
      data.unshift(action.payload);
      return {
        ...state,
        banner: data,
      };
    case ActionType.UPDATE_BANNER:
      return {
        ...state,
        banner: state.banner.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.DELETE_BANNER:
      return {
        ...state,
        banner: state.banner.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    default:
      return state;
  }
};
