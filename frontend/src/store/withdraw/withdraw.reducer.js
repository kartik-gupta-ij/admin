import * as ActionType from "./withdraw.type";
const initialState = {
  withdraw: [],
  dialog: false,
  dialogData: null,
};
export const withdrawReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_WITHDRAW:
      return {
        ...state,
        withdraw: action.payload,
      };
    case ActionType.OPEN_WITHDRAW:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case ActionType.CLOSE_WITHDRAW:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    case ActionType.CREATE_WITHDRAW:
      let data = [...state.withdraw];
      data.unshift(action.payload);
      return {
        ...state,
        withdraw: data,
      };
    case ActionType.UPDATE_WITHDRAW:
      return {
        ...state,
        withdraw: state.withdraw.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.DELETE_WITHDRAW:
      return {
        ...state,
        withdraw: state.withdraw.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    default:
      return state;
  }
};
