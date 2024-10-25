import axios from "axios";

import { setToast } from "../../util/toast";
import * as ActionType from "./gift.type";
import { apiInstanceFetch } from "../../util/api";

const GiftClick = localStorage.getItem("giftClick");

// get gift category
export const getGift = () => (dispatch) => {
  apiInstanceFetch
    .get("gift")
    .then((res) => {
    
      dispatch({
        type: ActionType.GET_GIFT,
        payload: res.gift,
      });
    })
    .catch((error) => setToast("error", error.message));
};

// create gift
export const createGift = (formData) => (dispatch) => {
  axios
    .post(`gift`, formData)
    .then((res) => {
     
      if (res.data.status) {
        setToast("success", "gift Create Successfully");
        dispatch({ type: ActionType.CREATE_NEW_GIFT, payload: res.data.gift });
        setTimeout(() => {
          GiftClick !== null && (window.location.href = "/admin/gift");
        }, 1000);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) =>{
 
       setToast("error", error.message)});
};

// updateGift
export const updateGift = (id, formData) => (dispatch) => {
  axios
    .patch(`gift/?giftId=${id}`, formData)
    .then((res) => {
     
      if (res.data.status) {
        setToast("success", "gift Edit Successfully");
        dispatch({
          type: ActionType.EDIT_GIFT,
          payload: { data: res.data.gift, id },
        });
     
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => setToast("error", error.message));
};

// delete
export const deleteGift = (id) => (dispatch) => {
  axios
    .delete(`gift?giftId=${id}`)
    .then((res) => {
     
      if (res.data.status) {
        setToast("success", "gift Delete Successfully");
        dispatch({
          type: ActionType.DELETE_GIFT,
          payload: id,
        });
      } else {
        setToast("error", res.data.message);
        console.log("error.....", res.data.message);
      }
    })
    .catch((error) => setToast("error", error.message));
};
