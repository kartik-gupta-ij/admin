import axios from "axios";
import { setToast } from "../../util/toast";
import * as ActionType from "./banner.type";
import { apiInstanceFetch } from "../../util/api";
// get banner
export const getBanner = () => (dispatch) => {
  apiInstanceFetch
    .get(`banner`)
    .then((res) => {
      dispatch({ type: ActionType.GET_BANNER, payload: res.banner });
    })
    .catch((error) => console.log(error.message));
};

// creat banner

export const createBanner = (data) => (disaptch) => {
  axios
    .post(`banner`, data)
    .then((res) => {
      if (res.data.status) {
        disaptch({ type: ActionType.CREATE_BANNER, payload: res.data.banner });
        setToast("success", "banner created successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// edit banner

export const editBanner = (formData, id) => (dispatch) => {
  console.log("id", id);
  axios
    .patch(`banner?bannerId=${id}`, formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_BANNER,
          payload: { data: res.data.banner, id },
        });
        setToast("success", "banner update successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// delete banner

export const deleteBanner = (data) => (dispatch) => {
  axios
    .delete(`banner?bannerId=${data}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_BANNER,
          payload: data,
        });
        setToast("success", "banner update successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};
