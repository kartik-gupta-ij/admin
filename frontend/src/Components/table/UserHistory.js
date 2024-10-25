import TablePagination from '@mui/material/TablePagination';
import dayjs from "dayjs";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getUserHistory } from "../../store/user/user.action";
import TablePaginationActions from "../../util/Pagination";
import ServerPagination from "../../Pages/ServerPagination";

//moment
import moment from "moment";

const UserHistory = (props) => {
  const { userHistory, totalData, totalCoin, totalDiamond } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();


  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("call");

  const location = useLocation();
  let user = location.state.userId;

  useEffect(() => {
    dispatch(getUserHistory(
      user._id,
      startDate,
      endDate,
      activePage,
      rowsPerPage,
      type
    ));
  }, [dispatch,user, startDate, endDate, activePage, rowsPerPage, type]);

  useEffect(() => {
    setData(userHistory);
  }, [userHistory]);

  // pagination
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setRowsPerPage(value);
    setActivePage(1);
  };
  //Apply button function for analytic
  const handleApply = (event, picker) => {
    const start = dayjs(picker.startDate).format("YYYY-MM-DD");

    const end = dayjs(picker.endDate).format("YYYY-MM-DD");

    setStartDate(start);
    setEndDate(end);
  };

  //Cancel button function for analytic
  const handleCancel = (event, picker) => {
    picker?.element.val("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <div className="row py-2">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4 className="table_title ">{user.name} History </h4>
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
                <Link to="/admin/user">User </Link>
              </li>

              <li class="active">
                <a href={() => false}> History </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row layout-top-spacing">
        <div id="tableDropdown" class="col-lg-12 col-12 layout-spacing">
          <div class="statbox widget  ">
            <div class="widget-content widget-content-area">
              <div
                className="row mb-3 "
                style={{ borderBottom: " 2px solid rgb(238, 242, 246)" }}
              >
                <div class="col-xl-8 col-md-8 col-sm-12 col-12 filtered-list-search">
                  <div>
                    <DateRangePicker
                      initialSettings={{
                        autoUpdateInput: false,
                        locale: {
                          cancelLabel: "Clear",
                        },
                        maxDate: new Date(),
                        buttonClasses: ["btn btn-dark"],
                      }}
                      onApply={handleApply}
                      onCancel={handleCancel}
                    >
                      <input
                        type="text"
                        readOnly
                        class="daterange form-control float-left  mr-4 "
                        value="Select Date"
                        style={{
                          width: 120,
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      />
                    </DateRangePicker>
                  </div>
                  {startDate === "" || endDate === "" ? (
                    <div className="ml-3 mt-2  fs-5  fw-bold"></div>
                  ) : (
                    <div
                      className="dateShow pl-3 mt-2 fw-bold"
                      style={{ fontSize: "15px" }}
                    >
                      <span className="mr-2">{startDate}</span>
                      <span className="mr-2"> To </span>
                      <span>{endDate}</span>
                    </div>
                  )}
                </div>
                <div class=" col-12 col-xl-4 col-md-4 float-right col-sm-12 col-12 filtered-list-search ">
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn  text-white callButton"
                      onClick={() => setType("call")}
                    >
                      Call
                    </button>
                    <button
                      className="btn text-white ms-4 purchaseButton"
                      onClick={() => setType("purchase")}
                    >
                      Purchase
                    </button>
                    <button
                      className="btn text-white border-0 ms-4 giftButton"
                      onClick={() => setType("gift")}
                    >
                      Gift
                    </button>
                    <button
                      className="btn btn-primary text-white ms-4 border-0"
                      onClick={() => setType("admin")}
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </div>
              <div className="row mt-3 mr-3">
                <div class="col-12 col-md-3  filtered-list-search">
                  <h4 className="text-capitalize">{type} History</h4>
                </div>
                <div class="col-12 col-md-9 filtered-list-search d-flex align-items-center justify-content-end">
                  {type == "call" || type == "gift" ? (
                    <>
                      <h4 className="text-end me-5">
                        Earn Diamond : {totalDiamond ? totalDiamond : 0}
                      </h4>
                      <h4 className="text-end">
                        Spend Coin : {totalCoin ? totalCoin : 0}
                      </h4>
                    </>
                  ) : (
                    <h4 className="text-end">
                      Total Coin : {totalCoin ? totalCoin : 0}
                    </h4>
                  )}
                </div>
              </div>

              <div class="table-responsive table-height">
                <table class="table text-center  mb-4 table-striped ">
                  {type == "call" && (
                    <>
                      <thead className="">
                        <tr className="text-center">
                          <th className="fw-bold">No </th>
                          <th className="fw-bold">Name</th>
                          <th className="fw-bold">Coin/Diamond</th>
                          <th className="fw-bold">Call Duration</th>
                          <th className="fw-bold">Start Time</th>
                          <th className="fw-bold">End Time</th>
                        </tr>
                      </thead>
                      <tbody className="text-capitalize">
                        {data?.length > 0 ? (
                          data.map((data, i) => {
                            const startTime = data?.callStartTime?.split(",");
                            const endTime = data?.callEndTime?.split(",");

                            const callStart = startTime || ["", "-"];
                            const callEnd = endTime || ["", "-"];
                            return (
                              <>
                                <tr className="text-center">
                                  <td> {i + 1}</td>
                                  <td>
                                    {data?.name}
                                    <span
                                      className={`${data?.callType}`}
                                      style={{ fontSize: "14px" }}
                                    >
                                      @{data?.callType}
                                    </span>
                                  </td>
                                  <td className="fw-bold text-danger">
                                    {data?.isIncome ? (
                                      <span className="text-success">
                                        {data?.diamond > 0
                                          ? `+${data?.diamond}`
                                          : 0}
                                      </span>
                                    ) : (
                                      <span className="text-danger">
                                        {data?.coin > 0 ? `-${data?.coin}` : 0}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    {data?.callConnect
                                      ? data?.callEndTime
                                        ? moment
                                            .utc(
                                              moment(
                                                new Date(data?.callEndTime)
                                              ).diff(
                                                moment(
                                                  new Date(data?.callStartTime)
                                                )
                                              )
                                            )
                                            .format("HH:mm:ss")
                                        : " - "
                                      : "00:00:00"}
                                  </td>
                                  <td>
                                    {data?.callConnect ? callStart[1] : "-"}
                                  </td>
                                  <td>
                                    {data?.callConnect ? callEnd[1] : "-"}
                                  </td>
                                </tr>
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
                      </tbody>
                    </>
                  )}

                  {type == "gift" && (
                    <>
                      <thead className="">
                        <tr className="text-center">
                          <th className="fw-bold">No </th>
                          <th className="fw-bold">Name</th>
                          <th className="fw-bold">Coin/Diamond</th>
                          <th className="fw-bold">Date</th>
                          <th className="fw-bold">Time</th>
                        </tr>
                      </thead>
                      <tbody className="text-capitalize">
                        {data?.length > 0 ? (
                          data.map((data, i) => {
                            const dates = data?.date?.split(",") || [];
                            return (
                              <>
                                <tr className="text-center">
                                  <td> {i + 1}</td>
                                  <td>{data?.name}</td>
                                  <td className="fw-bold text-danger">
                                    {data?.isIncome ? (
                                      <span className="text-success">
                                        {data?.diamond > 0
                                          ? `+${data?.diamond}`
                                          : 0}
                                      </span>
                                    ) : (
                                      <span className="text-danger">
                                        {data?.coin > 0 ? `-${data?.coin}` : 0}
                                      </span>
                                    )}
                                  </td>
                                  <td>{dates[0]}</td>
                                  <td>{dates[1]}</td>
                                </tr>
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
                      </tbody>
                    </>
                  )}

                  {type == "admin" && (
                    <>
                      <thead className="sticky-top" style={{ top: "-1px" }}>
                        <tr className="text-center">
                          <th className="fw-bold">No </th>
                          <th className="fw-bold">Coin</th>
                          <th className="fw-bold">Date</th>
                          <th className="fw-bold">Time</th>
                        </tr>
                      </thead>
                      <tbody className="text-capitalize">
                        {data?.length > 0 ? (
                          data.map((data, i) => {
                            const dates = data?.date?.split(",") || [];
                            return (
                              <>
                                <tr className="text-center">
                                  <td> {i + 1}</td>
                                  <td className="fw-bold text-danger">
                                    {data?.isIncome ? (
                                      <span className="text-success">
                                        {data?.coin > 0 ? `+${data?.coin}` : 0}
                                      </span>
                                    ) : (
                                      <span className="text-danger">
                                        {data?.coin > 0 ? `-${data?.coin}` : 0}
                                      </span>
                                    )}
                                  </td>
                                  <td>{dates[0]}</td>
                                  <td>{dates[1]}</td>
                                </tr>
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
                      </tbody>
                    </>
                  )}
                  {type == "purchase" && (
                    <>
                      <thead className="sticky-top" style={{ top: "-1px" }}>
                        <tr className="text-center">
                          <th className="fw-bold">No </th>
                          <th className="fw-bold">Name</th>
                          <th className="fw-bold">Coin</th>
                          <th className="fw-bold">Payment Gateway</th>
                          <th className="fw-bold">Purchase Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length > 0 ? (
                          data.map((data, i) => {
                            const dates = data?.date?.split(",") || [];
                            return (
                              <>
                                <tr className="text-center">
                                  <td> {i + 1}</td>
                                  <td className="fw-bold text-danger">
                                    {data?.name}
                                  </td>
                                  <td>{data?.coin}</td>
                                  <td>{data?.paymentGateway}</td>
                                  <td>{data?.purchaseDate}</td>
                                </tr>
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
                      </tbody>
                    </>
                  )}
                </table>
              </div>
              <div className="row">
                <div className="col-12 col-md-3 mt-1">
                  <h4>Total : {totalData} </h4>
                </div>
                <div className="col-12 col-md-9">
                  <ServerPagination
                    activePage={activePage}
                    rowsPerPage={rowsPerPage}
                    userTotal={totalData}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
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

export default connect(null, { getUserHistory })(UserHistory);
