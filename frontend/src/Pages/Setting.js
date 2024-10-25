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

const Setting = (props) => {
  const { setting } = useSelector((state) => state.setting);
  const dispatch = useDispatch();

  const [agoraKey, setAgoraKey] = useState("");
  const [agoraCertificate, setAgoraCertificate] = useState("");
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [termAndCondition, setTermAndCondition] = useState("");
  const [googlePlayEmail, setGooglePlayEmail] = useState("");
  const [googlePlayKey, setGooglePlayKey] = useState("");
  const [googlePlaySwitch, setGooglePaySwitch] = useState(false);
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [isAppActive, setAppIsAppActive] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");
  const [redirectAppUrl, setRedirectAppUrl] = useState("");
  const [stripeSwitch, setStripeSwitch] = useState(false);
  const [videoCallCharge, setVideoCallCharge] = useState(0);
  const [coin, setCoin] = useState(0);
  const [diamond, setDiamond] = useState(1);
  const [errors, setError] = useState({
    agoraKey: "",
    agoraCertificate: "",
    privacyPolicyLink: "",
    privacyPolicyText: "",
    googlePlayEmail: "",
    googlePlayKey: "",
    termAndCondition: "",
    stripePublishableKey: "",
    stripeSecretKey: "",
    isAppActive: "",
    welcomeMessage: "",
    redirectMessage: "",
    redirectAppUrl: "",
    videoCallCharge: "",
    diamond: "",
  });

  useEffect(() => {
    dispatch(getSetting()); // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    setAgoraKey(setting?.agoraKey);
    setAgoraCertificate(setting?.agoraCertificate);
    setPrivacyPolicyLink(setting?.privacyPolicyLink);
    setPrivacyPolicyText(setting?.privacyPolicyText);
    setTermAndCondition(setting?.termAndCondition);
    setGooglePlayEmail(setting?.googlePlayEmail);
    setGooglePlayKey(setting?.googlePlayKey);
    setGooglePaySwitch(setting?.googlePlaySwitch);
    setRedirectAppUrl(setting?.redirectAppUrl);
    setRedirectMessage(setting?.redirectMessage);
    setStripeSwitch(setting?.stripeSwitch);
    setAppIsAppActive(setting?.isAppActive);
    setWelcomeMessage(setting?.welcomeMessage);
    setStripePublishableKey(setting?.stripePublishableKey);
    setStripeSecretKey(setting?.stripeSecretKey);
    setVideoCallCharge(setting?.videoCallCharge);
    setCoin(setting?.coin);
    setDiamond(setting?.diamond);
  }, [setting]); 

  const handleSubmit = () => {
    if (
      !agoraKey ||
      !agoraCertificate ||
      !privacyPolicyLink ||
      !privacyPolicyText ||
      !googlePlayEmail ||
      !googlePlayKey ||
      !termAndCondition ||
      !stripePublishableKey ||
      !stripeSecretKey ||
      !isAppActive ||
      !welcomeMessage ||
      !redirectMessage ||
      !redirectAppUrl ||
      videoCallCharge < 0 ||
      coin < 0
    ) {
      let error = {};
      if (!agoraKey) error.agoraKey = "Agora Key Is Required";
      if (!agoraCertificate)
        error.agoraCertificate = "Agora Certificate Is Required";
      if (!stripePublishableKey)
        error.stripePublishableKey = "Stripe Certificate Is Required";
      if (!stripeSecretKey) error.stripeSecretKey = "Stripe Secret Is Required";
      if (!welcomeMessage) error.welcomeMessage = "Welcome Message Required";
      if (!redirectAppUrl) error.redirectAppUrl = "Redirect App URL Required";
      if (!redirectMessage) error.redirectMessage = "Redirect Message Required";
      if (!privacyPolicyLink)
        error.privacyPolicyLink = "Privacy Policy Link Required";
      if (!termAndCondition)
        error.termAndCondition = "Term and Condition Required";
      if (!privacyPolicyText)
        error.privacyPolicyText = "Privacy Policy Text Required";
      if (!googlePlayEmail)
        error.googlePlayEmail = "Google Play Email Required";
      if (!googlePlayKey) error.googlePlayKey = "Google Play Key Required";
      if (videoCallCharge < 0)
        error.videoCallCharge = "Video Call Charge Required";
      if (coin < 0) error.coin = "Coin Required";
    } else {
      let settingData = {
        agoraKey,
        agoraCertificate,
        privacyPolicyLink,
        privacyPolicyText,
        googlePlayEmail,
        googlePlayKey,
        termAndCondition,
        stripePublishableKey,
        stripeSecretKey,
        isAppActive,
        welcomeMessage,
        redirectMessage,
        redirectAppUrl,
        videoCallCharge,
        coin,
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
          <h4>Setting</h4>
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
              <li class="active">Setting</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row">
        <div class="col-md-6 col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-12">
                  <h5 class="card-title  ">Agora Setting</h5>
                </div>
              </div>

              <form>
                <div class="mb-3 mt-3 row">
                  <div class="col-md-12">
                    <label for="referralBonus" class="form-label">
                      Agora Key
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="referralBonus"
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
                <div class=" mb-3 row">
                  <div class="col-md-12">
                    <label for="loginBonus" class="form-label">
                      Agora Certificate
                    </label>
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
                            agoraCertificate: "Agora Certificate is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            agoraCertificate: "",
                          });
                        }
                      }}
                    />
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
        <div class="col-md-6 col-12 ">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-6">
                  <h5 class="card-title d-flex justify-content-between mb-3">
                    Is App Active
                  </h5>
                </div>
                <div className="col-6">
                  <label class="switch s-icons s-outline  s-outline-secondary float-right  mb-4 mr-2">
                    <input
                      type="checkbox"
                      checked={isAppActive}
                      onChange={() => handleSwitch_("app")}
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              <form>
                <div class=" mb-3 row">
                  <div className="col-md-6 ">
                    <label for="policyLink" class="form-label">
                      Privacy Policy Link
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="policyLink"
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
                    <label for="policyText" class="form-label">
                      Term And Condition Link
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="policyText"
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
                <div class=" mb-3 row">
                  <div className="col-md-12">
                    <label for="policyText" class="form-label">
                      Privacy Policy Text
                    </label>
                    <textarea
                      type="text"
                      class="form-control"
                      id="policyText"
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
      </div>
      <h3 className="my-3">Payment Setting</h3>
      <div class="row">
        <div class="col-md-6 col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-6">
                  <h5 class="card-title d-flex justify-content-between">
                    Google Play
                  </h5>
                </div>
                <div className="col-6">
                  <label class="switch s-icons s-outline  s-outline-secondary float-right  mb-4 mr-2">
                    <input
                      type="checkbox"
                      checked={googlePlaySwitch}
                      onChange={() => handleSwitch_("googlePlay")}
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>

              <form>
                <div class="mb-3 row">
                  <div className="col-12">
                    <label for="googlePlayEmail" class="form-label">
                      Google Play Email
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="googlePlayEmail"
                      value={googlePlayEmail}
                      onChange={(e) => {
                        setGooglePlayEmail(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            googlePlayEmail: "Google Play Email is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            googlePlayEmail: "",
                          });
                        }
                      }}
                    />
                    {errors.googlePlayEmail && (
                      <div className="ml-2 mt-1">
                        {errors.googlePlayEmail && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.googlePlayEmail}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div class="mb-3 row">
                  <div className="col-12">
                    <label for="key" class="form-label">
                      Key
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="key"
                      value={googlePlayKey}
                      onChange={(e) => {
                        setGooglePlayKey(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            googlePlayKey: "GooglePlay Key is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            googlePlayKey: "",
                          });
                        }
                      }}
                    />
                    {errors.googlePlayKey && (
                      <div className="ml-2 mt-1">
                        {errors.googlePlayKey && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.googlePlayKey}
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
          <div class="card">
            <div class="card-body">
              <div className="row">
                <div className="col-6">
                  <h5 class="card-title d-flex justify-content-between">
                    Stripe
                  </h5>
                </div>
                <div className="col-6">
                  <label class="switch s-icons s-outline  s-outline-secondary float-right  mb-4 mr-2">
                    <input
                      type="checkbox"
                      checked={stripeSwitch}
                      onChange={() => handleSwitch_("stripe")}
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              <form>
                <div class="mb-3">
                  <label for="publishableKey" class="form-label">
                    Publishable Key
                  </label>
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
                  <label for="secretKey" class="form-label">
                    Secret Key
                  </label>
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
      <h3 className="my-3">Welcome Setting</h3>

      <div className="row">
        <div class="col-md-6 col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div className="col-12">
                  <h5 class="card-title  ">Welcome Setting</h5>
                </div>
              </div>

              <form>
                <div class="mb-3 mt-3 row">
                  <div class="col-md-12">
                    <label for="referralBonus" class="form-label">
                      Welcome Message
                    </label>
                    <textarea
                      row="3"
                      type="text"
                      class="form-control"
                      id="referralBonus"
                      value={welcomeMessage}
                      onChange={(e) => {
                        setWelcomeMessage(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            welcomeMessage: "Welcome Message is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            welcomeMessage: "",
                          });
                        }
                      }}
                    />
                    {errors.welcomeMessage && (
                      <div className="ml-2 mt-1">
                        {errors.welcomeMessage && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.welcomeMessage}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div class=" mb-3 row">
                  <div class="col-md-6">
                    <label for="loginBonus" class="form-label">
                      Redirect Message
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="loginBonus"
                      value={redirectMessage}
                      onChange={(e) => {
                        setRedirectMessage(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            redirectMessage: "Redirect Message is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            redirectMessage: "",
                          });
                        }
                      }}
                    />
                    {errors.redirectMessage && (
                      <div className="ml-2 mt-1">
                        {errors.redirectMessage && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.redirectMessage}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div class="col-md-6">
                    <label for="Redirect App Agora Key" class="form-label">
                      Redirect App Url
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="redirect AppUrl"
                      value={redirectAppUrl}
                      onChange={(e) => {
                        setRedirectAppUrl(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            redirectAppUrl: "Redirect AppUrl is Required !",
                          });
                        } else {
                          return setError({
                            ...errors,
                            redirectAppUrl: "",
                          });
                        }
                      }}
                    />
                    {errors.redirectAppUrl && (
                      <div className="ml-2 mt-1">
                        {errors.redirectAppUrl && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {errors.redirectAppUrl}
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
      </div>
    </>
  );
};

export default connect(null, { getSetting, updateSetting, handleSwitch })(
  Setting
);
