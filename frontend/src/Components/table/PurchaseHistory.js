import TablePagination from '@mui/material/TablePagination';
import dayjs from "dayjs";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { baseURL } from "../../util/config";
import TablePaginationActions from "../../util/Pagination";
import { getPurchaseHistory } from "../../store/CoinPlan/CoinPlan.action";
import $ from "jquery";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

const PurchaseHistory = (props) => {
  const { history, total, totalCoin, totalDollar } = useSelector(
    (state) => state.coinPlan
  );
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getPurchaseHistory(startDate, endDate)); // eslint-disable-next-line
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    setData(history);
  }, [history]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Apply button function for analytic
  const handleApply = (event, picker) => {
    const start = dayjs(picker.startDate).format("YYYY-MM-DD");

    const end = dayjs(picker.endDate).format("YYYY-MM-DD");

    setStartDate(start);
    setEndDate(end);

    dispatch(getPurchaseHistory(start, end));
  };

  //Cancel button function for analytic
  const handleCancel = (event, picker) => {
    picker?.element.val("");
    setStartDate("");
    setEndDate("");
    dispatch(getPurchaseHistory("", ""));
  };

  return (
    <>
      <div className="row py-2 align-items-center">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4 className="table_title">Purchase History</h4>
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
                <a href={() => false}> Purchase History </a>
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
                        class="daterange form-control float-left  mr-4 "
                        value="Select Date"
                        readOnly
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
                <div
                  id="datePicker"
                  className="collapse mt-5 pt-5 position-absolute"
                  aria-expanded="false"
                ></div>
                <div class="col-xl-4 col-md-4 float-right col-sm-12 col-12 filtered-list-search ">
                  <div>
                    <div className="row">
                      <div className="col-6">
                        <h4 className="text-end fw-semibold">
                          Total Earn : {totalDollar ? totalDollar : 0}
                        </h4>
                      </div>
                      <div className="col-6">
                        <h4 className="text-end fw-semibold">
                          Total Coin : {totalCoin ? totalCoin : 0}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-responsive table-height">
                <table class="table text-center  mb-4 table-striped">
                  <thead className="sticky-top" style={{ top: "-1px" }}>
                    <tr className="text-center">
                      <th className="fw-bold">No</th>
                      <th className="fw-bold">Name</th>
                      <th className="fw-bold">Coin</th>
                      <th className="fw-bold">Dollar</th>
                      <th className="fw-bold">Payment Gateway</th>
                      <th className="fw-bold">Purchase Date</th>
                    </tr>
                  </thead>
                  <tbody>
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
                              <td className="fw-bold text-danger">
                                {data?.name}
                              </td>
                              <td>{data?.coin}</td>
                              <td>{data?.dollar}</td>
                              <td>{data?.paymentGateway}</td>
                              <td>{data?.purchaseDate}</td>
                            </tr>
                          </>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="13" className="text-center">
                          No Data Found !
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    50,
                    100,
                    { label: "All", value: data.length },
                  ]}
                  component="div"
                  count={data.length}
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
    </>
  );
};

export default connect(null, { getPurchaseHistory })(PurchaseHistory);
