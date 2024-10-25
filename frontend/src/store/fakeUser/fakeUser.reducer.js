import * as ActionType from "./fakeUser.type";

const initialState = {
  fakeUser: [],
  dialog: false,
  dialogData: null,
};
export const fakeUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_FAKE_USER:
      return {
        ...state,
        fakeUser: action.payload,
      };
    case ActionType.OPEN_FAKE_USER_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case ActionType.CLOSE_FAKE_USER_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    case ActionType.CREATE_FAKE_USER:
      let data = [...state.fakeUser];
      data.unshift(action.payload);
      return {
        ...state,
        fakeUser: data,
      };
    case ActionType.EDIT_FAKE_USER:
      return {
        ...state,
        fakeUser: state.fakeUser.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.DELETE_FAKE_USER:
      return {
        ...state,
        fakeUser: state.fakeUser.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    case ActionType.LIVE_SWITCH:
      return {
        ...state,
        fakeUser: state.fakeUser.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };

    default:
      return state;
  }
};
