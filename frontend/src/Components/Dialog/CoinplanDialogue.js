import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createNewCoinPlan,
  updateCoinPlan,
} from "../../store/CoinPlan/CoinPlan.action";


import React from "react";
import { CLOSE_DIALOGUE } from "../../store/dialog/dialog.type";


const CoinplanDialogue = (props) => {
  const { dialog, dialogData } = useSelector((state) => state.dialog);
  const [mongoId, setMongoId] = useState("");
  const [coin, setCoin] = useState("");
  const [dollar, setDollar] = useState("");
  const [extraCoin, setExtraCoin] = useState("");
  const [platFormType, setPlatFormType] = useState("");
  const [productKey, setProductKey] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setCoin(dialogData.coin);
      setDollar(dialogData.dollar);
      setExtraCoin(dialogData.extraCoin);
      setTag(dialogData.tag);
      setProductKey(dialogData.productKey);
      setPlatFormType(dialogData?.platFormType);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        coin: "",
        dollar: "",
        rupee: "",
        productKey: "",
        extraCoin: "",
        platFormType: "",
      });
      setMongoId("");
      setCoin("");
      setPlatFormType("");
      setTag("");
      setDollar("");
      setProductKey("");
      setExtraCoin("");
    },
    [dialogData]
  );

  const dispatch = useDispatch();

  // handel Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !coin ||
      !dollar ||
      !productKey ||
      coin < 0 ||
      dollar < 0 ||
      extraCoin < 0 ||
      platFormType < 0 ||
      platFormType === "Select Package"
    ) {
      debugger;
      const error = {};
      if (!coin) error.coin = "Coin is required!";
      if (coin < 0) error.coin = "Invalid Coin!";
      if (extraCoin < 0) error.extraCoin = "Invalid Coin!";
      if (!dollar) error.dollar = "Dollar is required!";
      if (dollar < 0) error.dollar = "Invalid dollar!";
      if (platFormType === "Select Package" || platFormType < 0) {
        error.platFormType = "PlatFormType is Required!";
      }
      if (!productKey) error.productKey = "Product Key is required!";

      return setError({ ...error });
    }
    

    const data = {
      coin,
      dollar,
      extraCoin: extraCoin ? extraCoin : 0,
      tag,
      productKey,
      platFormType,
    };

    if (mongoId) {
      dispatch(updateCoinPlan(data, mongoId));
    } else {
      dispatch(createNewCoinPlan(data));
    }
    dispatch({ type: CLOSE_DIALOGUE });
  };

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div className="dialog">
      <div class="w-100">
        <div class="row justify-content-center">
          <div class="col-xl-5 col-md-8 col-11">
            <div class="mainDiaogBox">
              <div class="d-flex justify-content-between align-items-center formHead">
                <div className="">
                  <h2 className="text-theme m0">Coin plan Dialogue</h2>
                </div>
                <div className="">
                  <div
                    className="closeBtn boxCenter"
                    onClick={() => {
                      dispatch({ type: CLOSE_DIALOGUE });
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </div>
              </div>

              <div className="row align-items-start formBody">
                <div className="col-12 col-md-6">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="name" className="ms-2 order-1">
                      Coin
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="Coin"
                      required=""
                      min="0"
                      value={coin}
                      placeholder="10"
                      onChange={(e) => {
                        setCoin(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            coin: "coin is Required !",
                          });
                        } else {
                          return setError({
                            ...error,
                            coin: "",
                          });
                        }
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    {error && (
                      <p className="errorMessage text-start">
                        {error && error?.coin}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label className="ms-2 order-1">Extra Coin</label>
                    <input
                      type="number"
                      className="form-control"
                      required=""
                      id="ExtraCoin"
                      min="0"
                      placeholder="100"
                      value={extraCoin}
                      onChange={(e) => {
                        setExtraCoin(e.target.value);
                        setError({
                          ...error,
                          extraCoin: "",
                        });
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    {error && (
                      <p className="errorMessage text-start">
                        {error && error?.extraCoin}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="" className="ms-2 order-1">
                      Amount($)
                    </label>

                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      required=""
                      id="Dollar"
                      placeholder="100"
                      value={dollar}
                      onChange={(e) => {
                        setDollar(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            dollar: "Dollar is Required !",
                          });
                        } else {
                          return setError({
                            ...error,
                            dollar: "",
                          });
                        }
                      }}
                    />
                    {error && (
                      <p className="errorMessage text-start">
                        {error && error?.extraCoin}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label className="ms-2 order-1">Tag</label>

                    <input
                      type="text"
                      className="form-control"
                      required=""
                      id="Tag"
                      placeholder="20% OFF"
                      value={tag}
                      onChange={(e) => {
                        setTag(e.target.value);
                      }}
                    />
                    {error && (
                      <p className="errorMessage text-start">
                        {error && error?.tag}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label className="ms-2 order-1">Product Key</label>

                    <input
                      type="text"
                      className="form-control"
                      required=""
                      id="Key"
                      placeholder="android.test.purchased"
                      value={productKey}
                      onChange={(e) => {
                        setProductKey(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            productKey: "Product Key is Required !",
                          });
                        } else {
                          return setError({
                            ...error,
                            productKey: "",
                          });
                        }
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    {error && (
                      <p className="errorMessage text-start">
                        {error && error?.productKey}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label class="ms-2 order-1">Platform Type</label>
                    <div className="form-floating">
                      <select
                        name="type "
                        class="form-control form-control-line"
                        id="type Plateform"
                        value={platFormType}
                        onChange={(e) => {
                          setPlatFormType(e.target.value);

                          if (e.target.value === "Select Package") {
                            return setError({
                              ...error,
                              platFormType: "Platform type is required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              platFormType: "",
                            });
                          }
                        }}
                        onKeyPress={handleKeyPress}
                      >
                        <option value="Select Package">
                          ---Select Package---
                        </option>

                        <option value="0">Android</option>
                        <option value="1">IOS</option>
                      </select>
                    </div>
                    {error && (
                      <p className="errorMessage text-start">
                        {error && error?.platFormType}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 ">
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn-grad"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #306689 0%, #26a0da  51%, #306689  100%)",
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn-grad"
                      onClick={() => {
                        dispatch({ type: CLOSE_DIALOGUE });
                      }}
                    >
                      Close
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
};

export default CoinplanDialogue;
