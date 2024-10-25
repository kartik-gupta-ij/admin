import React from "react";


import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { useState } from "react";
import { updateGift, createGift } from "../../../store/Gift/gift.action";

import { baseURL } from "../../../util/config";

import { CLOSE_DIALOGUE } from "../../../store/dialog/dialog.type";

function UpdateGift() {
    const [mongoId, setMongoId] = useState("");
    const [coin, setCoin] = useState("");
    const [category, setCategory] = useState("");
    const [platFormType, setPlatFormType] = useState("");
    const [imageData, setImageData] = useState(null);
    const [imagePath, setImagePath] = useState(null);
    const [errors, setError] = useState("");
    const { dialogOpen: open, dialogData } = useSelector((state) => state.dialog);
    



    useEffect(() => {
        if (dialogData) {
            setMongoId(dialogData?._id);
            setCoin(dialogData?.coin);
            setCategory(dialogData?.category);
            setPlatFormType(dialogData?.platFormType);
            setImagePath(baseURL + dialogData?.image);
        } else {
            setCoin("");
            setPlatFormType("");
            setImagePath("");
        }
    }, [dialogData]);

    const dispatch = useDispatch();

    const GiftClick = localStorage.getItem("giftClick");

    const categoryDetail = JSON.parse(localStorage.getItem("category"));

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            (!imageData && !imagePath) ||
            !coin ||
            platFormType === "Select PlatformType" ||
            (GiftClick !== null && (!category || category === "Select Category"))
        ) {
            let errors = {};
            if (!coin) errors.coin = "Coin is Required!";
            if (platFormType === "Select PlatformType")
                errors.platFormType = "Please select a Platform Type!";
            if (!imageData && !imagePath) errors.image = "Please select an Image!";


            setError({ ...errors });
        } else {
            const coinValid = isNumeric(coin);
            if (!coinValid) {
                return setError({ ...errors, coin: "Invalid Coin!!" });
            }
            

            const formData = new FormData();

            formData.append("image", imageData);
            formData.append("coin", coin);
            formData.append("platFormType", platFormType);




            dispatch(updateGift(mongoId, formData));
        }
        dispatch({ type: CLOSE_DIALOGUE });
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
    return (
        <div className="dialog">
            <div class="w-100">
                <div class="row justify-content-center">
                    <div class="col-xl-5 col-md-8 col-11">
                        <div class="mainDiaogBox">
                            <div class="d-flex justify-content-between align-items-center formHead">
                                <div className="">
                                    <h2 className="text-theme m0">Gift Dialog</h2>
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
                                            Coin
                                        </label>
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
                                        {errors && (
                                            <p className="errorMessage text-start">
                                                {errors && errors?.coin}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="inputData text  flex-row justify-content-start text-start">
                                        <label className="ms-2 order-1">
                                            Platform Type
                                        </label>
                                        <select
                                            name="type"
                                            class="form-control form-control-line"
                                            id="type platForm"
                                            value={platFormType}
                                            onChange={(e) => {
                                                setPlatFormType(e.target.value);

                                                if (e.target.value === "Select PlatformType") {
                                                    return setError({
                                                        ...errors,
                                                        platFormType: "Please select a Platform Type!",
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
                                        {errors && (
                                            <p className="errorsMessage text-start">
                                                {errors && errors?.platformType}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12 my-2">

                                    <div>
                                        <div className="form-group mb-0">
                                            <p className="form-label mt-3 ">Select Image or GIF</p>
                                        </div>
                                        <div
                                            role="presntation"
                                            tabIndex={0}
                                            className="d-flex align-items-center"
                                        >
                                            <div className="select_image">
                                                <i
                                                    className="fas fa-plus"
                                                    style={{
                                                        paddingTop: 30,
                                                        fontSize: 70,
                                                        color: "#808080",
                                                    }}
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

export default UpdateGift;
