import React from "react";
import { useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    updateFakePost,
    createFakePost,
} from "../../store/fakePost/fakePost.action";
import { getFakeUser } from "../../store/fakeUser/fakeUser.action";


import { CLOSE_DIALOGUE } from "../../store/dialog/dialog.type";

const FakePostDialogue = () => {
    const dispatch = useDispatch();

    const { dialog: open, dialogData } = useSelector((state) => state.dialog);
    const { fakeUser } = useSelector((state) => state.fakeUser);
    

    const [userName, setUserName] = useState("");
    const [image, setImage] = useState([]);
    const [description, setDescription] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        dispatch(getFakeUser());
    }, [dispatch]);

    useEffect(() => {
        setUserName("");
        setDescription("");
        setImagePath("");
        setError({ userName: "", description: "", image: "" });
    }, [open]);

    useEffect(() => {
        setUserName(dialogData?.userId._id);
        setDescription(dialogData?.description);
        setImagePath(dialogData?.postImage);
    }, [dialogData]);

    const handleSubmit = () => {
        if (!userName || userName === "Select User") {
            let error = {};
            if (!userName || userName === "Select User")
                error.userName = "User Is required";

            if (image.length === 0) error.image = "Image Is required";
            return setError({ ...error });
        } else {
            

            const formData = new FormData();
            formData.append("userId", userName);
            formData.append("description", description);
            formData.append("postImage", image);

            if (dialogData) {
                dispatch(updateFakePost(dialogData._id, formData))
            } else {
                dispatch(createFakePost(formData))
            }
            dispatch({ type: CLOSE_DIALOGUE });
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };
    const handleImage = (e) => {
        setImage(e.target.files[0]);
        setImagePath(URL.createObjectURL(e.target.files[0]));
    };
    return (
        <div className="dialog">
            <div class="w-100">
                <div class="row justify-content-center">
                    <div class="col-xl-5 col-md-8 col-11">
                        <div class="mainDiaogBox">
                            <div class="d-flex justify-content-between align-items-center formHead">
                                <div className="">
                                    <h2 className="text-theme m0">Fake Post Dialog</h2>
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
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <div className="form-floating">
                                            <select
                                                name="type"
                                                class="form-control form-control-line"
                                                id="UserName"
                                                disabled={dialogData ? true : false}
                                                value={userName}
                                                onChange={(e) => {
                                                    setUserName(e.target.value);

                                                    if (e.target.value === "Select User") {
                                                        return setError({
                                                            ...error,
                                                            userName: "User is required !",
                                                        });
                                                    } else {
                                                        return setError({
                                                            ...error,
                                                            userName: "",
                                                        });
                                                    }
                                                }}
                                                onKeyPress={handleKeyPress}
                                            >
                                                <option value="Select User">---Select User---</option>
                                                {fakeUser.map((data) => {
                                                    return (
                                                        <>
                                                            <option value={data._id}>{data.name}</option>
                                                        </>
                                                    );
                                                })}
                                            </select>
                                            <label for="userName">User</label>
                                        </div>
                                        {error.userName && (
                                            <div className="ml-1 mt-1">
                                                {error.userName && (
                                                    <div className="pl-1 text__left">
                                                        <span
                                                            className="font-size-lg text-danger"
                                                            style={{ fontWeight: "600" }}
                                                        >
                                                            {error.userName}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="inputData text  flex-row justify-content-start text-start">
                                        <label className="ms-2 order-1">
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required=""
                                            id="description"
                                            min="0"
                                            placeholder="Post Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        {error && (
                                            <p className="errorMessage text-start">
                                                {error && error?.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div>
                                        <div className="form-group mb-0">
                                            <p className="form-label mt-3">Image</p>
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
                                                    alt="fakeUser"
                                                    draggable="false"
                                                    className="mt-2 ms-3"
                                                    width="130"
                                                    height="130"
                                                    style={{
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {error.image && (
                                            <div className="ml-1 mt-1">
                                                {error.image && (
                                                    <div className="pl-1 text__left">
                                                        <span
                                                            className="font-size-lg text-danger"
                                                            style={{ fontWeight: "600" }}
                                                        >
                                                            {error.image}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
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

export default FakePostDialogue;
