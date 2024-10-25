import axios from "axios";

import * as ActionType from "./fakePost.type";
import { setToast } from "../../util/toast";
import { apiInstanceFetch } from "../../util/api";

// get  Post

export const getFakePost = () => (dispatch) => {
  apiInstanceFetch
    .get("userFake/userFakePost")
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_FAKE_POST,
          payload: res.fakePost,
        });
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => console.log("error", error));
};

// create  Post

export const createFakePost = (formData) => (dispatch) => {
  axios
    .post(`/userFake/addFakePost`, formData)
    .then((res) => {

      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_FAKE_POST,
          payload: res.data.post,
        });
        setToast("success", " Post Create Successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error));
};

// update  Post
export const updateFakePost = (id, formData) => (dispatch) => {
  axios
    .patch(`userFake/userFakeUpdatePost?postId=${id}`, formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.EDIT_FAKE_POST,
          payload: {
            data: res.data.post,
            id,
          },
        });
        setToast("success", " Post Update Successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error));
};

// delete  Post
export const deleteFakePost = (id) => (dispatch) => {
  axios
    .delete(`/userFake/userFakeDeletePost?postId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_FAKE_POST,
          payload: id,
        });
        setToast("success", " Post Delete Successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error));
};
