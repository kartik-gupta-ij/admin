import React, { useState } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setToast } from "../../util/toast";
import axios from "axios";

import male from "../../assets/img/male.png";
import { CLOSE_DIALOGUE } from "../../store/dialog/dialog.type";

const Notification = (props) => {
  const { dialog, dialogData } = useSelector((state) => state.dialog);
  const [open, setOpen] = React.useState(false);
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setError] = useState({
    title: "",
    image: "",
    description: "",
  });
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleInputImage = (e) => {
    if (e.target.files[0]) {
      setImageData(e.target.files[0]);
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError({
      title: "",
      image: "",
      description: "",
    });
    setTitle("");
    setDescription("");
    setImageData(null);
    setImagePath(null);
    $("#file").val("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !imageData || !imagePath) {
      const errors = {};

      if (!title) {
        errors.title = "Title can't be a blank!";
      }
      if (!description) {
        errors.description = "Description can't be a blank!";
      }

      if (!imageData || !imagePath) {
        errors.image = "Please select an Image!";
      }

      return setError({ ...errors });
    }

    setError({ ...errors, image: "" });
    setOpen(false);
    

    const formData = new FormData();
    formData.append("image", imageData);
    formData.append("title", title);
    formData.append("description", description);
    axios
      .post("notification", formData)
      .then((res) => {
        if (res.data.status === true) {
          setToast("success", "Notification sent successfully!");
          setOpen(false);

          setError({
            title: "",
            image: "",
            description: "",
          });
          setTitle("");
          setDescription("");
          setImageData(null);
          setImagePath(null);
        }
          dispatch({ type: CLOSE_DIALOGUE });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const HandleInputImage = (e) => {
    if (e.target.files[0]) {
      setImageData(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", male);
    });
  });
  return (
    <div className="dialog">
      <div class="w-100">
        <div class="row justify-content-center">
          <div class="col-xl-5 col-md-8 col-11">
            <div class="mainDiaogBox">
              <div class="d-flex justify-content-between align-items-center formHead">
                <div className="">
                  <h2 className="text-theme m0">Notification Dialog</h2>
                </div>
                <div className="">
                  <div
                    className="closeBtn boxCenter"
                    onClick={() => {
                      dispatch({ type: CLOSE_DIALOGUE });
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </div>
              </div>

              <div className="row align-items-start formBody">
                <div className="col-12 col-md-6">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="name" className="ms-2 order-1">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=" "
                      required
                      id="Title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);

                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            title: "Title can't be a blank!",
                          });
                        } else {
                          return setError({
                            ...errors,
                            title: "",
                          });
                        }
                      }}
                    />
                    {errors && (
                      <p className="errorMessage text-start">
                        {errors && errors?.coin}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label className="ms-2 order-1">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder=" "
                      id="Description"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);

                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            description: "Description can't be a blank!",
                          });
                        } else {
                          return setError({
                            ...errors,
                            description: "",
                          });
                        }
                      }}
                    />
                    {errors && (
                      <p className="errorMessage text-start">
                        {errors && errors?.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group mt-3 mb-4 pb-3">
                  <div>
                    <div className="form-group mb-0">
                      <p className="text-start">Select Image</p>
                    </div>
                    <div
                      role="presntation"
                      tabIndex={0}
                      className="d-flex align-items-center"
                    >
                      <div
                        style={{
                          height: 130,
                          width: 130,
                          border: "2px dashed gray",
                          textAlign: "center",
                          marginTop: 10,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <i
                          className="fas fa-plus"
                          style={{ paddingTop: 30, fontSize: 70 }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control "
                          autocomplete="off"
                          tabIndex="-1"
                          style={{
                            position: "absolute",
                            top: "40px",
                            transform: "scale(3.5)",
                            opacity: 0,
                          }}
                          onChange={HandleInputImage}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      {imagePath && (
                        <>
                          <img
                            height="70px"
                            width="70px"
                            alt="app"
                            className="ms-4"
                            src={imagePath}
                            draggable="false"
                            style={{
                              marginTop: 10,
                              float: "left",
                              borderRadius: "12px",
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2 ">
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn-grad"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #306689 0%, #26a0da  51%, #306689  100%)",
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn-grad"
                      onClick={() => {
                        dispatch({ type: CLOSE_DIALOGUE });
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification
