import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getSetting,
  updateSetting,
  handleSwitch,
} from "../store/setting/setting.action";


const PaymentSetting = (props) => {
  const { setting } = useSelector((state) => state.setting);
  
  const dispatch = useDispatch();


  const [googlePlayEmail, setGooglePlayEmail] = useState("");
  const [googlePlayKey, setGooglePlayKey] = useState("");
  const [razorPaySwitch, setRazorPaySwitch] = useState(false);
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [stripeSwitch, setStripeSwitch] = useState(false);
  const [razorPayId, setRazorPayId] = useState("");
  const [razorSecretKey, setRazorSecretKey] = useState("");

  const [errors, setError] = useState({
    googlePlayEmail: "",
    googlePlayKey: "",

    stripePublishableKey: "",
  });

  useEffect(() => {
    dispatch(getSetting()); // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    setGooglePlayEmail(setting?.googlePlayEmail);
    setGooglePlayKey(setting?.googlePlayKey);
    // setGooglePaySwitch(setting?.googlePlaySwitch);
    setRazorPaySwitch(setting?.razorPay);
    setStripeSwitch(setting?.stripeSwitch);
    setRazorPayId(setting?.razorPayId);
    setRazorSecretKey(setting?.razorSecretKey);
    setStripePublishableKey(setting?.stripePublishableKey);
    setStripeSecretKey(setting?.stripeSecretKey);
  }, [setting]);

  const handleSubmit = () => {
    if (
      !googlePlayEmail ||
      !googlePlayKey ||
      !stripePublishableKey ||
      !stripeSecretKey
    ) {
      let error = {};

      if (!stripePublishableKey)
        error.stripePublishableKey = "Stripe Certificate Is Required";
      if (!stripeSecretKey) error.stripeSecretKey = "Stripe Secret Is Required";

      if (!googlePlayEmail)
        error.googlePlayEmail = "Google Play Email Required";
      if (!googlePlayKey) error.googlePlayKey = "Google Play Key Required";
    } else {
      

      let settingData = {
        googlePlayEmail,
        googlePlayKey,
        razorSecretKey,
        razorPayId,
        stripePublishableKey,
        stripeSecretKey,
      };

      props.updateSetting(settingData);
    }
  };

  const handleSwitch_ = (type) => {
    props.handleSwitch(type);
  };

  return (
    <>
      <div className="row my-3">
        <div class="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4>Payment Setting</h4>
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
                <a href={() => false}>Payment Setting</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 col-12">
          <h5 className="my-3">Razor Setting</h5>
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-8">
                  <h5 class="card-title d-flex justify-content-between">
                    Razor pay ( enable/disable razor pay for app )
                  </h5>
                </div>
                <div className="col-4">
                  <span class="slider round"></span>

                  <div
                    class={`toggle plan ${
                      razorPaySwitch && "on"
                    } ${razorPaySwitch}`}
                    id="toggle"
                    onClick={() => handleSwitch_("razorPay")}
                    style={{ margin: "0px", marginLeft: "auto" }}
                  >
                    <div class="slide">
                      <span class="fa fa-circle-o"></span>
                    </div>
                  </div>
                </div>
              </div>

              <form>
                <div class="mb-3 mt-4 row">
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="razorPayId"
                        placeholder=" "
                        value={razorPayId}
                        onChange={(e) => {
                          setRazorPayId(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              razorPayId: "razor Pay Id is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              razorPayId: "",
                            });
                          }
                        }}
                      />
                      <label for="razorPayId" class="form-label">
                        Razor Secret Key
                      </label>
                    </div>
                    {errors.razorPayId && (
                      <div className="ml-2 mt-1">
                        {errors.razorPayId && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.razorPayId}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div class="mb-3 row">
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="key"
                        placeholder=" "
                        value={razorSecretKey}
                        onChange={(e) => {
                          setRazorSecretKey(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              razorSecretKey: "Razor Secret Key is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              razorSecretKey: "",
                            });
                          }
                        }}
                      />
                      <label for="key" class="form-label">
                        Key razor Pay Id
                      </label>
                    </div>
                    {errors.razorSecretKey && (
                      <div className="ml-2 mt-1">
                        {errors.razorSecretKey && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.razorSecretKey}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn text-white btn-primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-12">
          <h5 className="my-3">Stripe Setting</h5>
          <div class="card">
            <div class="card-body">
              <div className="row">
                <div className="col-8">
                  <h5 class="card-title d-flex justify-content-between">
                    Stripe ( enable/disable stripe payment in app )
                  </h5>
                </div>
                <div className="col-4">
                  <span class="slider round"></span>
                  <div
                    class={`toggle plan ${
                      stripeSwitch && "on"
                    } ${stripeSwitch}`}
                    id="toggle"
                    onClick={() => handleSwitch_("stripe")}
                    style={{ margin: "0px", marginLeft: "auto" }}
                  >
                    <div class="slide">
                      <span class="fa fa-circle-o"></span>
                    </div>
                  </div>
                </div>
              </div>
              <form>
                <div class="mb-3 mt-4">
                  <div className="form-floating">
                    <input
                      type="text"
                      class="form-control"
                      id="publishableKey"
                      value={stripePublishableKey}
                      onChange={(e) => {
                        setStripePublishableKey(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            stripePublishableKey:
                              "Stripe PublishableKey is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            stripePublishableKey: "",
                          });
                        }
                      }}
                    />
                    <label for="publishableKey">Publishable Key</label>
                  </div>
                  {errors.stripePublishableKey && (
                    <div className="ml-2 mt-1">
                      {errors.stripePublishableKey && (
                        <div className="pl-1 text__left">
                          <span className="text-danger">
                            {errors.stripePublishableKey}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div class="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      class="form-control"
                      id="secretKey"
                      value={stripeSecretKey}
                      onChange={(e) => {
                        setStripeSecretKey(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            stripeSecretKey: "stripe SecretKey is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            stripeSecretKey: "",
                          });
                        }
                      }}
                    />
                    <label for="secretKey">Secret Key</label>
                  </div>
                  {errors.stripeSecretKey && (
                    <div className="ml-2 mt-1">
                      {errors.stripeSecretKey && (
                        <div className="pl-1 text__left">
                          <span className="text-danger">
                            {errors.stripeSecretKey}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-primary text-white"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getSetting, updateSetting, handleSwitch })(
  PaymentSetting
);
