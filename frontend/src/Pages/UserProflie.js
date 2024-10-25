import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  blockUser,
  updateHostCoin,
  getUserFollowers,
} from "../store/user/user.action";
import { useHistory, useLocation } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { setToast } from "../util/toast";
import EdiText from "react-editext";
import $ from "jquery";
import diamond from "../assets/img/diamond.png";
import { liveUser } from "../store/user/user.action";
import noImage from "../assets/img/noImage.png";


const UserProflie = (props) => {
  
  const dispatch = useDispatch();
  const location = useLocation();

  let id = location?.state?.userId;


  const { userProfile, followers } = useSelector((state) => state.user);

  const [type, setType] = useState("about");

  const [follow, setFollow] = useState([]);

  useEffect(() => {
    if (type === "following" || type === "followers") {
      dispatch(getUserFollowers(id, type));
    }
    dispatch(getUserProfile(id)); // eslint-disable-next-line
  }, [id, type]);

  useEffect(() => {
    setFollow(followers);
  }, [followers]);

  const history = useHistory();

  const handleClick = (dataId) => {
    
    if (userProfile.isFake) {
      props.liveUser(dataId);
    } else {
      props.blockUser(dataId);
    }
  };

  // const handleOpenImage = (url) => {
  //   window.open(url, "_blank");
  // };

  const handleHistory = () => {
    history.push({
      pathname: "/admin/user/history",
      state: { userId: userProfile },
    });
  };

  const handleType = (type) => {
    setType(type);
    $(document).on("click", ".user", function () {
      $(".user").removeClass("userActive");
      $(this).addClass("userActive");
    });
  };



  const handelShowImage = (data) => {
    history.push({
      pathname: "/admin/userPost",
      state: data,
    });
  };
  // update coin

  const handleSave = (val) => {
    if (val < 0) {
      setToast("error", "Invalid Coin");
    } else {
      const coinValid = isNumeric(val);
      if (!coinValid) {
        setToast("error", "Invalid Coin");
      } else {
        

        props.updateHostCoin(val, userProfile._id);
      }
    }
  };
  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  const handlePervious = () => {
    history.push("/admin/user")
  };
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImage);
    });
  });



  const newEmail = userProfile?.email?.substring(0, 22) + "...";
  return (
    <>
      <div className="text-end">
        <button className="btn purchaseButton" onClick={handleHistory}>
          <i className="fa fa-history text-white" />
        </button>
        <button className="btn btn-primary ml-2" onClick={handlePervious}>
          <i className="fa-solid fa-angles-left text-white fs-4" />
        </button>
      </div>
      <div
        className="card  my-4 mr-3"
        style={{ borderRadius: "26px 26px 0 0" }}
      >
        <div className="row">
          <div
            className="col-xl-3 col-12"
            style={{ borderRight: "2px solid #C0C0C0 " }}
          >
            <div className="py-5">
              {userProfile.isFake ? (
                <>
                  <img
                    src={userProfile?.profileImage}
                    draggable="false"
                    className="mx-auto image profileImage "
                    alt=""
                  // onClick={() => handleOpenImage(userProfile?.profileImage)}
                  />
                </>
              ) : (
                <img
                  src={userProfile?.profileImage}
                  draggable="false"
                  className="mx-auto image profileImage "
                  alt=""
                // onClick={() => handleOpenImage(userProfile?.profileImage)}
                />
              )}

              <p className="text-center  my-2 userProfileUserName">
                {userProfile?.name}
              </p>
              <p
                className="  my-2 text-center"
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  color: "var(--bs-color)",
                }}
              >
                {userProfile?.bio}
              </p>

              <div
                className="px-4 mt-4 mainSideBio"
                style={{ fontSize: "18px" }}
              >
                <div
                  className="col-12"
                  style={{ borderTop: "1px solid #FFCBE1" }}
                >
                  <div className="text-dark my-3 mt-3">
                    <i
                      class="fa fa-envelope mr-3 text-color"
                      style={{ fontSize: "18px" }}
                      aria-hidden="true"
                    ></i>
                    <span
                      className="my-2 text-center"
                      style={{ fontWeight: "600" }}
                    >
                      {newEmail}
                    </span>
                  </div>
                  <div className="text-dark my-3">
                    {userProfile?.gender === "male" ? (
                      <i
                        class="fa fa-male mr-3 text-color"
                        style={{ fontSize: "22px" }}
                        aria-hidden="true"
                      ></i>
                    ) : (
                      <i
                        class="fa fa-female mr-3 text-color"
                        style={{ fontSize: "22px" }}
                        aria-hidden="true"
                      ></i>
                    )}

                    <span
                      className="my-2 text-center text-capitalize ml-1"
                      style={{ fontWeight: "600" }}
                    >
                      {userProfile?.gender}
                    </span>
                  </div>
                  <div className="text-dark my-3">
                    <i
                      class="fas fa-globe feather-icon mr-2 text-color"
                      style={{ fontSize: "20px" }}
                    ></i>
                    <span
                      className="my-2 text-center text-capitalize ml-1"
                      style={{ fontWeight: "600" }}
                    >
                      {userProfile?.country ? userProfile?.country : "india"}
                    </span>
                  </div>
                  <div className="text-dark my-3">

                    {userProfile?.platformType === 0 ? (
                      <i class="fa-brands fa-android mr-2 text-color"></i>
                    ) : (
                      <i class="fa-brands fa-apple mr-2 text-color"></i>
                    )}

                    <span
                      className="my-2 text-center text-capitalize ml-1"
                      style={{ fontWeight: "600" }}
                    >
                      {userProfile?.platformType === 0 ? "Android" : "IOS"}
                    </span>
                  </div>
                  <div className="text-dark my-3">
                    <img
                      src={diamond}
                      alt=""
                      width="20px"
                      height="20px"
                      draggable="false"
                      className="mr-3"
                    />
                    <span
                      className="my-2 text-center text-capitalize"
                      style={{ fontWeight: "600" }}
                    >
                      {userProfile?.diamond ? userProfile?.diamond : 0}
                    </span>
                  </div>

                  <div className="text-dark d-flex my-3">
                    <div className="mr-3">
                      <i
                        class="fas fa-coins text-color"
                        style={{ fontSize: "18px" }}
                      ></i>
                    </div>
                    <div className="pl-1">
                      <EdiText
                        type="text"
                        value={userProfile?.coin}
                        onSave={handleSave}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-12 px-0 ">
            <div
              className="row  text-center pt-3"
              style={{
                borderBottom: "2px solid #eef2f6",
                backgroundColor: "rgba(188, 33, 94, 0.06)",
                margin: "0 15px 0 0",
                borderRadius: "0 20px 0 0",
              }}
            >
              <div
                className="col-sm-3 col-6  user userActive "
                onClick={() => handleType("about")}
                style={{ cursor: "pointer" }}
              >
                <p className="text-profile pt-2">
                  <span className="text-profile pt-2">About</span>
                </p>
              </div>
              <div
                className="col-sm-3 col-6 user "
                onClick={() => handleType("following")}
                style={{ cursor: "pointer" }}
              >
                <span className="text-profile pt-2">Following </span>
              </div>
              <div
                className="col-sm-3 col-6 user"
                onClick={() => handleType("followers")}
                style={{ cursor: "pointer" }}
              >
                <span className="text-profile pt-2">Followers </span>
              </div>
              <div
                className="col-sm-3 col-6 user"
                onClick={() => handleType("post")}
                style={{ cursor: "pointer" }}
              >
                <span className="text-profile pt-2">Post </span>
              </div>
            </div>

            <div className="card my-2 mr-3 user_profile_info">
              {type === "following" || type === "followers" ? (
                <div className=" text-capitalize">
                  <p className="following">
                    {type} :{" "}
                    {type === "following"
                      ? userProfile.following
                      : userProfile.followers}
                  </p>
                </div>
              ) : (
                <></>
              )}
              <div className="card-body">
                {type === "about" && (
                  <>
                    <div className="row px-4">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <table
                          className="w-100 infoTable"
                          style={{ fontSize: "16px" }}
                        >
                          <tr className="">
                            <td
                              className="py-3  text-profile"
                              style={{ fontSize: "18px", width: "150px" }}
                            >
                              Status
                            </td>
                            <td className="text-dark fw-bold">:</td>
                            <td>
                              {userProfile?.isOnline ? (
                                <span class="badge badge-success">
                                  {" "}
                                  Online{" "}
                                </span>
                              ) : (
                                <span class="badge badge-danger">
                                  {" "}
                                  Offline{" "}
                                </span>
                              )}
                            </td>
                          </tr>

                          <tr className=" ">
                            <td
                              className="py-3  text-profile"
                              style={{ fontSize: "18px" }}
                            >
                              Followers
                            </td>
                            <td className="text-dark fw-bold">:</td>
                            <td className="text-dark fw-bold">
                              {userProfile?.followers}
                            </td>
                          </tr>

                          <tr className=" ">
                            <td
                              className="py-3  text-profile"
                              style={{ fontSize: "18px" }}
                            >
                              Like
                            </td>
                            <td className="text-dark fw-bold">:</td>
                            <td className="text-dark fw-bold">
                              {userProfile?.totalLike
                                ? userProfile?.totalLike
                                : 0}
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <table
                          className="w-100 infoTable"
                          style={{ fontSize: "16px" }}
                        >
                          {userProfile.isFake ? (
                            <tr className="">
                              <td
                                className="py-3  text-profile"
                                style={{ fontSize: "18px", width: "150px" }}
                              >
                                Live
                              </td>
                              <td className="text-dark fw-bold">:</td>
                              <td className="text-dark fw-bold pt-1 px-2 ">
                                <div
                                  class={`toggle plan ${userProfile?.isLive && "on"
                                    } m-0 `}
                                  id="toggle"
                                  onClick={() => handleClick(userProfile)}
                                >
                                  <div class="slide">
                                    <span class="fa fa-circle-o"></span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr className="">
                              <td
                                className="py-3  text-profile"
                                style={{ fontSize: "18px", width: "150px" }}
                              >
                                Block
                              </td>
                              <td className="text-dark fw-bold">:</td>
                              <td className="text-dark fw-bold pt-1 px-2">
                                <div
                                  class={`toggle ${userProfile?.isBlock && "on"
                                    }`}
                                  id="toggle"
                                  onClick={() => handleClick(userProfile)}
                                  style={
                                    ({ marginLeft: "auto" }, { margin: 0 })
                                  }
                                >
                                  <div class="slide">
                                    <span class="fa fa-circle-o"></span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}

                          <tr className=" ">
                            <td
                              className="py-3  text-profile"
                              style={{ fontSize: "18px" }}
                            >
                              Following
                            </td>
                            <td className="text-dark fw-bold">:</td>
                            <td className="text-dark fw-bold">
                              {userProfile?.following}
                            </td>
                          </tr>

                          <tr className=" ">
                            <td
                              className="py-3  text-profile"
                              style={{ fontSize: "18px" }}
                            >
                              Post
                            </td>
                            <td className="text-dark fw-bold">:</td>
                            <td className="text-dark fw-bold">
                              {userProfile?.TotalPost
                                ? userProfile?.TotalPost
                                : 0}
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {type === "following" &&
                  (follow.length > 0 ? (
                    follow.map((data) => {
                      return (
                        <>
                          <div className="row justify-content-between py-2 px-4">
                            <div className="col-md-6 col-12 d-flex align-items-center">
                              <div>
                                <img
                                  src={data?.profileImage}
                                  draggable="false"
                                  className="mx-auto imageUser"
                                  alt=""
                                />
                              </div>
                              <div className="pt-1 ms-2">
                                <p
                                  className="mb-0  text-dark"
                                  style={{
                                    fontSize: "30px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {data?.name}
                                </p>
                                <p
                                  className="ps-1 text-dark fw-medium"
                                  style={{ fontSize: "20px" }}
                                >
                                  {data?.bio}
                                </p>
                              </div>
                            </div>

                            <div className="col-md-6 col-12">
                              <div className="row follower_count">
                                <div className="col-4 text-center">
                                  <h3 className="text-dark fw-bold">
                                    {data?.followers ? data?.followers : 0}
                                  </h3>
                                  <p className="text-dark fw-semibold">
                                    Followers
                                  </p>
                                </div>
                                <div
                                  className="col-4 text-center"
                                  style={{ borderLeft: "1px solid #D1D1D1" }}
                                >
                                  <h3 className="text-dark fw-semibold">
                                    {data?.following ? data?.following : 0}
                                  </h3>
                                  <p className="text-dark fw-semibold">
                                    Following
                                  </p>
                                </div>
                                <div
                                  className="col-4 text-center"
                                  style={{ borderLeft: "1px solid #D1D1D1" }}
                                >
                                  <h3 className="text-dark fw-semibold">
                                    {data?.post ? data?.post : 0}
                                  </h3>

                                  <p className="text-dark fw-semibold">Post</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <div className="text-center">
                      <p>User Not Following</p>
                    </div>
                  ))}
                {type === "followers" &&
                  (follow.length > 0 ? (
                    follow.map((data) => {
                      return (
                        <>
                          <div className="row justify-content-between py-2 px-4">
                            <div className="col-md-6 col-12 d-flex align-items-center">
                              <div>
                                <img
                                  src={data?.profileImage}
                                  draggable="false"
                                  className="mx-auto imageUser"
                                  alt=""
                                />
                              </div>
                              <div className="pt-1 ms-2">
                                <p
                                  className="mb-0  text-dark"
                                  style={{
                                    fontSize: "30px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {data?.name}
                                </p>
                                <p
                                  className="ps-1 text-dark fw-medium"
                                  style={{ fontSize: "20px" }}
                                >
                                  {data?.bio}
                                </p>
                              </div>
                            </div>

                            <div className="col-md-6 col-12">
                              <div className="row follower_count">
                                <div className="col-4 text-center">
                                  <h3 className="text-dark fw-bold">
                                    {data?.followers ? data?.followers : 0}
                                  </h3>
                                  <p className="text-dark fw-semibold">
                                    Followers
                                  </p>
                                </div>
                                <div
                                  className="col-4 text-center"
                                  style={{ borderLeft: "1px solid #D1D1D1" }}
                                >
                                  <h3 className="text-dark fw-semibold">
                                    {data?.following ? data?.following : 0}
                                  </h3>
                                  <p className="text-dark fw-semibold">
                                    Following
                                  </p>
                                </div>
                                <div
                                  className="col-4 text-center"
                                  style={{ borderLeft: "1px solid #D1D1D1" }}
                                >
                                  <h3 className="text-dark fw-semibold">
                                    {data?.post ? data?.post : 0}
                                  </h3>

                                  <p className="text-dark fw-semibold">Post</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <div className="text-center">
                      <p>User Not followers</p>
                    </div>
                  ))}

                {type === "post" && (
                  <>
                    <div
                      className="row mt-4"
                    // style={{ height: "310px", overflow: "auto" }}
                    >
                      {userProfile?.userPost?.length > 0 ? (
                        userProfile?.userPost?.map((post) => {
                          console.log("==============", post);
                          return (
                            <>
                              <div className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
                                <div
                                  className="card postCard"
                                  style={{ borderRadius: "7px" }}
                                >
                                  <div className="card-body p-0 userProfileCard">
                                    <div className=" p-2">
                                      <img
                                        src={post?.postImage}
                                        draggable="false"
                                        alt=""
                                        onClick={() => handelShowImage(post)}
                                        className="mx-auto userProfilePost"
                                      />
                                    </div>
                                    <div
                                      className="row px-3"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      <div className="col-4 text-center">
                                        <i
                                          class="fa fa-heart text-danger mt-1"
                                          style={{ fontSize: "20px" }}
                                          aria-hidden="true"
                                        ></i>
                                        <p>{post?.like}</p>
                                      </div>
                                      <div className="col-4 text-center">
                                        <i
                                          class="fa-solid fa-comment mt-1 "
                                          style={{
                                            fontSize: "20px",
                                            color: "#7c7979",
                                          }}
                                        ></i>
                                        <p style={{ color: "#7c7979" }}>
                                          {post?.comment}
                                        </p>
                                      </div>
                                      <div className="col-4 text-center ">
                                        <i
                                          class="fa-solid fa-gift mt-1  "
                                          style={{
                                            fontSize: "20px",
                                            color: "#7c7979",
                                          }}
                                        ></i>
                                        <p style={{ color: "#7c7979" }}>
                                          {post?.gift}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })
                      ) : (
                        <div className="text-center">
                          <p>User Not Post</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default connect(null, {
  getUserProfile,
  blockUser,
  updateHostCoin,
  getUserFollowers,
  liveUser,
})(UserProflie);
