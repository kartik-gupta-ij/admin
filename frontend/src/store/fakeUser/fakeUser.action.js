import axios from "axios";

import * as ActionType from "./fakeUser.type";
import { setToast } from "../../util/toast";
import { apiInstanceFetch } from "../../util/api";

// get Fake User

export const getFakeUser = () => (dispatch) => {
  apiInstanceFetch
    .get("user/userGet?userType=fake")
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.GET_FAKE_USER,
          payload: res.userAll,
        });
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => console.log("error", error));
};

// create fake user

export const createFakeUser = (formData) => (dispatch) => {
  axios
    .post(`/userFake/createUser`, formData)
    .then((res) => {
     
      if (res.data.status) {

        dispatch({
          type: ActionType.CREATE_FAKE_USER,
          payload: res.data.user,
        });
        setToast("success", "Fake User Create Successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error));
};

// update fake user
export const updateFakeUser = (id, formData) => (dispatch) => {
  axios
    .patch(`userFake/updatefakeUser?userId=${id}`, formData)
    .then((res) => {
     

      if (res.data.status) {
        dispatch({
          type: ActionType.EDIT_FAKE_USER,
          payload: {
            data: res.data.fakeUser,
            id,
          },
        });
        setToast("success", "Fake User Update Successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error));
};

// delete Fake User
export const deleteFakeUser = (id) => (dispatch) => {
  axios
    .delete(`userfake/deletefakeUser?userId=${id}`)
    .then((res) => {
    
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_FAKE_USER,
          payload: id,
        });
        setToast("success", "Fake User Delete Successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error));
};

export const liveUser = (user) => (dispatch) => {
  axios
    .put(`userFake/isLive?userId=${user._id}`)
    .then((res) => {
     
      dispatch({
        type: ActionType.LIVE_SWITCH,
        payload: { data: res.data.user, id: user._id },
      });
      setToast(
        "success",
        `${user.name} Is ${
          user.isLive !== true ? "IsLive Enable " : "IsLive Disable "
        } Successfully!`
      );
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};
