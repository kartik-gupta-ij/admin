import dayjs from "dayjs";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getUser, blockUser } from "../../store/user/user.action";

import $ from "jquery";

import { baseURL } from "../../util/config";
import ServerPagination from "../../Pages/ServerPagination";

import male from "../../assets/img/male.png";

const UserTable = (props) => {
  const { user, total } = useSelector((state) => state.user);
  
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  useEffect(() => {
    dispatch(getUser(page, size)); // eslint-disable-next-line
  }, [dispatch, page, size]);

  useEffect(() => {
    setData(user);
  }, [user]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleSearch = (e) => {
    const value = e.target.value?.toUpperCase();
    if (value) {
      const data = user.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.email?.toUpperCase()?.indexOf(value) > -1 ||
          data?.gender?.toUpperCase()?.indexOf(value) > -1 ||
          data?.coin?.toString()?.indexOf(value) > -1 ||
          data?.country?.toUpperCase()?.indexOf(value) > -1 ||
          data?.age?.toString()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      setData(user);
    }
  };

  // // pagination
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // // block user
  const handleClick = (user) => {
    
    props.blockUser(user);
  };

  const history = useHistory();
  // user profile
  const handleInfo = (userId) => {
    history.push({
      pathname: "/admin/user/userProfile",
      state: { userId },
    });
  };

  const handleHistory = (user) => {
    history.push({
      pathname: "/admin/user/history",
      state: { userId: user },
    });
  };
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", male);
    });
  });

  return (
    <>
      <div className="row py-2 align-items-center">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4 className="table_title">User </h4>
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
                <a href={() => false}> User </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row layout-top-spacing">
        <div id="tableDropdown" class="col-lg-12 col-12">
          <div class="widget-content widget-content-area">
            <div class="row ">
              <div class="col-xl-9 col-md-9 col-sm-12 col-12"></div>
              <div
                id="datePicker"
                className="collapse mt-5 pt-5 position-absolute"
                aria-expanded="false"
              ></div>
              <div class="col-xl-3 col-md-3 float-right col-sm-12 col-12 filtered-list-search ">
                <form class="form-inline my-2 my-lg-0 justify-content-center">
                  <div class="w-100">
                    <input
                      type="text"
                      class="w-100 form-control product-search br-30"
                      id="input-search"
                      placeholder="Search User"
                      onChange={(e) => handleSearch(e)}
                      F
                    />
                    <button class="btn btn-primary" type="submit">
                      {" "}
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
                        class="feather feather-search"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div class="table-responsive " style={{ maxHeight: "675px" }}>
              <table class="table table-striped ">
                <thead className="sticky-top" style={{ top: "-1px" }}>
                  <tr className="text-center">
                    <th className="fw-bold ">ID</th>
                    <th className="fw-bold">Image</th>
                    <th className="fw-bold">Name</th>
                    <th className="fw-bold">Email</th>
                    <th className="fw-bold">Gender</th>
                    <th className="fw-bold">Country</th>
                    <th className="fw-bold">Coin</th>
                    <th className="fw-bold">Block User</th>
                    <th className="fw-bold">Created At</th>
                    <th className="fw-bold">Info</th>
                    <th className="fw-bold">History</th>
                  </tr>
                </thead>

                <tbody className="text-capitalize">
                  {data?.length > 0 ? (
                    data.map((data, i) => {
                      return (
                        <>
                          <tr className="text-center">
                            <td> {(page - 1) * size + parseInt(i) + 1}</td>
                            <td>
                              <img
                                id="image"
                                src={data?.profileImage}
                                draggable="false"
                                className="mx-auto table_image"
                                onClick={() => handleInfo(data?._id)}
                                alt=""
                              />
                            </td>
                            <td> {data?.name}</td>
                            <td className="text-lowercase">
                              {data?.email == ""
                                ? "tango@gmail.com"
                                : data?.email}
                            </td>
                            <td>{data?.gender ? data?.gender : "male"}</td>
                            <td>{data?.country ? data?.country : "-"}</td>

                            <td>{data?.coin}</td>
                            <td style={{ paddingBottom: "0px" }}>
                              <div
                                class={`toggle ${data?.isBlock && "on"}`}
                                id="toggle"
                                onClick={() => handleClick(data)}
                              >
                                <div class="slide">
                                  <span class="fa fa-circle-o"></span>
                                </div>
                              </div>
                            </td>
                            <td>
                              {dayjs(data?.createdAt).format("DD MMM YYYY")}
                            </td>
                            <td>
                              <a
                                href={() => false}
                                onClick={() => handleInfo(data._id)}
                              >
                                <i class="bi bi-info-circle infoButton"></i>
                              </a>
                            </td>
                            <td>
                              <a
                                href={() => false}
                                className="text-underline"
                                onClick={() => handleHistory(data)}
                              >
                                view History
                              </a>
                            </td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center ">
                        No Data Found !
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div
                className="p-0"
                style={{
                  position: "sticky",
                  bottom: "0",
                  backgroundColor: "#fff",
                }}
              >
                <ServerPagination
                  activePage={page}
                  rowsPerPage={size}
                  userTotal={total}
                  handleRowsPerPage={handleRowsPerPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getUser, blockUser })(UserTable);
