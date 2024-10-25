import TablePagination from '@mui/material/TablePagination';
import dayjs from "dayjs";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { OPEN_WITHDRAW } from "../../store/withdraw/withdraw.type";
import { warning } from "../../util/Alert";
import { baseURL } from "../../util/config";
import TablePaginationActions from "../../util/Pagination";
import {
  getWithdraw,
  deleteWithdraw,
} from "../../store/withdraw/withdraw.action";
import $ from "jquery";
import male from "../../assets/img/male.png";
import WithdrawDialogue from "../Dialog/WithDrawDialogue";
import { OPEN_DIALOGUE } from "../../store/dialog/dialog.type";

const Withdraw = (props) => {
  const { withdraw } = useSelector((state) => state.withdraw);
  const dispatch = useDispatch();
  const { dialog, type, dialogData } = useSelector(
    (state) => state.dialog
  );
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  

  useEffect(() => {
    dispatch(getWithdraw());
  }, [dispatch]);

  useEffect(() => {
    setData(withdraw);
  }, [withdraw]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpen = () => {
    dispatch({ type: OPEN_WITHDRAW });
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_WITHDRAW, payload: data });
  };

  const handleDelete = async (id) => {
    
    try {
      const data = await warning("Delete");
      const yes = data?.isConfirmed;
      console.log("yes", yes);
      if (yes) {
        props.deleteWithdraw(id);
      }
    } catch (err) {
      console.log(err);
    }

  };

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", male);
    });
  });
  return (
    <>
      <div className="row py-2">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4 className="table_title">Withdraw </h4>
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
                <a href={() => false}> Withdraw </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row layout-top-spacing">
        <div id="tableDropdown" class="col-lg-12 col-12 layout-spacing">
          <div class="statbox widget  ">
            <div class="widget-content widget-content-area pt-0">
              <div class="row ">
                <div class="col-xl-8 col-md-8 col-sm-12 col-12">
                  <button class="btn-hover color-11" onClick={() => {
                    dispatch({
                      type: OPEN_DIALOGUE,
                      payload: { type: "withdraw" },
                    });
                  }}>
                    <i class="fa fa-plus pr-1" aria-hidden="true"></i> Add
                  </button>
                </div>
              
              </div>
              <div class="table-responsive" style={{ maxHeight: "675px" }}>
                <table class="table text-center  mb-4 table-striped">
                  <thead>
                    <tr className="text-center">
                      <th className="fw-bold">ID</th>
                      <th className="fw-bold">Image </th>
                      <th className="fw-bold">Name</th>
                      <th className="fw-bold">Details</th>
                      <th className="fw-bold">Created At</th>
                      <th className="fw-bold">Edit</th>
                      <th className="fw-bold">Delete</th>
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
                                  src={baseURL + data?.image}
                                  alt="withdraw"
                                  draggable="false"
                                  className="mx-auto "
                                  style={{
                                    borderRadius: "12px",
                                    width: "120px",
                                    height: "80px",
                                  }}
                                />
                              </td>
                              <td>{data?.name}</td>
                              <td
                                style={{ textAlign: "start", width: "175px" }}
                              >
                                {data?.details?.split(",").map((details_) => {
                                  return <li>{details_} </li>;
                                })}
                              </td>
                              <td>
                                {dayjs(data?.createdAt).format("DD MMM YYYY")}
                              </td>
                              <td>
                                <a
                                  href={() => false}
                                  onClick={() => {
                                    dispatch({
                                      type: OPEN_DIALOGUE,
                                      payload: { data: data, type: "withdraw" },
                                    });
                                  }}
                                >
                                  <i class="fa fa-edit text-dark infoButton"></i>
                                </a>
                              </td>
                              <td>
                                <a
                                  href={() => false}
                                  onClick={() => handleDelete(data._id)}
                                >
                                  <i class="bi bi-trash3 text-dark infoButton"></i>
                                </a>
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

        {dialog && type === "withdraw" && (
          <WithdrawDialogue />
        )}
      </div>
    </>
  );
};

export default connect(null, { getWithdraw, deleteWithdraw })(Withdraw);
