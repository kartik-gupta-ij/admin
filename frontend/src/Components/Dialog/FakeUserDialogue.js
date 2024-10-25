import React from "react";
import { useState } from "react";
import {  useDispatch, useSelector } from "react-redux";


import { useEffect } from "react";
import {
    createFakeUser,
    updateFakeUser,
} from "../../store/fakeUser/fakeUser.action";
import { baseURL } from "../../util/config";

import { CLOSE_DIALOGUE } from "../../store/dialog/dialog.type";

const FakeUserDialogue = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [gender, setGender] = useState("");
    const [image, setImage] = useState([]);
    const [imagePath, setImagePath] = useState("");
    const [video, setVideo] = useState([]);
    const [videoPath, setVideoPath] = useState("");
    const [error, setError] = useState("");

    const { dialog: open, dialogData } = useSelector((state) => state.dialog);
    

    useEffect(
        () => () => {
            setName("");
            setEmail("");
            setAge("");
            setBio("");
            setImagePath("");
            setVideoPath("");
            setCountry("");
            setGender("");
            setError({
                name: "",
                bio: "",
                age: "",
                gender: "",
                email: "",
                country: "",
                image: "",
                video: "",
            });
        },
        [dialogData]
    );

    useEffect(() => {
        if (dialogData) {
            setName(dialogData.name);
            setEmail(dialogData.email);
            setBio(dialogData.bio);
            setGender(dialogData.gender);
            setAge(dialogData.age);
            setCountry(dialogData.country);
            setImagePath(dialogData.profileImage);
            setVideoPath(dialogData.video);
        }
    }, [dialogData]);
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    };

    const dispatch = useDispatch();
    const handleSubmit = () => {
        if (
            !name ||
            !email ||
            !gender ||
            !country ||
            !bio ||
            !age ||
            !imagePath ||
            !videoPath
        ) {
            let error = {};

            if (!name) error.name = "Name is required";
            if (!bio) error.bio = "Bio is required";
            if (!age) error.age = "Age is required";
            if (!email) error.email = "Email is required";
            if (!country) error.country = "Country is required";
            if (!gender) error.gender = "Gender is required";
            if (image.length === 0 && imagePath == "") {
                error.image = "image is required";
            }
            if (video.length === 0 && videoPath == "") {
                error.video = "video is required";
            }
            return setError({ ...error });
        } else {
            

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("country", country);
            formData.append("gender", gender);
            formData.append("bio", bio);
            formData.append("age", age);
            formData.append("profileImage", image);
            formData.append("video", video);
            if (dialogData) {
              dispatch( updateFakeUser(dialogData._id, formData));
            } else {
               dispatch(createFakeUser(formData));
            }
            dispatch({ type: CLOSE_DIALOGUE });
        }
    };


    const handleImage = (e) => {
        if (e.target.files[0] == 0) {
            setError({
                ...error,
                image: "image is required",
            });
        } else {
            setError({
                ...error,
                image: "",
            });
        }
        setImage(e.target.files[0]);
        setImagePath(URL.createObjectURL(e.target.files[0]));
    };

    const handleVideo = (e) => {
        if (e.target.files[0] == "") {
            setError({
                ...error,
                video: "image is required",
            });
        } else {
            setError({
                ...error,
                video: "",
            });
        }
        setVideo(e.target.files[0]);
        setVideoPath(URL.createObjectURL(e.target.files[0]));
    };
    return (
        <div className="dialog">
            <div class="w-100">
                <div class="row justify-content-center">
                    <div class="col-xl-5 col-md-8 col-11">
                        <div class="mainDiaogBox">
                            <div class="d-flex justify-content-between align-items-center formHead">
                                <div className="">
                                    <h2 className="text-theme m0">Fake User Dialog</h2>
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
                                            Name
                                        </label><input
                                            type="text"
                                            className="form-control"
                                            id="Name"
                                            required=""
                                            value={name}
                                            placeholder="name"
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                if (!e.target.value) {
                                                    return setError({
                                                        ...error,
                                                        name: "name is Required !",
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

                                <div className="col-12 col-md-6">
                                    <div className="inputData text  flex-row justify-content-start text-start">
                                        <label className="ms-2 order-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            required=""
                                            id="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (!e.target.value) {
                                                    return setError({
                                                        ...error,
                                                        email: "email is Required !",
                                                    });
                                                } else {
                                                    return setError({
                                                        ...error,
                                                        email: "",
                                                    });
                                                }
                                            }}
                                            onKeyPress={handleKeyPress}
                                        />
                                        {error && (
                                            <p className="errorMessage text-start">
                                                {error && error?.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="inputData text  flex-row justify-content-start text-start">
                                        <label htmlFor="" className="ms-2 order-1">
                                            Bio
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            required=""
                                            id="bio"
                                            placeholder="Bio"
                                            value={bio}
                                            onChange={(e) => {
                                                setBio(e.target.value);
                                                if (!e.target.value) {
                                                    return setError({
                                                        ...error,
                                                        bio: "bio is Required !",
                                                    });
                                                } else {
                                                    return setError({
                                                        ...error,
                                                        bio: "",
                                                    });
                                                }
                                            }}
                                        />
                                        {error && (
                                            <p className="errorMessage text-start">
                                                {error && error?.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="inputData text  flex-row justify-content-start text-start">
                                        <label className="ms-2 order-1">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            required=""
                                            id="age"
                                            placeholder="20"
                                            value={age}
                                            onChange={(e) => {
                                                setAge(e.target.value);
                                                if (!e.target.value) {
                                                    return setError({
                                                        ...error,
                                                        age: "age is Required !",
                                                    });
                                                } else {
                                                    return setError({
                                                        ...error,
                                                        age: "",
                                                    });
                                                }
                                            }}
                                        />
                                        {error && (
                                            <p className="errorMessage text-start">
                                                {error && error?.age}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="inputData text  flex-row justify-content-start text-start">
                                        <label className="ms-2 order-1">
                                            Country
                                        </label>

                                        <input
                                            className="form-control"
                                            required=""
                                            id="country"
                                            placeholder="india"
                                            value={country}
                                            onChange={(e) => {
                                                setCountry(e.target.value);
                                                if (!e.target.value) {
                                                    return setError({
                                                        ...error,
                                                        country: "country is Required !",
                                                    });
                                                } else {
                                                    return setError({
                                                        ...error,
                                                        country: "",
                                                    });
                                                }
                                            }}
                                        />
                                        {error && (
                                            <p className="errorMessage text-start">
                                                {error && error?.country}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <p className="form-label  mt-3 mb-2"> Gender</p>

                                        <div className="row">
                                            <div className="col-6 pe-0">
                                                <div class="form-check">
                                                    <input
                                                        class="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                        value="male"
                                                        checked={gender === "male" ? true : false}
                                                        onChange={(e) => {
                                                            setGender(e.target.value);
                                                            if (!e.target.value)
                                                                return setError({
                                                                    ...error,
                                                                    gender: "Gender Is Required !",
                                                                });
                                                            else {
                                                                return setError({
                                                                    ...error,
                                                                    gender: "",
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexRadioDefault1"
                                                    >
                                                        Male
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-6 px-0">
                                                <div class="form-check">
                                                    <input
                                                        class="form-check-input"
                                                        type="radio"
                                                        value="female"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                        checked={gender === "female" ? true : false}
                                                        onChange={(e) => {
                                                            setGender(e.target.value);
                                                            if (!e.target.value)
                                                                return setError({
                                                                    ...error,
                                                                    gender: "Gender Is Required !",
                                                                });
                                                            else {
                                                                return setError({
                                                                    ...error,
                                                                    gender: "",
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexRadioDefault2"
                                                    >
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {error.gender && (
                                            <div className="ml-1 mt-1">
                                                {error.gender && (
                                                    <div className="pl-1 text__left">
                                                        <span
                                                            className="font-size-lg text-danger"
                                                            style={{ fontWeight: "600" }}
                                                        >
                                                            {error.gender}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="row  align-align-items-center">
                                    <div className="col-md-6">
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
                                            </div>
                                            {imagePath && (
                                                <img
                                                    src={imagePath}
                                                    alt="fakeUser"
                                                    draggable="false"
                                                    className="mt-3 ms-3"
                                                    width="130"
                                                    height="130"
                                                    style={{
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            )}

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
                                    <div className="col-md-6">
                                        <div>
                                            <div className="form-group mb-0">
                                                <p className="form-label mt-3">Video</p>
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
                                                        accept="video/*"
                                                        className="form-control "
                                                        autocomplete="off"
                                                        tabIndex="-1"
                                                        style={{
                                                            position: "absolute",
                                                            top: 0,
                                                            transform: "scale(3.5)",
                                                            opacity: 0,
                                                        }}
                                                        onChange={(e) => handleVideo(e)}
                                                        onKeyPress={handleKeyPress}
                                                    />
                                                </div>
                                            </div>
                                            {videoPath && (
                                                <video
                                                    src={videoPath}
                                                    autoPlay
                                                    loop
                                                    alt="fakeUser"
                                                    draggable="false"
                                                    className="mt-3 "
                                                    width="150"
                                                    height="120"
                                                    style={{
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            )}

                                            {error.video && (
                                                <div className="ml-1 mt-1">
                                                    {error.video && (
                                                        <div className="pl-1 text__left">
                                                            <span
                                                                className="font-size-lg text-danger"
                                                                style={{ fontWeight: "600" }}
                                                            >
                                                                {error.video}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
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

export default FakeUserDialogue;
