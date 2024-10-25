import React, { useState } from "react";
import { connect } from "react-redux";
import "../assets/css/authentication/form-2.css";
import { signupAdmin } from "../store/Admin/admin.action";

import logo from "../assets/img/logo.png";
import { projectName } from "../util/config";

const Registration = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const isEmail = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
    return validNumber;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !code || !newPassword || !isEmail(email) || newPassword !== password) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      if (!newPassword) error.newPassword = "new password is required !";

      if (newPassword !== password)
        error.newPassword = "New Password and Confirm Password doesn't match !";
      if (!code) error.code = "purchase code is required !";
      return setError({ ...error });
    } else {
      let login = {
        email,
        password,
        code,
      };

      props.signupAdmin(login);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
      <div class="form-container outer" style={{ backgroundColor: "#eef2f6" }}>
        <div class="form-form">
          <div class="form-form-wrap">
            <div class="form-container">
              <div
                class="form-content"
                style={{ backgroundColor: "#ffffff", padding: "40px" }}
              >
                <div>
                  <img
                    src={logo}
                    style={{
                      width: "100px",
                      height: "100px",
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      borderRadius: "20px",
                    }}
                    alt=""
                    className="mx-auto"
                    draggable="false"
                  />
                </div>
                <h3
                  className="mt-4"
                  style={{ fontWeight: "bold", color: "#e70765" }}
                >
                  Sign Up {projectName}
                </h3>
                <p className=" mt-4" style={{ color: "#000" }}>
                  {" "}
                  Enter your email address and password to access admin panel.  
                </p>

                <form class="text-left" autoComplete="off">
                  <div class="form">
                    <div class="mb-3">
                      <div class="form-floating">
                        <input
                          type="email"
                          class="form-control"
                          id="floatingInput"
                          placeholder=" "
                          required
                          style={{ borderRadius: "12px" }}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                email: "Email is Required !",
                              });
                            } else {
                              return setError({
                                ...error,
                                email: "",
                              });
                            }
                          }}
                        />
                        <label for="floatingInput">Email address</label>
                      </div>
                      <div class="mt-1 ml-2 mb-3">
                        {error.email && (
                          <div class="pl-1 text-left pb-1">
                            <span
                              className="font-size-lg text-danger"
                              style={{ fontWeight: "600" }}
                            >
                              {error.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="form-floating">
                        <input
                          type="password"
                          class="form-control"
                          id="floatingPassword"
                          placeholder="Password"
                          style={{ borderRadius: "12px" }}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                password: "Password is Required !",
                              });
                            } else {
                              return setError({
                                ...error,
                                password: "",
                              });
                            }
                          }}
                        />
                        <label for="floatingPassword">Password</label>
                      </div>
                      <div class="mt-1 ml-2 mb-3">
                        {error.password && (
                          <div class="pl-1 text-left pb-1 text-danger">
                            <span style={{ fontWeight: "600" }}>
                              {error.password}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="form-floating">
                        <input
                          type="password"
                          class="form-control"
                          id="newPassword"
                          name="newPassword"
                          placeholder="Confirm Password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                newPassword: "Password is Required !",
                              });
                            } else {
                              return setError({
                                ...error,
                                newPassword: "",
                              });
                            }
                          }}
                        />
                        <label for="floatingPassword"> Confirm Password</label>
                      </div>
                      <div class="mt-2 ml-2 mb-3">
                        {error.newPassword && (
                          <div class="pl-1 text-left pb-1">
                            <span className="text-red">
                              {error.newPassword}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="form-floating">
                        <input
                          type="text"
                          class="form-control"
                          id="code"
                          name="code"
                          placeholder="Purchase code"
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                code: "purchase Code  is Required !",
                              });
                            } else {
                              return setError({
                                ...error,
                                code: "",
                              });
                            }
                          }}
                        />
                        <label for="floatingPassword"> Purchase Code</label>
                      </div>
                      <div class="mt-2 ml-2 mb-3">
                        {error.code && (
                          <div class="pl-1 text-left pb-1">
                            <span className="text-red">{error.code}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* <p class="signup-link"> Forget Password</p> */}

                    <div class="d-sm-flex justify-content-between">
                      <div class="field-wrapper">
                        <button
                          type="button"
                          class="btn text-white btnSubmit"
                          onClick={handleSubmit}
                          value=""
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { signupAdmin })(Registration);
