import {
  GET_COMPLAINT,
  SOLVED_COMPLAINT,
  OPEN_COMPLAINT_DIALOG,
  CLOSE_COMPLAINT_DIALOG,
} from "./complaint.type";

const initialState = {
  complaint: [],
  dialog: false,
  dialogData: null,
};

const complaintReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMPLAINT:
      return {
        ...state,
        complaint: action.payload,
      };

    case OPEN_COMPLAINT_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_COMPLAINT_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    case SOLVED_COMPLAINT:
      return {
        ...state,
        complaint: state.complaint.filter(
          (complaint) => complaint._id !== action.payload._id
        ),
      };

    default:
      return state;
  }
};

export default complaintReducer;
