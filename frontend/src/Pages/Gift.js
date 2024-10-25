import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getGift } from "../store/Gift/gift.action";
import { OPEN_GIFT_DIALOG } from "../store/Gift/gift.type";
import { warning } from "../util/Alert";
import { baseURL } from "../util/config";
import bin from "../../src/assets/img/bin.png";

//action
import { deleteGift } from "../store/Gift/gift.action";
import { OPEN_DIALOGUE } from "../store/dialog/dialog.type";
import UpdateGift from "../Components/Dialog/Gift/UpdateGift";

const Gift = (props) => {
  const { gift } = useSelector((state) => state.gift);
  
  const { dialog, type, dialogData } = useSelector(
    (state) => state.dialog
  );
  const [data, setData] = useState([]);
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGift()); // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    setData(gift);
  }, [gift]);

  const handleEdit = (data) => {
    dispatch({ type: OPEN_GIFT_DIALOG, payload: data });
  };
  const handleDelete = (id) => {
    

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteGift(id);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_GIFT_DIALOG });
  };
  const handleAddOpen = () => {
    history.push("/admin/gift/giftAdd");
  };
  return (
    <>


      <div class="row layout-top-spacing align-items-center">
        <div class="col-xl-6 col-md-6  col-sm-12 col-12">
          <h4 className="table_title"> Gift </h4>
        </div>
        <div className="col-xl-6 col-md-6  col-sm-12 col-12 text-end ">
          <button class="btn-hover color-11 me-0" onClick={handleAddOpen}>
            New
          </button>
        </div>
      </div>
      <div className="card py-3 px-4" style={{ borderRadius: "26px 26px 0 0" }}>
        <div class={`layout-top-spacing row `}>
          {data?.length > 0 ? (
            data.map((data, index) => {
              return (
                <>
                  <div
                    class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4 col-xxl-3 my-3"
                    key={index}
                  >
                    <div
                      class="card contact-card card-bg pointer-cursor "
                      style={{
                        backgroundColor: "#e4065d08 ",
                        borderRadius: "25px",
                        boxShadow: "none",
                        border: "1px solid rgba(228, 6, 93, 0.4)",
                      }}
                    >
                      <div class="card-body ">
                        <div className="row align-items-center ">
                          <div className="col-12 col-md-6">
                            <div className="gif_backGround  mx-auto">
                              <img
                                src={baseURL + data.image}
                                alt=""
                                class="shadow rounded-circle giftImage mx-auto "
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <div class="d-flex contact-card-info justify-content-center mt-2 pt-2">
                              <h5 className="dialog__input__title mx-1 ">
                                {data.coin} Coin
                              </h5>
                            </div>
                            <div class="d-flex contact-card-info my-2  px-2 justify-content-center">
                              <h5 className="dialog__inputTitle ">
                                {data?.platFormType === 0 && "Android"}
                                {data?.platFormType === 1 && "IOS"}
                                {data?.platFormType === 2 && "Both"}
                              </h5>
                            </div>
                            <div className="row">
                              <div
                                className="col-6 text-right"
                                style={{ paddingLeft: "1px" }}
                              >
                                <div class="contact-card-buttons text-right">
                                  <button
                                    type="button"
                                    class="btn  badge badge-lg p-2 px-4 m-1 d-inline-block"
                                    style={{ backgroundColor: "#123FDE" }}
                                    onClick={() => {
                                      dispatch({
                                        type: OPEN_DIALOGUE,
                                        payload: { data: data, type: "gift" },
                                      });
                                    }}
                                  >
                                    <i
                                      class="fa fa-edit text-white"
                                      style={{ fontSize: "25px" }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                              <div
                                className="col-6"
                                style={{ paddingLeft: "5px" }}
                              >
                                <div class="contact-card-buttons text-left ">
                                  <button
                                    type="button"
                                    class="btn  badge badge-lg  p-2  px-4  m-1 d-inline-block"
                                    style={{ backgroundColor: "#E20F28" }}
                                    onClick={() => handleDelete(data._id)}
                                  >
                                    <img
                                      className="d-block mx-auto"
                                      alt=""
                                      src={bin}
                                      style={{ width: "25px", height: "25px" }}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" align="center">
                Nothing to show!!
              </td>
            </tr>
          )}
        </div>
      </div>
      {dialog && type === "gift" && (
        <UpdateGift />
      )}
    </>
  );
};

export default connect(null, { getGift, deleteGift })(Gift);
