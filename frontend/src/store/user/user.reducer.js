import * as ActionType from "./user.type";

const initialState = {
  user: [],
  followers: [],
  userProfile: {},
  userHistory: [],
  totalData: 0,
  totalCoin: 0,
  total: 0,
  dialogue: false,
  dialogueData: null,
  postDetails: [],
};


export const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_USER:
      return {
        ...state,
        user: action.payload.userAll,
        total: action.payload.totalUser,

      };
    case ActionType.GET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case ActionType.GET_USER_BLOCK:
      return {
        ...state,
        user: state.user.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
        userProfile: action.payload.data,
      };
    case ActionType.GET_USER_HISTORY:
      console.log(action.payload);
      return {
        ...state,
        userHistory: action.payload.history,
        totalData: action.payload.total,
        totalCoin: action.payload.totalCoin,
        totalDiamond: action.payload.totalDiamond,
      };
    case ActionType.UPDATE_USER_COIN:
      return {
        ...state,
        user: action.payload.host,
      };
    case ActionType.GET_USER_FOLLOWERS_LIST:
      return {
        ...state,
        followers: action.payload,
      };
    case ActionType.SHOW_IMAGE_DIALOGUE:
    
      return {
        ...state,
        dialogue: true,
        dialogueData: action.payload || null,
      };
    case ActionType.CLOSE_IMAGE_DIALOGUE:
      return {
        ...state,
        dialogue: false,
        dialogueData: null,
      };
    case ActionType.GET_USER_POST_DETAILS:
      return {
        ...state,
        postDetails: action.payload,
      };
      case ActionType.LIVE_SWITCH:
        return {
          ...state,
          userProfile:action.payload
          
        };
    default:
      return state;
  }
};
