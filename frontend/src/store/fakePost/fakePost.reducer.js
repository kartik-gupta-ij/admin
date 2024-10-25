import * as ActionType from "./fakePost.type";

const initialState = {
  fakePost: [],
  dialog: false,
  dialogData: null,
};
export const fakePostReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_FAKE_POST:
      return {
        ...state,
        fakePost: action.payload,
      };
    case ActionType.OPEN_FAKE_POST_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case ActionType.CLOSE_FAKE_POST_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    case ActionType.CREATE_FAKE_POST:
      let data = [...state.fakePost];
      data.unshift(action.payload);
      return {
        ...state,
        fakePost: data,
      };
    case ActionType.EDIT_FAKE_POST:
      return {
        ...state,
        fakePost: state.fakePost.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.DELETE_FAKE_POST:
      return {
        ...state,
        fakePost: state.fakePost.filter(
          (data) => data._id !== action.payload && data
        ),
      };
  

    default:
      return state;
  }
};
