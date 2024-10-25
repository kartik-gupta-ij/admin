import * as ActionType from "./gift.type";

const initialState = {
  gift: [],
  dialogOpen: false,
  dialogData: null,
};
export const GiftReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_GIFT:
      return {
        ...state,
        gift: action.payload,
      };
    case ActionType.OPEN_GIFT_DIALOG:
      return {
        ...state,
        dialogOpen: true,
        dialogData: action.payload || null,
      };
    case ActionType.CLOSE_GIFT_DIALOG:
      return {
        ...state,
        dialogOpen: false,
        dialogData: null,
      };

    case ActionType.CREATE_NEW_GIFT:
      let data = [...state.gift];
      data.unshift(action.payload);
      return {
        ...state,
        gift: data,
      };

    case ActionType.EDIT_GIFT:
      return {
        ...state,
        gift: state.gift.map((gift) =>
          gift?._id === action.payload.id ? action.payload.data : gift
        ),
      };

    // case ActionType.EDIT_GIFT:
    //   let giftData = {
    //     data: state.gift.map((data) => {
    //       data.gift?.map((gift) =>
    //         gift?._id === action.payload.id ? action.payload.data : gift
    //       );
    //     }),
    //   };

    // return {
    //   ...state,
    //   gift: data,
    // };

    case ActionType.DELETE_GIFT:
      return {
        ...state,
        // gift: state.gift.filter((data) => data._id !== action.payload && data),
        gift: state.gift.filter((data) => data._id !== action.payload),
      };
    default:
      return state;
  }
};
