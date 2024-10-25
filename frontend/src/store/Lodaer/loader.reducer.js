import * as ActionType from "./loader.type";

const initialState = {
  isLoading: false,
};
export const loaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.LOADER_OPEN:
      return {
        ...state,
        isLoading: true,
      };
    case ActionType.CLOSE_LOADER:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
