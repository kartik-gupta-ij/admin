import React from "react";
import { useState, useEffect } from "react";
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from "../../util/Pagination";
import { Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getCoinPlan,
  deleteCoinPlan,
  isActiveCoinPlan,
} from "../../store/CoinPlan/CoinPlan.action";

import { warning } from "../../util/Alert";
import dayjs from "dayjs";
import { OPEN_DIALOGUE } from "../../store/dialog/dialog.type";
import CoinplanDialogue from "../Dialog/CoinplanDialogue";

const CoinPlanTable = (props) => {
  const { coinPlan } = useSelector((state) => state.coinPlan);
  
  const dispatch = useDispatch();
  const { dialog, type, dialogData } = useSelector(
    (state) => state.dialog
  );
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState(false);
  const [sortDollar, setSortDollar] = useState(false);
  const [sortCoin, setSortCoin] = useState(false);

  useEffect(() => {
    dispatch(getCoinPlan());
  }, []);

  useEffect(() => {
    setData(coinPlan);
  }, [coinPlan]);

  // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // handle Plan isActive

  const handleClick = (data) => {
    
    props.isActiveCoinPlan(data);
  };

  // handle Edit plan

  // handle Delete planL
  const handleDelete =async (id) => {
    
    try {
      const data = await warning("Delete");
      const yes = data?.isConfirmed;
      console.log("yes", yes);
      if (yes) {
        props.deleteCoinPlan(id);
      }
    } catch (err) {
      console.log(err);
    }

  };

  // handle Create Dialog Open

  // handle search CoinPlan

  // const handleSearch = (e) => {
  //   const value = e.target.value.toUpperCase();
  //   if (value) {
  //     const data = coinPlan.filter((data) => {
  //       return (
  //         data?.extraCoin?.toString()?.indexOf(value) > -1 ||
  //         data?.coin?.toString()?.indexOf(value) > -1 ||
  //         data?.planLevel?.toString()?.indexOf(value) > -1 ||
  //         data?.dollar?.toString()?.indexOf(value) > -1 ||
  //         ("ANDROID".toLowerCase().includes(value.toLowerCase()) &&
  //           data?.platformType?.toString()?.indexOf("0") > -1) ||
  //         ("IOS".toLowerCase().includes(value.toLowerCase()) &&
  //           data?.platformType?.toString()?.indexOf("1") > -1)
  //       );
  //     });
  //     setData(data);
  //   } else {
  //     setData(coinPlan);
  //   }
  // };

  const handleShort = () => {
    setSort(!sort);
    if (!sort) {
      let arraySort = data.sort((data, array) => {
        return data.coin - array.coin;
      });
      setData(arraySort);
    } else {
      let arraySort = data.sort((data, array) => {
        return array.coin - data.coin;
      });
      setData(arraySort);
    }
  };

  const handleShortDollar = () => {
    setSortDollar(!sortDollar);
    if (!sortDollar) {
      let arraySort = data.sort((data, array) => {
        return data.coin - array.coin;
      });
      setData(arraySort);
    } else {
      let arraySort = data.sort((data, array) => {
        return array.coin - data.coin;
      });
      setData(arraySort);
    }
  };
  const handleShortCoin = () => {
    setSortCoin(!sortCoin);
    if (!sortCoin) {
      let arraySort = data.sort((data, array) => {
        return data.coin - array.coin;
      });
      setData(arraySort);
    } else {
      let arraySort = data.sort((data, array) => {
        return array.coin - data.coin;
      });
      setData(arraySort);
    }
  };

  return (
    <>
      <div className="row py-2">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4 className="table_title">CoinPlan </h4>
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
                <a href={() => false}> CoinPlan </a>
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
                  <button 
                   onClick={() => {
                    dispatch({
                      type: OPEN_DIALOGUE,
                      payload: { type: "VipPlanFlash" },
                    });
                  }}
                  class="btn-hover color-11">
                    <i class="fa fa-plus pr-1" aria-hidden="true"></i> Add
                  </button>
                </div>
                <div class="col-xl-4 col-md-4 float-right col-sm-12 col-12 filtered-list-search "></div>
              </div>
              <div class="table-responsive table-height">
                <table class="table text-center  mb-4 table-striped">
                  <thead className="sticky-top" style={{ top: "-1px " }}>
                    <tr className="text-center">
                      <th className="fw-bold">No </th>
                      <th
                        className="fw-bold"
                        onClick={handleShort}
                        style={{ cursor: "pointer" }}
                      >
                        Coin {sort ? " ▼" : " ▲"}
                      </th>

                      <th
                        className="fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={handleShortDollar}
                      >
                        Dollar {sortDollar ? " ▼" : " ▲"}
                      </th>

                      <th
                        className="fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={handleShortCoin}
                      >
                        Extra Coin {sortCoin ? " ▼" : " ▲"}
                      </th>
                      <th className="fw-bold">platForm Type</th>
                      <th className="fw-bold">Tag</th>
                      <th className="fw-bold">Created Date</th>
                      <th className="fw-bold">is Active</th>
                      <th className="fw-bold">Edit</th>
                      <th className="fw-bold">Delete</th>
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
                              <td> {data?.coin}</td>
                              <td> {data?.dollar}</td>
                              <td>{data?.extraCoin ? data?.extraCoin : "0"}</td>
                              <td>
                                {data?.platFormType === 0 ? "Android" : "IOS"}
                              </td>
                              <td>{data?.tag ? data?.tag : "-"}</td>
                              <td>
                                {dayjs(data?.createdAt).format("DD MMM YYYY")}
                              </td>
                              <td>
                                <div
                                  class={`toggle plan ${
                                    data?.isActive && "on"
                                  }`}
                                  id="toggle"
                                  onClick={() => handleClick(data?._id)}
                                >
                                  <div class="slide">
                                    <span class="fa fa-circle-o"></span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <a
                                  href={() => false}
                                  onClick={() => {
                                    dispatch({
                                      type: OPEN_DIALOGUE,
                                      payload: { data: data, type: "VipPlanFlash" },
                                    });
                                  }}
                                >
                                  <i
                                    class="fa fa-edit text-dark infoButton"
                                   
                                  ></i>
                                </a>
                              </td>
                              <td>
                                <a
                                  href={() => false}
                                  onClick={() => handleDelete(data._id)}
                                >
                                  
                                    <i
                                    class="bi bi-trash3 text-dark infoButton"
                                 
                                  ></i>
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
        {dialog && type === "VipPlanFlash" && (
          <CoinplanDialogue />
        )}
      </div>
    </>
  );
};

export default connect(null, { getCoinPlan, deleteCoinPlan, isActiveCoinPlan })(
  CoinPlanTable
);
