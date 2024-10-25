//axios
import axios from "axios";

//toast
import { setToast } from "../../util/toast";

import { GET_COMPLAINT, SOLVED_COMPLAINT } from "./complaint.type";
import { apiInstanceFetch } from "../../util/api";

export const getComplaint = (type, ) => (dispatch) => {

  apiInstanceFetch
    .get(`report?type=${type}`)
    .then((res) => {
      
      if (res.status) {
        dispatch({ type: GET_COMPLAINT, payload: res.report });
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};

export const solvedComplaint = (id) => (dispatch) => {
  // axios
  //   .patch(`complaint/complaintId?complaintId=${id}`)
  //   .then((res) => {
  //     if (res.data.status) {
  //       dispatch({ type: SOLVED_COMPLAINT, payload: res.data.data });
  //       setToast("success", "Complain Solved Successfully");
  //     } else {
  //       setToast("error", res.data.message);
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     setToast("error", error.message);
  //   });
};
