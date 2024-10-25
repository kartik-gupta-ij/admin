import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { OPEN_CATEGORY_DIALOG } from "../store/GiftCategory/Giftcategory.type";
import {
  getGiftCategory,
  deleteGiftCategory,
} from "../store/GiftCategory/GiftCategory.action";
import { baseURL } from "../util/config";
import { warning } from "../util/Alert";
import GiftCategoryDialog from "../Components/Dialog/GiftCategoryDialog";

const GiftCategory = (props) => {
  const { giftCategory } = useSelector((state) => state.giftCategory);
  
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getGiftCategory()); // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    setData(giftCategory); // eslint-disable-next-line
  }, [giftCategory]);

  // edit create

  const handleOpen = () => {
    dispatch({ type: OPEN_CATEGORY_DIALOG });
  };
  const handleEdit = (data) => {
    dispatch({ type: OPEN_CATEGORY_DIALOG, payload: data });
  };

  const handleDelete = (id) => {
    

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteGiftCategory(id);
        }
      })
      .catch((err) => console.log(err));
  };

  const history = useHistory();
  // open All Gift
  const openGift = (data) => {
    localStorage.removeItem("giftClick");
    localStorage.setItem("category", JSON.stringify(data));
    history.push("/admin/giftCategory/gift");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase();
    if (value) {
      const data = giftCategory.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.giftCount?.toString()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      setData(giftCategory);
    }
  };
  return (
    <>
      <div className="row py-2">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12 ">
          <h4>Gift Category </h4>
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

              <li class="active">Gift Category</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row layout-top-spacing">
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
          <button
            class="btn text-white  text-center btn-danger"
            onClick={handleOpen}
            id="giftDialog"
          >
            <i class="fa fa-plus pr-1" aria-hidden="true"></i> Add
          </button>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mb-3 mt-lg-0 mt-xl-0 filtered-list-search">
          <form class="form-inline my-2 my-lg-0 justify-content-center">
            <div class="w-100">
              <input
                type="text"
                class="w-100 form-control product-search br-30"
                id="input-search"
                placeholder="Search..."
                onChange={handleSearch}
              />
            </div>
          </form>
        </div>
      </div>
      <div class="row layout-top-spacing">
        {data.length > 0 ? (
          data.map((data, index) => {
            return (
              <div
                class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-3"
                key={index}
              >
                <div class="card contact-card card-bg pointer-cursor m-2">
                  <div class="card-body ">
                    <div className="row align-items-center">
                      <div className="col-6">
                        <img
                          src={baseURL + data.image}
                          alt=""
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            display: "block",
                            borderRadius: "50px",
                          }}
                          class="shadow rounded-circle"
                          onClick={
                            data?.isActive === false
                              ? false
                              : () => openGift(data)
                          }
                        />
                      </div>
                      <div className="col-6">
                        <div class="d-flex contact-card-info justify-content-center mt-2 pt-2">
                          <h5 className="dialog__input__title mx-1 gift_Text">
                            {data.giftCount} Gift
                          </h5>
                        </div>
                        <div class="d-flex contact-card-info my-2  px-2 justify-content-center">
                          <h5 className="dialog__input__title gift_Text">
                            {" "}
                            {data.name}
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
                                class="btn btn-info badge badge-lg  p-2 px-3 m-1 d-inline-block"
                                onClick={() => handleEdit(data)}
                              >
                                <i class="fas fa-edit text-white"></i>
                              </button>
                            </div>
                          </div>
                          <div className="col-6" style={{ paddingLeft: "5px" }}>
                            <div class="contact-card-buttons text-left ">
                              <button
                                type="button"
                                class="btn btn-danger badge badge-lg  p-2 px-3 m-1 d-inline-block"
                                onClick={() => handleDelete(data._id)}
                              >
                                <i class="fas fa-trash text-white"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

      <GiftCategoryDialog />
    </>
  );
};

export default connect(null, { getGiftCategory, deleteGiftCategory })(
  GiftCategory
);
