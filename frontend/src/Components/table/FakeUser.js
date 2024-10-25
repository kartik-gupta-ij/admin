import dayjs from "dayjs";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import $ from "jquery";
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from "../../util/Pagination";
import {
  getFakeUser,
  deleteFakeUser,
  liveUser,
} from "../../store/fakeUser/fakeUser.action";
import { warning } from "../../util/Alert";

import male from "../../assets/img/male.png";
import { OPEN_DIALOGUE } from "../../store/dialog/dialog.type";
import FakeUserDialogue from "../Dialog/FakeUserDialogue";

const FakeUser = (props) => {
  const { fakeUser } = useSelector((state) => state.fakeUser);
  const { dialog, type, dialogData } = useSelector(
    (state) => state.dialog
  );
  
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getFakeUser()); // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    setData(fakeUser);
  }, [fakeUser]);

  const handleSearch = (e) => {
    const value = e.target.value?.toUpperCase();
    if (value) {
      const data = fakeUser.filter((data) => {
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
      setData(fakeUser);
    }
  };

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // // block user
  const handleClick = (user) => {
    
    props.liveUser(user);
  };

  const history = useHistory();
  // user profile
  const handleInfo = (userId) => {
    history.push({
      pathname: "/admin/user/userProfile",
      state: { userId },
    });
  };

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", male);
    });
  });


  // handle Delete planL
  const handleDelete = async (id) => {
    
    try {
      const data = await warning("Delete");
      const yes = data?.isConfirmed;
      console.log("yes", yes);
      if (yes) {
        props.deleteFakeUser(id);
      }
    } catch (err) {
      console.log(err);
    }

  };

  // handle Create Dialog Open

  const handleHistory = (user) => {
    history.push({
      pathname: "/admin/user/history",
      state: { userId: user },
    });
  };

  return (
    <>
      <div className="row py-2 align-items-center">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4 className="table_title">Fake User </h4>
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
                <a href={() => false}>Fake User </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row layout-top-spacing">
        <div id="tableDropdown" class="col-lg-12 col-12 layout-spacing">
          <div class="statbox widget  ">
            <div class="widget-content widget-content-area pt-0">
              <div class="row align-items-center">
                <div class="col-xl-9 col-md-9 col-sm-12 col-12 ">
                  <button
                    class="btn-hover color-11"
                    onClick={() =>
                      dispatch({
                        type: OPEN_DIALOGUE,
                        payload: { type: "fakeUser" },
                      })
                    }

                  >
                    <i class="fa fa-plus pr-1" aria-hidden="true"></i> Add
                  </button>
                </div>
                <div
                  id="datePicker"
                  className="collapse mt-5 pt-5 position-absolute"
                  aria-expanded="false"
                ></div>
                <div class="col-xl-3 col-md-3 float-right col-sm-12 col-12 filtered-list-search mb-0">
                  <form class="form-inline my-2 my-lg-0 justify-content-center">
                    <div class="w-100">
                      <input
                        type="text"
                        class="w-100 form-control product-search br-30"
                        id="input-search"
                        placeholder="Search User..."
                        onChange={(e) => handleSearch(e)}
                      />
                      <button
                        class="btn bg-danger-gradient  text-white"
                        type="button"
                      >
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
                      <th>ID</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Country</th>
                      <th>Coin</th>
                      <th>Live User</th>
                      <th>Created At</th>
                      <th>History</th>
                      <th>Info</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>

                  <tbody className="text-capitalize">
                    {data?.length > 0 ? (
                      (rowsPerPage > 0
                        ? data?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data
                      ).map((data, i) => {
                        return (
                          <>
                            <tr className="text-center">
                              <td> {i + 1}</td>
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
                                  ? "demo@gmail.com"
                                  : data?.email}
                              </td>
                              <td>{data?.gender ? data?.gender : "male"}</td>
                              <td>{data?.country ? data?.country : "-"}</td>

                              <td>{data?.coin}</td>

                              <td>
                                <div
                                  class={`toggle plan ${data?.isLive && "on"}`}
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
                                  className="text-underline"
                                  onClick={() => handleHistory(data)}
                                >
                                  view History
                                </a>
                              </td>
                              <td>
                                <a
                                  href={() => false}
                                  onClick={() => handleInfo(data?._id)}
                                >
                                  <i class="bi bi-info-circle infoButton"></i>
                                </a>
                              </td>

                              <td>
                                <a
                                  href={() => false}

                                  onClick={() => {
                                    dispatch({
                                      type: OPEN_DIALOGUE,
                                      payload: { data: data, type: "fakeUser" },
                                    });
                                  }}
                                >
                                  <i class="fa fa-edit text-dark infoButton "></i>
                                </a>
                              </td>
                              <td>
                                <a
                                  href={() => false}
                                  onClick={() => handleDelete(data._id)}
                                >
                                  <i class="bi  bi-trash3 text-dark infoButton"></i>
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
                <div className="p-0 ">
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      50,
                      100,
                      { label: "All", value: data?.length },
                    ]}
                    component="div"
                    count={data?.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {dialog && type === "fakeUser" && (
          <FakeUserDialogue />
        )}
      </div>
    </>
  );
};

export default connect(null, { getFakeUser, deleteFakeUser, liveUser })(
  FakeUser
);
