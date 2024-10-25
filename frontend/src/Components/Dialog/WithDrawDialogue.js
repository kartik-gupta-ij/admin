
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_WITHDRAW } from "../../store/withdraw/withdraw.type";

import {
    updateWithdraw,
    createWithdraw,
} from "../../store/withdraw/withdraw.action";
import { baseURL } from "../../util/config";

import { CLOSE_DIALOGUE } from "../../store/dialog/dialog.type";
const WithdrawDialogue = (props) => {
    const { dialog: open, dialogData } = useSelector((state) => state.dialog);
    

    const [name, setName] = useState("");

    const [details, setDetails] = useState("");
    const [addDetails, setAddDetails] = useState([]);
    const [image, setImage] = useState([]);
    const [imagePath, setImagePath] = useState("");
    const [error, setError] = useState("");

    const addDetailsList = (e) => {
        e.preventDefault();
        setAddDetails((old) => {
            if (Array.isArray(old)) {
                return [...old, details]; 
            } else {
                return [details];
            }
        });
        setDetails("");
    };


    const onRemove = (id) => {
        setAddDetails((old) => {
            return old.filter((arry, index) => {
                return index !== id;
            });
        });
    };

    useEffect(() => {
        setName(dialogData?.name);
        setImagePath(baseURL + dialogData?.image);
        setAddDetails(dialogData?.details?.split(","));
    }, [dialogData]);

    useEffect(
        () => () => {
            setName("");
            setImagePath("");
            setImage([]);
            setAddDetails([]);
            setError({ name: "", details: "", description: "", image: "" });
        },
        [open]
    );
    const dispatch = useDispatch();

    const handelSubmit = () => {
        if (!name || !imagePath) {
            const error = {};
            if (!name) error.name = "Name is required!";
            if (addDetails.length === 0) error.details = "details is required!";

            if (image.length === 0) error.image = "image is required!";
            return setError({ ...error });
        } else {
            

            const formData = new FormData();
            formData.append("name", name);

            formData.append("details", addDetails);

            formData.append("image", image);

            if (dialogData?._id) {
               dispatch( updateWithdraw(dialogData?._id, formData))
            } else {
                dispatch(createWithdraw(formData))
            }
            dispatch({ type: CLOSE_DIALOGUE });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handelSubmit();
        }
    };

    // show dialog image
    const handleImage = (e) => {
        setImage(e.target.files[0]);
        setImagePath(URL.createObjectURL(e.target.files[0]));
    };;
    return (
        <div className="dialog">
            <div class="w-100">
                <div class="row justify-content-center">
                    <div class="col-xl-5 col-md-8 col-11">
                        <div class="mainDiaogBox">
                            <div class="d-flex justify-content-between align-items-center formHead">
                                <div className="">
                                    <h2 className="text-theme m0">Coin plan Dialogue</h2>
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
                                <div className="col-12 ">
                                    <div className="inputData text  flex-row justify-content-start text-start">
                                        <label htmlFor="name" className="ms-2 order-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required=""
                                            id="Name"
                                            placeholder=" "
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                if (!e.target.value) {
                                                    return setError({
                                                        ...error,
                                                        name: "Name is Required !",
                                                    });
                                                } else {
                                                    return setError({
                                                        ...error,
                                                        name: "",
                                                    });
                                                }
                                            }}
                                            onKeyPress={handleKeyPress}
                                        />
                                        {error && (
                                            <p className="errorMessage text-start">
                                                {error && error?.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="form-floating w-100">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            id="Details"
                                            required
                                            className="form-control mb-2 pe-1 mt-0"
                                            value={details}
                                            onChange={(e) => {
                                                setDetails(e.target.value);
                                            }}
                                        />
                                        <label for="Details"> Details</label>
                                    </div>

                                    {details !== "" && (
                                        <div
                                            className="btn btn-info px-3 py-3 text-white ml-2 d-flex align-items-center justify-content-center"
                                            style={{
                                                marginTop: "4px",
                                                height: "49px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                            }}
                                            onClick={addDetailsList}
                                        >
                                            <span>ADD</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-2 pe-1">
                                    <div className="displayCountry form-control border p-1">
                                        {addDetails?.map((item, id) => {
                                            return (
                                                <>
                                                    <span className="">
                                                        {item}
                                                        <i
                                                            class="fa-solid fa-circle-xmark ms-2"
                                                            onClick={() => {
                                                                onRemove(id);
                                                            }}
                                                        ></i>
                                                    </span>
                                                </>
                                            );
                                        })}
                                    </div>
                                    {error.details && (
                                        <div className="ml-1 mt-1">
                                            {error.details && (
                                                <div className="pl-1 text__left">
                                                    <span className="text-danger">{error.details}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>


                                <div>
                                    <div className="form-group mb-0">
                                        <p className="form-label mt-3">Image</p>
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
                                                accept="image/png ,image/jpg , image/jpeg"
                                                className="form-control "
                                                autocomplete="off"
                                                tabIndex="-1"
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    transform: "scale(3.5)",
                                                    opacity: 0,
                                                }}
                                                onChange={(e) => handleImage(e)}
                                                onKeyPress={handleKeyPress}
                                            />
                                        </div>
                                        {imagePath && (
                                            <img
                                                src={imagePath}
                                                alt="withdraw"
                                                draggable="false"
                                                className="mt-2 ml-2"
                                                style={{
                                                    width: "120px",
                                                    height: "80px",
                                                    borderRadius: "12px",
                                                }}
                                            />
                                        )}
                                    </div>

                                    {error.image && (
                                        <div className="ml-1 mt-1">
                                            {error.image && (
                                                <div className="pl-1 text__left">
                                                    <span className="text-danger">{error.image}</span>
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
                                            onClick={handelSubmit}
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

export default WithdrawDialogue;
