import axios from "axios";
import { setToast } from "../../util/toast";
import * as ActionType from "./withdraw.type";
import { apiInstanceFetch } from "../../util/api";
// get withdraw
export const getWithdraw = () => (dispatch) => {
  apiInstanceFetch
    .get(`withdraw`)
    .then((res) => {

      dispatch({ type: ActionType.GET_WITHDRAW, payload: res.withdraw });
    })
    .catch((error) => console.log(error.message));
};

// create withdraw

export const createWithdraw = (formData) => (dispatch) => {
  axios
    .post(`withdraw`, formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_WITHDRAW,
          payload: res.data.withdraw,
        });
        setToast("success", "withdraw created successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// edit withdraw

export const updateWithdraw = (id, formData) => (dispatch) => {
  console.log("id", id);
  axios
    .patch(`withdraw?withdrawId=${id}`, formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_WITHDRAW,
          payload: { data: res.data.withdraw, id },
        });
        setToast("success", "withdraw update successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// delete withdraw

export const deleteWithdraw = (data) => (dispatch) => {
  axios
    .delete(`withdraw?withdrawId=${data}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_WITHDRAW,
          payload: data,
        });
        setToast("success", "withdraw update successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};
