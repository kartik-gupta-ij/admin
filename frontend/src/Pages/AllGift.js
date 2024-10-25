// alert
import { warning } from "../util/Alert";

// component
import { baseURL } from "../util/config";

//redux
import { connect, useDispatch } from "react-redux";

//action
import { deleteGift } from "../store/Gift/gift.action";

// type
import { OPEN_GIFT_DIALOG } from "../store/Gift/gift.type";

const AllGift = (props) => {
  const dispatch = useDispatch();

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

  return (
    <>
      {props.data?.gift?.length > 0 ? (
        props.data?.gift?.map((data, index) => {
          return (
            <>
              <div
                className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-3 my-4"
                key={index}
                onClick={() => {
                  localStorage.setItem("CategoryId", data._id);
                  // history.push("/admin/giftCategory/gift");
                }}
              >
                <div class="card contact-card card-bg">
                  <div class="card-body p-1">
                    <div className="row  py-4 align-items-center">
                      <div className="col-6  d-flex justify-content-center">
                        <img
                          src={data.image && baseURL + data.image}
                          alt="gift"
                          className="mx-auto shadow rounded-circle"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            display: "block",
                            borderRadius: "50px",
                          }}
                          draggable="false"
                        />
                      </div>
                      <div
                        className="col-6 d-flex flex-column"
                        style={{
                          padding: 0,
                          paddingLeft: 5,
                        }}
                      >
                        <div class="d-flex contact-card-info justify-content-center mt-2 pt-2">
                          <h5 className="dialog__input__title gift_Text">
                            Coin :
                          </h5>
                          <h5 className="dialog__input__title mx-1 gift_Text">
                            {data.coin}
                          </h5>
                        </div>
                        {data.platFormType === 1 ? (
                          <div class="d-flex contact-card-info my-2  px-2 justify-content-center">
                            <h5 className="dialog__input__title gift_Text_PlatformType">
                              IOS
                            </h5>
                          </div>
                        ) : (
                          <div class="d-flex contact-card-info my-2  px-2 justify-content-center">
                            <h5 className="dialog__input__title gift_Text_PlatformType">
                              Android
                            </h5>
                          </div>
                        )}

                        <div className="row">
                          <div
                            className="col-6 text-left"
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
                          <div
                            className="col-6"
                            style={{ padding:"0 5px 0 0"}}
                          >
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
            </>
          );
        })
      ) : (
        <tr>
          <td colSpan="4" align="center">
            Nothing to show!!
          </td>
        </tr>
      )}
    </>
  );
};

export default connect(null, { deleteGift })(AllGift);
