import React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
// react dropzone
import ReactDropzone from "react-dropzone";
import { connect, useSelector } from "react-redux";

import { createGift } from "../../../store/Gift/gift.action";
import { useEffect } from "react";


const AddGift = (props) => {
  const [coin, setCoin] = useState("");
  const [images, setImages] = useState([]);
  const [platFormType, setPlatFormType] = useState("");
  const [errors, setError] = useState({
    image: "",
    coin: "",
    category: "",
  });

  

  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !coin ||
      coin < 0 ||
      images.length === 0 ||
      !platFormType ||
      platFormType === "Select Package"
    ) {
      const errors = {};

      if (!coin) errors.coin = "Coin is Required!";
      if (coin < 0) errors.coin = "Invalid Coin!";
      if (!platFormType || platFormType === "Select Package")
        errors.platFormType = "Please select a Platform Type !";

      if (images.length === 0) errors.image = "Please select an Image!";

      return setError({ ...errors });
    } else {
      const coinValid = isNumeric(coin);
      if (!coinValid) {
        return setError({ ...errors, coin: "Invalid Coin!" });
      }
      

      const formData = new FormData();

      formData.append("coin", coin);
      formData.append("platFormType", platFormType);
      for (let i = 0; i < images.length; i++) {
        formData.append("image", images[i]);
      }

      props.createGift(formData);

      setTimeout(() => {
        history.push("/admin/gift");
      }, 3000);
    }
  };
  const onPreviewDrop = (files) => {
    setError({ ...errors, image: "" });
    files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages(images.concat(files));
  };

  const removeImage = (file) => {
    if (file.preview) {
      const image = images.filter((ele) => {
        return ele.preview !== file.preview;
      });
      setImages(image);
    }
  };
  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePervious = () => {
    history.goBack();
  };

  return (
    <>
      <div class="row layout-top-spacing align-items-center">
        <div class="col-xl-6 col-md-6  col-sm-12 col-12">
          <h4 className="table_title">Add Gift </h4>
        </div>
        <div className="col-xl-6 col-md-6  col-sm-12 col-12 text-end ">
          <button class="btn btn-primary" onClick={handlePervious}>
            <i className="fa-solid fa-angles-left text-white fs-4" />
          </button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col">
          <div class="card" style={{ borderRadius: "15px" }}>
            <div class="card-body card-overflow">
              <div class="d-sm-flex align-items-center justify-content-between mb-4"></div>

              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <div className="form-floating">
                        <input
                          type="number"
                          className="form-control pe-1"
                          required=""
                          id="Coin"
                          placeholder="20"
                          value={coin}
                          onChange={(e) => {
                            setCoin(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...errors,
                                coin: "Coin is Required!",
                              });
                            } else {
                              return setError({
                                ...errors,
                                coin: "",
                              });
                            }
                          }}
                          onKeyPress={handleKeyPress}
                        />
                        <label htmlFor="Coin">Coin</label>
                      </div>
                      {errors.coin && (
                        <div className="ml-2 mt-1">
                          {errors.coin && (
                            <div className="pl-1 text__left">
                              <span
                                className="font-size-lg text-danger"
                                style={{ fontWeight: "600" }}
                              >
                                {errors.coin}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        name="type"
                        className="form-control form-control-line"
                        id="type"
                        value={platFormType}
                        onChange={(e) => {
                          setPlatFormType(e.target.value);
                          if (e.target.value == "Select PlatformType") {
                            return setError({
                              ...errors,
                              platFormType: "Please select a Platform Type !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              platFormType: "",
                            });
                          }
                        }}
                        onKeyPress={handleKeyPress}
                      >
                        <option value="Select PlatformType">
                          ---Select PlateForm Type---
                        </option>

                        <option value="0">Android</option>
                        <option value="1">IOS</option>
                        <option value="2">Both</option>
                      </select>
                      <label htmlFor="PlateForm">PlateForm</label>
                    </div>
                    {errors.platFormType && (
                      <div class="pl-1 text-left">
                        <div className="pl-1 text__left">
                          <span
                            className="font-size-lg text-danger"
                            style={{ fontWeight: "600" }}
                          >
                            {errors.platFormType}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-6 ">
                    <label class="float-left ">
                      Select (Multiple) Image or GIF
                    </label>

                    <>
                      <ReactDropzone
                        onDrop={(acceptedFiles) => onPreviewDrop(acceptedFiles)}
                        accept="image/*"
                        multiple={true}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section className="mt-4">
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className="select_image">
                                <i
                                  className="fas fa-plus"
                                  style={{
                                    paddingTop: 30,
                                    fontSize: 70,
                                    color: "#808080",
                                  }}
                                ></i>
                              </div>
                            </div>
                          </section>
                        )}
                      </ReactDropzone>

                      {errors.image && (
                        <div className="ml-2 mt-1">
                          {errors.image && (
                            <div className="pl-1 text__left">
                              <span
                                className="font-size-lg text-danger"
                                style={{ fontWeight: "600" }}
                              >
                                {errors.image}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  </div>
                  <div className="col-lg-8 mt-6">
                    {images.length > 0 && (
                      <>
                        {images.map((file, index) => {
                          return (
                            file.type?.split("image")[0] === "" && (
                              <>
                                <img
                                  height="60px"
                                  width="60px"
                                  alt="app"
                                  src={file.preview}
                                  style={{
                                    boxShadow:
                                      "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                    border: "2px solid #a5a5a5",
                                    borderRadius: 10,
                                    marginTop: 10,
                                    float: "left",
                                    objectFit: "cover",
                                    marginRight: 15,
                                    padding: "3px",
                                  }}
                                  draggable="false"
                                />
                                <div
                                  class="img-container"
                                  style={{
                                    display: "inline",
                                    position: "relative",
                                    float: "left",
                                  }}
                                >
                                  <i
                                    class="fas fa-times-circle text-primary"
                                    style={{
                                      position: "absolute",
                                      right: "10px",
                                      top: "4px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => removeImage(file)}
                                  ></i>
                                </div>
                              </>
                            )
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-5 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn-grad"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #306689 0%, #26a0da  51%, #306689  100%)",
                    }}
                    onClick={handleSubmit}
                  >
                    Insert
                  </button>
                  <button
                    type="button"
                    className="btn-grad "
                    onClick={() => {
                      history.push("/admin/gift");
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { createGift })(AddGift);
