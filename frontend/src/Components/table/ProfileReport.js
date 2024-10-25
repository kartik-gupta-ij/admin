import TablePagination from '@mui/material/TablePagination';
import React, { useState } from "react";
import TablePaginationActions from "../../util/Pagination";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { getComplaint } from "../../store/Complaint/complaint.action";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const ProfileTable = (props) => {
  const complaint = useSelector((state) => state.complaint.complaint);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getComplaint("1")); // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    setData(complaint);
  }, [complaint]);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = complaint.filter((data) => {
        return (
          data?.userId?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.contact?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(complaint);
    }
  };

  // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="row py-2">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4 className="table_title">Profile Report </h4>
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
                <a href={() => false}>Profile Report</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row layout-top-spacing">
        <div id="tableDropdown" class="col-lg-12 col-12 layout-spacing">
          <div class="statbox widget  ">
            <div class="widget-content widget-content-area">
              <div class="row ">
                <div class="col-xl-9 col-md-9 col-sm-12 col-12"></div>
                <div
                  id="datePicker"
                  className="collapse mt-5 pt-5 position-absolute"
                  aria-expanded="false"
                ></div>
                <div class="col-xl-3  col-md-3 float-right col-sm-12 col-12 filtered-list-search ">
                  <form class="form-inline my-2 my-lg-0 justify-content-center">
                    <div class="w-100">
                      <input
                        type="text"
                        class="w-100 form-control product-search br-30"
                        id="input-search"
                        placeholder="Search Profile Report..."
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
                <table class="table table-condensed table-striped">
                  <thead className="text-center">
                    <tr>
                      <th className="fw-bold fs-18 ">No</th>
                      <th className="fw-bold fs-18">Image</th>
                      <th className="fw-bold fs-18">Name</th>
                      <th className="fw-bold fs-18">Country</th>
                      <th className="fw-bold fs-18">Count</th>
                      <th className="fw-bold fs-18">createdAt</th>
                      <th className="fw-bold fs-18">Info</th>
                    </tr>
                  </thead>

                  {data?.length > 0 ? (
                    (rowsPerPage > 0
                      ? data.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : data
                    ).map((data, ids) => {
                      return (
                        <>
                          <tbody className="text-capitalize">
                            <tr
                              data-toggle="collapse"
                              data-target={`#demo${ids}`}
                              className="text-center accordion-toggle"
                              style={{ fontSize: "13px" }}
                            >
                              <td width="65px" style={{ fontSize: "18px" }}>
                                {ids + 1}
                              </td>

                              <td className="" width="242px">
                                <img
                                  src={data.profileImage}
                                  alt="Profile"
                                  className="m-auto table_image "
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "25px",
                                  }}
                                  draggable="false"
                                />
                              </td>
                              <td
                                width="270px"
                                className="text-center "
                                style={{
                                  fontSize: "18px",
                                  color: "#0917bd",
                                  fontWeight: "500",
                                }}
                              >
                                {data.name}
                              </td>
                              <td
                                width="200px"
                                className="  text-center"
                                style={{
                                  fontSize: "18px",
                                  color: "#1e9500",
                                }}
                              >
                                {data.country}
                              </td>
                              <td
                                width="100px"
                                className="text-info  text-center"
                                style={{ fontSize: "18px" }}
                              >
                                {data.count}
                              </td>

                              <td
                                width="150px"
                                className="text-danger  text-center"
                                style={{
                                  fontWeight: "500",
                                  fontSize: "18px",
                                }}
                              >
                                {dayjs(data?.createdAt).format("DD MMM YYYY")}
                              </td>
                              <td width="50px" style={{ fontSize: "18px" }}>
                                <a href={() => false}>
                                  <i class="bi bi-info-circle infoButton"></i>
                                </a>
                              </td>
                            </tr>

                            <tr>
                              <td colspan="12" class="hiddenRow">
                                <div
                                  class="accordian-body collapse subReport"
                                  id={`demo${ids}`}
                                >
                                  <div className="table-responsive table-height">
                                    <table class="table table-striped">
                                      <thead>
                                        <tr
                                          className="text-center"
                                          style={{ backgroundColor: "#ff3088" }}
                                        >
                                          <th className="fw-bold fs-16">No</th>
                                          <th className="py-3 fs-16">Image</th>
                                          <th className="py-3 fs-16">name</th>
                                          <th className="py-3 fs-16">Coin</th>
                                          <th className="py-3 fs-16">
                                            Diamond
                                          </th>
                                          <th className="py-3 fs-16">Post</th>
                                          <th className="py-3 fs-16">
                                            Followers
                                          </th>
                                          <th className="py-3 fs-16">
                                            Following
                                          </th>
                                          <th className="py-3">Report</th>
                                          <th className="py-3"> createdAt</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {data.reports.map((com, index) => {
                                          return (
                                            <>
                                              <tr
                                                className="text-center py-2"
                                                style={{
                                                  borderBottom:
                                                    "1px solid #eef2f6",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                <td className="p-0">
                                                  {index + 1}
                                                </td>
                                                <td className="py-2">
                                                  <img
                                                    src={com?.image}
                                                    alt="Profile"
                                                    style={{
                                                      width: "50px",
                                                      height: "50px",
                                                    }}
                                                    className="table_image m-auto fs-16"
                                                  />
                                                </td>
                                                <td className="py-2 fs-16 text-danger ">
                                                  {com?.profile?.name}
                                                </td>
                                                <td className="py-2 fs-16 text-info ">
                                                  {com?.profile?.coin
                                                    ? com?.profile?.coin
                                                    : 0}
                                                </td>
                                                <td className="py-2 fs-16 text-warning ">
                                                  {com?.profile?.earnDiamond
                                                    ? com?.profile?.earnDiamond
                                                    : 0}
                                                </td>
                                                <td className="py-2 fs-16 text-success ">
                                                  {com?.profile?.post}
                                                </td>
                                                <td className="py-2 fs-16 text-info ">
                                                  {com?.profile?.followers
                                                    ? com?.profile?.followers
                                                    : 0}
                                                </td>
                                                <td className="py-2 fs-16 text-primary ">
                                                  {com?.profile?.following
                                                    ? com?.profile?.following
                                                    : 0}
                                                </td>
                                                <td
                                                  className="py-2 fs-16"
                                                  style={{ color: "#bb1e1e" }}
                                                >
                                                  {com?.report}
                                                </td>
                                                <td className="py-2 fs-16 text-info">
                                                  {dayjs(
                                                    data?.createdAt
                                                  ).format("DD MMM YYYY")}
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center">
                        No Data Found !
                      </td>
                    </tr>
                  )}
                </table>
                <div
                  className="p-0 "
                  style={{
                    position: "sticky",
                    bottom: "0",
                    backgroundColor: "#fff",
                  }}
                >
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
      </div>
    </>
  );
};

export default connect(null, { getComplaint })(ProfileTable);
