import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getSetting,
  updateSetting,
  handleSwitch,
} from "../store/setting/setting.action";


const AppSetting = (props) => {
  const { setting } = useSelector((state) => state.setting);
  
  const dispatch = useDispatch();

  const [agoraKey, setAgoraKey] = useState("");
  const [agoraCertificate, setAgoraCertificate] = useState("");
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [termAndCondition, setTermAndCondition] = useState("");
  const [isAppActive, setAppIsAppActive] = useState(false);
  const [isFake, setIsFake] = useState(false);
  const [videoCallCharge, setVideoCallCharge] = useState(0);
  const [howToWithdraw, setHowToWithdraw] = useState("");
  const [contactSupport, setContactSupport] = useState("");
  const [coin, setCoin] = useState(0);
  const [diamond, setDiamond] = useState(0);
  const [withdrawLimit, setWithdrawLimit] = useState(0);
  const [privateKey, setPrivateKey] = useState();

  const [errors, setError] = useState({
    agoraKey: "",
    agoraCertificate: "",
    privacyPolicyLink: "",
    privacyPolicyText: "",
    contactSupport: "",

    howToWithdraw: "",
    termAndCondition: "",

    isAppActive: "",
    welcomeMessage: "",
    redirectMessage: "",
    redirectAppUrl: "",
    videoCallCharge: "",
    diamond: "",
    withdrawLimit: "",
    privateKey: "",
  });

  useEffect(() => {
    dispatch(getSetting()); // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    setContactSupport(setting?.contactSupport);
    setHowToWithdraw(setting?.howToWithdraw);
    setAgoraKey(setting?.agoraKey);
    setAgoraCertificate(setting?.agoraCertificate);
    setPrivacyPolicyLink(setting?.privacyPolicyLink);
    setPrivacyPolicyText(setting?.privacyPolicyText);
    setTermAndCondition(setting?.termAndCondition);
    setAppIsAppActive(setting?.isAppActive);
    setIsFake(setting?.isFake);
    setVideoCallCharge(setting?.videoCallCharge);
    setCoin(setting?.coin);
    setDiamond(setting?.diamond);
    setWithdrawLimit(setting?.withdrawLimit);
    setPrivateKey(JSON.stringify(setting?.privateKey));
  }, [setting]);

  const handleSubmit = () => {
    if (
      !contactSupport ||
      !howToWithdraw ||
      !agoraKey ||
      !agoraCertificate ||
      !privacyPolicyLink ||
      !privacyPolicyText ||
      !termAndCondition ||
      videoCallCharge < 0 ||
      diamond < 0 ||
      coin < 0 ||
      withdrawLimit < 0
    ) {
      let error = {};
      if (!contactSupport) error.contactSupport = "Contact Support is Required";
      if (!howToWithdraw) error.howToWithdraw = "Withdraw is Required";
      if (!agoraKey) error.agoraKey = "Agora Key Is Required";
      if (!agoraCertificate)
        error.agoraCertificate = "Agora Certificate Is Required";
      if (!privacyPolicyLink)
        error.privacyPolicyLink = "Privacy Policy Link Required";
      if (!termAndCondition)
        error.termAndCondition = "Term and Condition Required";
      if (!privacyPolicyText)
        error.privacyPolicyText = "Privacy Policy Text Required";
      if (videoCallCharge < 0)
        error.videoCallCharge = "Video Call Charge Required";
      if (coin < 0) error.coin = "Coin Required";
      if (diamond < 0) error.diamond = "Diamond Required";
      if (withdrawLimit < 0) error.withdrawLimit = "Withdraw Limit Required";
      return setError({ ...error });
    } else {
      

      let settingData = {
        agoraKey,
        agoraCertificate,
        privacyPolicyLink,
        privacyPolicyText,
        termAndCondition,
        isAppActive,

        videoCallCharge,
        coin,
        diamond,
        withdrawLimit,
        contactSupport,
        howToWithdraw,
        privateKey,
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
          <h4>App Setting</h4>
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
                <a href={() => false}>App Setting</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row">

        <div class="col-md-6 col-12 ">
          <h5 className="my-3">App Setting</h5>
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-8">
                  <h6 class="card-title d-flex justify-content-between mb-3">
                    Is App Active (use at the time of app maintenance)
                  </h6>
                </div>
                <div className="col-4">
                  <span class="slider round"></span>
                  <div
                    class={`toggle plan ${isAppActive && "on"}`}
                    id="toggle"
                    onClick={() => handleSwitch_("app")}
                    style={{ margin: "0px", marginLeft: "auto" }}
                  >
                    <div class="slide">
                      <span class="fa fa-circle-o"></span>
                    </div>
                  </div>
                </div>
              </div>
              <form>
                <div class=" mb-3 mt-4 row">
                  <div className="col-md-6 mb-3">
                    {/* <label for="policyLink" class="form-label">
                      Privacy Policy Link
                    </label> */}
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="policyLink Link"
                        value={privacyPolicyLink}
                        onChange={(e) => {
                          setPrivacyPolicyLink(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              privacyPolicyLink:
                                "privacy Policy Link is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              privacyPolicyLink: "",
                            });
                          }
                        }}
                      />
                      <label htmlFor="Link">Privacy Policy Link</label>
                    </div>
                    {errors.privacyPolicyLink && (
                      <div className="ml-2 mt-1">
                        {errors.privacyPolicyLink && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.privacyPolicyLink}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    {/* <label for="policyText" class="form-label">
                      Term And Condition Link
                    </label> */}
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="policyText PocilyText"
                        value={termAndCondition}
                        onChange={(e) => {
                          setTermAndCondition(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              termAndCondition:
                                "Term And Condition is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              termAndCondition: "",
                            });
                          }
                        }}
                      />
                      <label htmlFor="PolicyText">
                        Term And Condition Link
                      </label>
                    </div>
                    {errors.termAndCondition && (
                      <div className="ml-2 mt-1">
                        {errors.termAndCondition && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.termAndCondition}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div class=" mb-3 mt-3 row">
                  <div className="col-md-12">
                    <div className="form-floating">
                      <textarea
                        type="text"
                        class="form-control"
                        id="policyText Text"
                        value={privacyPolicyText}
                        onChange={(e) => {
                          setPrivacyPolicyText(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              privacyPolicyText:
                                "privacy PolicyText is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              privacyPolicyText: "",
                            });
                          }
                        }}
                      />
                      <label htmlFor="Text">Privacy Policy Text</label>
                    </div>
                    {errors.privacyPolicyText && (
                      <div className="ml-2 mt-1">
                        {errors.privacyPolicyText && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.privacyPolicyText}
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
                    class="btn text-white  btn-primary"
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
          <h5 className="my-3">Charges</h5>
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-12">
                  <h6 class="card-title  ">Charges</h6>
                </div>
              </div>
              <div className="col-12">
              </div>      
              <form>
                <h6 class="card-title  ">1 dollar = {diamond} diamond in app</h6>
                <div className="mb-3 mt-3 row">
                  <div class="col-md-6 mb-3">
                    
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="referralBonus"
                        value="1"
                        readOnly
                      />
                      <label for="referralBonus">Dollar($)</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="referralBonus"
                        value={diamond}
                        onChange={(e) => {
                          setDiamond(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              diamond: "Agora Key is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              diamond: "",
                            });
                          }
                        }}
                      />
                      <label for="referralBonus">Diamond</label>
                    </div>
                    {errors.diamond && (
                      <div className="ml-2 mt-1">
                        {errors.diamond && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.diamond}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div class="mt-3 mb-3 row">
                  <div class="col-md-6 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="loginBonus"
                        value={videoCallCharge}
                        onChange={(e) => {
                          setVideoCallCharge(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              videoCallCharge:
                                "Video Call Charge is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              videoCallCharge: "",
                            });
                          }
                        }}
                      />
                      <label for="loginBonus">Video Call Charge (diamond per min)</label>
                    </div>

                    {errors.videoCallCharge && (
                      <div className="ml-2 mt-1">
                        {errors.videoCallCharge && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.videoCallCharge}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div class="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="loginBonus"
                        value={withdrawLimit}
                        onChange={(e) => {
                          setWithdrawLimit(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              withdrawLimit: "Withdraw Limit is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              withdrawLimit: "",
                            });
                          }
                        }}
                      />
                      <label for="loginBonus">Withdraw Limit (max diamond withdraw)</label>
                    </div>

                    {errors.withdrawLimit && (
                      <div className="ml-2 mt-1">
                        {errors.withdrawLimit && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.withdrawLimit}
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
                    class="btn text-white  btn-primary"
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
          <h5 className="my-3">Agora Setting</h5>
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-12">
                  <h6 class="card-title ">Agora Setting</h6>
                </div>
              </div>

              <form>
                <div class="mb-3 mt-3 row">
                  <div class="col-md-12 mb-3">
                    {/* <label for="referralBonus" class="form-label">
                      Agora Key
                    </label> */}
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="referralBonus Bonus"
                        value={agoraKey}
                        onChange={(e) => {
                          setAgoraKey(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              agoraKey: "Agora Key is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              agoraKey: "",
                            });
                          }
                        }}
                      />
                      <label htmlFor="Bonus">Agora Key</label>
                    </div>
                    {errors.agoraKey && (
                      <div className="ml-2 mt-1">
                        {errors.agoraKey && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.agoraKey}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div class="mb-3 row">
                  <div class="col-md-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="loginBonus"
                        value={agoraCertificate}
                        onChange={(e) => {
                          setAgoraCertificate(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              agoraCertificate:
                                "Agora Certificate is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              agoraCertificate: "",
                            });
                          }
                        }}
                      />
                      <label for="loginBonus">Agora Certificate</label>
                    </div>
                    {errors.agoraCertificate && (
                      <div className="ml-2 mt-1">
                        {errors.agoraCertificate && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.agoraCertificate}
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
                    class="btn text-white  btn-primary"
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
          <h5 className="my-3">Contact Setting</h5>
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-12">
                  <h6 class="card-title">Contact Setting</h6>
                </div>
                <div className="col-6">
                  <h6 class="card-title">Fake Data</h6>
                </div>
                <div className="col-6">
                  <span class="slider round"></span>
                  <div
                    class={`toggle plan ${isFake && "on"}`}
                    id="toggle"
                    onClick={() => handleSwitch_("fake")}
                    style={{ margin: "0px", marginLeft: "auto" }}
                  >
                    <div class="slide">
                      <span class="fa fa-circle-o"></span>
                    </div>
                  </div>
                </div>
              </div>
              <form>
                <div class=" mb-3  mt-4 ">
                  {/* <label for="loginBonus" class="form-label">
                      Redirect Message
                    </label> */}
                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      class="form-control"
                      id="contact Setting"
                      value={contactSupport}
                      onChange={(e) => {
                        setContactSupport(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            contactSupport: "Contact Support is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            contactSupport: "",
                          });
                        }
                      }}
                    />
                    <label htmlFor="contact Setting">Contact Setting</label>
                  </div>
                  {errors.contactSupport && (
                    <div className="ml-2 mt-1">
                      {errors.contactSupport && (
                        <div className="pl-1 text__left">
                          <span className="text-danger">
                            {errors.contactSupport}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* <label for="Redirect App Agora Key" class="form-label">
                      Redirect App Url
                    </label> */}
                  <div className="form-floating ">
                    <input
                      type="text"
                      class="form-control"
                      id="how To Withdraw"
                      value={howToWithdraw}
                      onChange={(e) => {
                        setHowToWithdraw(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            howToWithdraw: "Withdraw is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            howToWithdraw: "",
                          });
                        }
                      }}
                    />
                    <label htmlFor="how To Withdraw"> How To Withdraw</label>
                  </div>
                  {errors.howToWithdraw && (
                    <div className="ml-2 mt-1">
                      {errors.howToWithdraw && (
                        <div className="pl-1 text__left">
                          <span className="text-danger">
                            {errors.howToWithdraw}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn text-white  btn-primary"
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
          <h5 className="my-3">Firebase Notification Setting</h5>
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-12">
                  <h6 class="card-title">Private Key JSON</h6>
                </div>
              </div>
              <form>
                <div class=" mb-3  mt-4 ">
                  {/* <label for="loginBonus" class="form-label">
                      Redirect Message
                    </label> */}
                  <div className=" mb-4">
                    <textarea
                      name=""
                      className="form-control"
                      id="privateKey"
                      rows={10}
                      value={privateKey}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        try {
                          const newData = JSON.parse(newValue);
                          setPrivateKey(newValue);
                          setError("");
                        } catch (error) {
                          // Handle invalid JSON input
                          console.error("Invalid JSON input:", error);
                          setPrivateKey(newValue);
                          return setError({
                            ...error,
                            privateKey: "Invalid JSON input",
                          });
                        }
                      }}
                    ></textarea>
                  </div>
                  {errors.privateKey && (
                    <div className="ml-2 mt-1">
                      {errors.privateKey && (
                        <div className="pl-1 text__left">
                          <span className="text-danger">
                            {errors.privateKey}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn text-white  btn-primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
    
      </div>
      </div>
    </>
  );
};

export default connect(null, { getSetting, updateSetting, handleSwitch })(
  AppSetting
);
