import axios from "axios";
import { setToast } from "../../util/toast";
import * as ActionType from "./admin.type";
import { apiInstanceFetch } from "../../util/api";

export const signupAdmin = (signup) => (dispatch) => {
  console.log("/admin/create", signup);
  axios
    .post("admin/signup", signup) 
    .then((res) => {
    
      if (res.data.status) {
        dispatch({ type: ActionType.SIGNUP_ADMIN });
        setToast("success", "Signup Successfully!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      setToast("error", error);
      console.log(error);
    });
};

export const updateCode = (signup) => (dispatch) => {
  axios
    .patch("admin/updateCode", signup)
    .then((res) => {
    
      if (res.data.status) {
        
        setToast("success", "Purchase Code Update Successfully !");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      setToast("error", error);
      console.log(error);
    });
};

export const loginAdmin = (login) => (dispatch) => {
  axios
    .post("admin/login", login) 
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.LOGIN_ADMIN, payload: res.data.token });
        setToast("success", "Login Successfully!");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      setToast("error", error);
      console.log(error);
    });
};

// get profile
export const getProfile = () => (dispatch) => {
  apiInstanceFetch
    .get("admin/adminData")
    .then((res) => {
      dispatch({ type: ActionType.PROFILE_ADMIN, payload: res.admin });
    })
    .catch((error) => console.log("error", error));
};

// handel Image Update

export const updateImage = (formData) => (dispatch) => {
  axios
    .patch("admin/updateImage", formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_IMAGE_PROFILE,
          payload: res.data.admin,
        });
        setToast("success", "Image Update Successfully");
      }
    })
    .catch((error) => {
      setToast("error", error);
    });
};

// handle update profile name  email

export const profileUpdate = (edit) => (dispatch) => {
  axios
    .patch("admin/updateAdmin", edit)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_PROFILE,
          payload: res.data.admin,
        });
        setToast("success", "Admin update Successfully");
      }
    })
    .catch((error) => {
      setToast("error", error);
    });
};

// change password

export const ChangePassword = (password) => (dispatch) => {
  axios
    .put(`admin/updatePassword`, password)
    .then((res) => {
      if (res.data.status) {
        setToast("success", "Change Your Password!");
        setTimeout(() => {
          dispatch({ type: ActionType.LOGOUT_ADMIN });
          window.location.href = "/";
        }, [3000]);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      setToast("error", error.message);
      console.log(error);
    });
};
