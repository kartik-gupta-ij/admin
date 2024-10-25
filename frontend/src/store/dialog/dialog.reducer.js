import * as ActionType from "./dialog.type";


const initialState = {
    dialog:  false,
    type:  "",
    dialogData:  null,

};

export const dialogueReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.OPEN_DIALOGUE:
            return {
                ...state,
                dialog: true,
                type: action.payload.type || "",
                dialogData: action.payload.data || null,
            };
        case ActionType.CLOSE_DIALOGUE:
            return {
                ...state,
                dialog: false,
                type: "",
                dialogData: null,
            };




        default:
            return state;
    }
};
