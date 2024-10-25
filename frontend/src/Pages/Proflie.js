import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import $ from "jquery";

import { Link } from "react-router-dom";
import {
  getProfile,
  updateImage,
  profileUpdate,
  ChangePassword,
} from "../store/Admin/admin.action";

import profileImage from "../assets/img/2.png";
import { margin } from "@mui/system";
import male from "../assets/img/male.png";

const Proflie = (props) => {
  const admin = useSelector((state) => state.admin.admin);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [type, setType] = useState("Profile");
  


  useEffect(() => {
    setImage([]);
    dispatch(getProfile()); // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    setName(admin.name);
    setEmail(admin.email);
    setImagePath(admin.image);
    setError({ name: "", email: "" });
  }, [admin]);

  const handleEditName = () => {
    if (!name || !email) {
      let error = {};
      if (!name) error.name = "name is required !";
      if (!email) error.email = "email is required !";
      return setError({ ...error });
    } else {
      

      let data = {
        name,
        email,
      };
      props.profileUpdate(data);
    }
  };
  const handleUploadImage = (e) => {
    setImage(e.target.files[0]);
    setImagePath(URL.createObjectURL(e.target.files[0]));
  };

  const handleChangeImage = () => {
    
    const formData = new FormData();
    formData.append("image", image);
    props.updateImage(formData);
    setImage([]);
  };

  const handleChangePassword = () => {
    if (
      !oldPassword ||
      !newPassword ||
      !currentPassword ||
      newPassword !== currentPassword
    ) {
      let error = {};
      if (!oldPassword) error.oldPassword = "old Password Is Required!";
      if (!newPassword) error.newPassword = "New Password Is Required !";
      if (!currentPassword)
        error.currentPassword = "confirm Password Is Required !";
      if (newPassword !== currentPassword)
        error.currentPassword =
          "New Password and Confirm Password doesn't match";
      return setError({ ...error });
    } else {
      

      let data = {
        confirmPass: currentPassword,
        newPass: newPassword,
        oldPass: oldPassword,
      };
      props.ChangePassword(data);
    }
  };

  const handlePrevious = (url) => {
    window.open(url, "_blank");
  };

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", male);
    });
  });

  return (
    <div className="container-fluid px-2 px-md-4">
      <div className="py-2 profile-image">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12 ps-0">
          <h4 className="table_title">Profile</h4>
        </div>
      </div>
      <div
        className="card p-3 col-12 card-height"
        style={{ borderRadius: "26px 26px 26px 26px" }}
      >
        <div className="col-12 profile_Image  mt-4 ">
          <img
            src={profileImage}
            style={{
              width: "100%",
              height: "450px",
              boxSizing: "border-box",
              objectFit: "cover",
              borderRadius: "12px",
            }}
            alt=""
            srcset=""
          />
        </div>
        <div className="profile-content  card-body mx-auto mt-n6">
          <div className="row ">
            <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xxl-4 mb-4 px-2">
              <div className="card">
                <div className="card-body">
                  <div className="position-relative mx-auto adminProfile_image">
                    <input
                      id="file-input"
                      type="file"
                      accept="image/png ,image/jpg , image/jpeg"
                      className="d-none"
                      onChange={(e) => handleUploadImage(e)}
                    />
                    <img
                      src={imagePath}
                      alt="admin"
                      className="mx-auto p-1 border adminProfile_image "
                      onClick={() => handlePrevious(imagePath)}
                    />
                    <div className="camera_icon">
                      <div
                        style={{
                          background: "#EA0062",
                          borderRadius: "50px",
                          height: "36px",
                          border: "2px solid #FFFFFF",
                        }}
                      >
                        <label for="file-input">
                          <i
                            class="fa-solid fa-camera d-flex justify-content-center  rounded-circle  p-2 cursorPointer"
                            style={{
                              fontSize: "15px",
                              color: "#ffff",
                              cursor: "pointer",
                            }}
                          ></i>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="text-center my-4 pb-4">
                    <h2 className="fw-semibold text-dark"> {admin.name}</h2>
                    <div className="mt-4">
                      <button
                        disabled={image.length === 0 ? true : false}
                        onClick={handleChangeImage}
                        className="text-end btn  button ml-2 text-white"
                        style={{ backgroundColor: "#E4065D" }}
                      >
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-9 col-xxl-8 px-1">
              <div className="row EditBar mx-2 ">
                <div className="col-12 col-md-6 col-lg-3 col-xxl-4 pt-5 d-flex adminProfile_title px-4">
                  <div>
                    <h4
                      className={`py-1  my-4 profile ${
                        type === "Profile" && "activeLine "
                      }`}
                      onClick={() => {
                        setType("Profile");
                      }}
                    >
                      Edit Profile
                    </h4>
                    <h4
                      className={`py-1  my-4 profile ${
                        type === "password" && "activeLine1  "
                      }`}
                      onClick={() => {
                        setType("password");
                      }}
                    >
                      Change Password
                    </h4>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-9 col-xxl-8 py-4">
                  {type === "Profile" ? (
                    <div className="py-5">
                      <div className="py-3">
                        <div className="form-floating ">
                          <input
                            type="text"
                            placeholder="name"
                            id="UserName"
                            className="form-control"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  name: "name is required !",
                                });
                              } else {
                                return setError({
                                  ...error,
                                  name: "",
                                });
                              }
                            }}
                          />
                          <label htmlFor="UserName">Name</label>
                          {error.name && (
                            <span className="text-danger">{error.name}</span>
                          )}
                        </div>
                      </div>
                      <div className="py-3">
                        <div className="form-group">
                          <div className="mb-2">
                            <div className="form-floating">
                              <input
                                type="email"
                                placeholder="email"
                                id="UserEmail"
                                className="form-control "
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      email: "email is required !",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      email: "",
                                    });
                                  }
                                }}
                              />
                              <label htmlFor="UserEmail">Email</label>
                            </div>
                          </div>
                          {error.email && (
                            <span className="text-danger">{error.email}</span>
                          )}
                        </div>
                      </div>
                      <div className="d-flex  mr-3">
                        <button
                          onClick={handleEditName}
                          className="text-end btn text-white"
                          style={{
                            backgroundColor: "#E4065D",
                            fontSize: "17px",
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="form-group pt-3">
                        <div className="mb-2">
                          <div className="form-floating">
                            <input
                              type="password"
                              placeholder=" "
                              id="OldPass"
                              className="form-control mr-4"
                              onChange={(e) => {
                                setOldPassword(e.target.value);
                                if (!e.target.value) {
                                  return setError({
                                    ...error,
                                    oldPassword: "Old Password is required !",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    oldPassword: "",
                                  });
                                }
                              }}
                            />
                            <label htmlFor="OldPass">Old Password</label>
                            {error.oldPassword && (
                              <span className="text-danger">
                                {error.oldPassword}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="mb-2">
                          <div className="form-floating">
                            <input
                              type="password"
                              placeholder=" "
                              id="NewPass"
                              className="form-control mr-4 mt-2"
                              onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (!e.target.value) {
                                  return setError({
                                    ...error,
                                    newPassword: "New Password is required !",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    newPassword: "",
                                  });
                                }
                              }}
                            />
                            <label htmlFor="NewPass">New Password</label>
                          </div>
                          {error.newPassword && (
                            <span className="text-danger">
                              {error.newPassword}
                            </span>
                          )}
                        </div>
                        {/* </div> */}
                      </div>

                      <div className="form-group ">
                        <div className="mb-2">
                          <div className="form-floating">
                            <input
                              type="password"
                              placeholder=" "
                              id="Conform"
                              className="form-control mr-4 mt-2"
                              onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                if (!e.target.value) {
                                  return setError({
                                    ...error,
                                    currentPassword:
                                      "Confirm Password is required !",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    currentPassword: "",
                                  });
                                }
                              }}
                            />
                            <label htmlFor="Conform"> Confirm Password</label>
                          </div>
                          {error.currentPassword && (
                            <span className="text-danger">
                              {error.currentPassword}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="d-flex  mr-4 ">
                        <button
                          onClick={handleChangePassword}
                          className="text-end btn text-white"
                          style={{
                            backgroundColor: "#E4065D",
                            fontSize: "17px",
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
  getProfile,
  updateImage,
  profileUpdate,
  ChangePassword,
})(Proflie);
