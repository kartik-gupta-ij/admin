import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import { useState } from "react";
import { baseURL } from "../../util/config";
import { getUserPostDetails } from "../../store/user/user.action";
import gift from "../../assets/img/gift.png";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const ShowImageDialogue = () => {
  const { postDetails } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [type, setType] = useState("like");
  const [data, setData] = useState([]);

  useEffect(
    () => () => {
      setType("like");
    },
    []
  );

  const location = useLocation();

  let  dialogData  = location?.state


  useEffect(() => {
      dispatch(getUserPostDetails(dialogData?._id, type));
  }, [dispatch, dialogData, type]);

  useEffect(() => {
    setData(postDetails);
  }, [postDetails]);

  const handleType = (type) => {
    setType(type);
    $(document).on("click", ".user", function () {
      $(".user").removeClass("userActive");
      $(this).addClass("userActive");
    });
  };
  const history = useHistory();

  const handleOpenProfile = () => {
    debugger
    history.push({
      pathname: "/admin/user/userProfile",
      state: { userId:dialogData?.userId} ,
    });
  };
  return (
    <div class="">
      <div className="row py-2">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4 className="table_title">User Post Details </h4>
        </div>
        <div class="col-xl-6 col-md-6 col-sm-12 col-12 ">
          <div class="breadcrumb-four float-right">
            <ul class="breadcrumb">
              <li>
                <Link to="/admin/dashboard">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-home"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </Link>
              </li>

              <li class="active">
                <a href={() => false}> User Post  Details </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row justify-content-center layout-top-spacing">
        <div className="row">
          <div
            className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6"
            style={{ borderRight: "1px solid rgb(170, 193, 217)" }}
          >
            <img
              src={dialogData?.postImage}
              alt=""
              draggable="false"
              className="mx-auto d-block UserProfileDialogue"
            />
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 px-5  d-none d-sm-none d-md-none d-lg-block">
            <div
              className="row text-center"
              style={{ borderBottom: "2px solid #eef2f6" }}
            >
              <div
                className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4  user userActive "
                onClick={() => handleType("like")}
                style={{ cursor: "like" }}
              >
                <span className="text-profile pt-2">Like </span>
                <spn className="ml-2 text">{dialogData?.like}</spn>
              </div>
              <div
                className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 col-xxl-4 user"
                onClick={() => handleType("comment")}
                style={{ cursor: "pointer" }}
              >
                <span className="text-profile pt-2 text-center">Comment</span>
                <spn className="ml-2 text">{dialogData?.comment}</spn>
              </div>
              <div
                className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 col-xxl-4 user "
                onClick={() => handleType("gift")}
                style={{ cursor: "pointer" }}
              >
                <span className="text-profile  pt-2 text-center">Gift</span>
                <spn className="text ml-2">{dialogData?.gift}</spn>
              </div>
            </div>
            <div className="post_view_commentData">
              {postDetails?.length > 0 ? (
                postDetails?.map((data) => {
                    
                  return (
                    <>
                      <div
                        className="row py-2 px-4 d-flx align-items-center"
                        style={{
                          borderBottom: "1px solid #aac1d9",
                          borderRadius: "7px",
                        }}
                      >
                        <div className="col-1 d-flex align-items-center">
                          <img
                            src={data?.profileImage}
                            draggable="false"
                            className="mx-auto"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "25px",
                              backgroundColor: "#aad4fd",
                            }}
                            alt=""
                            onClick={() => handleOpenProfile()}
                          />
                        </div>
                        <div className="col-9 mr-2 pt-2 pl-4">
                          <p className="mb-0" style={{ fontSize: "20px" }}>
                            {data?.name}
                          </p>

                          {type === "comment" ? (
                            <p
                              className="mb-0"
                              style={{ fontSize: "15px", color: "#7b7e81" }}
                            >
                              {data?.comment}
                            </p>
                          ) : (
                            <p
                              className="mb-0"
                              style={{ fontSize: "15px", color: "#7b7e81" }}
                            >
                              {data?.bio}
                            </p>
                          )}
                        </div>

                        {type === "gift" ? (
                          <>
                            <div className="col-1 pr-3">
                              <img
                                src={data?.gift ? baseURL + data?.gift : gift}
                                draggable="false"
                                className="mx-auto"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                }}
                                alt=""
                                onClick={() => handleOpenProfile()}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="col-1 pr-3">
                            {type === "like" ? (
                              <i className="fa fa-heart text-danger mt-2" />
                            ) : (
                              <i
                                className="fa-solid fa-comment mt-2 "
                                style={{ color: "#000" }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })
              ) : (
                <div className="text-center mt-3">
                  <p>No Post {type}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2 ">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn-grad"
              onClick={() => {
                handleOpenProfile();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowImageDialogue;
