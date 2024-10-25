import TablePagination from '@mui/material/TablePagination';
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TablePaginationActions from "../../util/Pagination";
import {
  getRedeem,
  acceptRedeem,
  acceptRedeemDecline,
} from "../../store/Redeem/RedeemAction";
import $ from "jquery";


const RedeemPending = (props) => {
  const { redeem } = useSelector((state) => state.redeem);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  

  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getRedeem("pending"));
  }, [dispatch]);
  useEffect(() => {
    setData(redeem);
  }, [redeem]);

  // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSearch = () => {};


  const handleAccept = (id) => {
    

    props.acceptRedeem(id, "accept");
  };

  const handleDecline = (id) => {
    

    props.acceptRedeemDecline(id);
  };
  return (
    <>
      <div className="row py-2">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4 className="table_title">Redeem Pending </h4>
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
                <a href={() => false}> Redeem Pending</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row layout-top-spacing">
        <div id="tableDropdown" class="col-lg-12 col-12 layout-spacing">
          <div class="statbox widget  ">
            <div class="widget-content widget-content-area">
              <div class="row">
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
                        placeholder="Search Redeem ..."
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
              <div class="row">
                <div
                  id="datePicker"
                  className="collapse mt-5 pt-5 position-absolute"
                  aria-expanded="false"
                ></div>
              </div>
              <div class="table-responsive table-height">
                <table class="table text-center  mb-4 table-striped">
                  <thead>
                    <tr className="text-center">
                      <th className="fw-bold">ID</th>
                      <th>Name</th>
                      <th>Image</th>
                      <th>Payment Gateway</th>
                      <th>Description</th>
                      <th>Diamonds</th>
                      <th>CreatedAt</th>
                      <th>Accept</th>
                      <th>Decline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      (rowsPerPage > 0
                        ? data.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data
                      ).map((data, i) => {
                        return (
                          <>
                            <tr className="text-center">
                              <td> {i + 1}</td>
                              <td className="text-capitalize">
                                {data?.userId?.name ? data?.userId?.name: "-"}
                              </td>
                              {data?.userId?.profileImage ? (
                                <td>
                                  <img
                                    src={data?.userId?.profileImage}
                                    draggable="false"
                                    className="mx-auto table_image"
                                    alt=""
                                   
                                  />
                                </td>
                              ) : (
                                <td>No Image</td>
                              )}

                              <td>{data?.paymentGateway}</td>
                              <td
                                style={{ textAlign: "start", width: "200px" }}
                              >
                                {data?.details?.split(",").map((details_) => {
                                  return <li>{details_} </li>;
                                })}
                              </td>
                              <td>{data?.diamond}</td>
                              <td>
                                {dayjs(data?.updatedAt).format("DD MMM, YYYY")}
                              </td>
                              <td>
                                <button
                                  class="btn-grad"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(to right, #306689 0%, #26a0da  51%, #306689  100%)",
                                  }}
                                  onClick={() =>
                                    handleAccept(data._id, "accept")
                                  }
                                >
                                  <i class="fa fa-check"></i> Accept
                                </button>
                              </td>
                              <td>
                                <button
                                  class="btn-grad"
                                  onClick={() => handleDecline(data._id)}
                                >
                                  <i class="fas fa-times"></i> Decline
                                </button>
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
                    <td colSpan="15" className="p-0">
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
                    </td>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getRedeem, acceptRedeem, acceptRedeemDecline })(
  RedeemPending
);
