import axios from "axios";
import { setToast } from "../../util/toast";
import * as ActionType from "./RedeemType";
import { apiInstanceFetch } from "../../util/api";

export const getRedeem = (type) => (dispatch) => {
  apiInstanceFetch
    .get(`WithdrawRequest/get?type=${type}`)
    .then((res) => {
     
      if (res.status) {
        dispatch({ type: ActionType.GET_REDEEM, payload: res.withdrawRequest });
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};

export const acceptRedeem = (id, type) => (dispatch) => {
  axios
    .patch(`WithdrawRequest/requestAccept/?withdrawRequestId=${id}&type=${type}`)
    .then((res) => {
      if (res.data.status) {
        setToast("success", "Accept Success!!");
        dispatch({ type: ActionType.ACCEPT_REDEEM, payload: id });
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};

export const acceptRedeemDecline = (id) => (dispatch) => {
  axios
    .patch(`WithdrawRequest/requestDecline/?withdrawRequestId=${id}`)
    .then((res) => {
      if (res.data.status) {
        setToast("success", "Decline Success!!");

        dispatch({ type: ActionType.ACCEPT_REDEEM, payload: id });
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};
