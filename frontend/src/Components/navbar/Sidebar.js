import React from "react";
import { Link, useHistory } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { LOGOUT_ADMIN } from "../../store/Admin/admin.type";
import { warning } from "../../util/Alert";
import $ from "jquery";

import Logo from "../../assets/img/tindoLogo.png";
import LogoTxt from "../../assets/img/tindoTxt.png";

// Import CSS
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/plugins.css";
import "../../assets/css/structure.css";

// JS
import "../../assets/js/bootstrap/js/bootstrap.min.js";
import "../../assets/js/bootstrap/js/popper.min.js";
import "../../assets/js/custom";
import "../../plugins/perfect-scrollbar/perfect-scrollbar.min.js";

const Sidebar = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      const data = await warning("Logout");
      const yes = data?.isConfirmed;
      if (yes) {
        dispatch({ type: LOGOUT_ADMIN });
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  $(".dropdown-toggle").click(function () {
    $(".dropdown-toggle").removeClass("active");
    $(this).addClass("active");
    $(".dropdown-toggle").attr("aria-expanded", "false");
  });

  const handleToggle = () => {
    $(".collapse").removeClass("show");
  };

  return (
    <div className="sidebar-wrapper sidebar-theme">
      <nav id="sidebar">
        <div className="logoBar">
          <div className="mainLogo">
            <Link to={{ pathname: "/admin/dashboard" }}>
              <img src={Logo} alt="" width={57} />
            </Link>
          </div>
          <div className="mainLogo">
            <Link to={{ pathname: "/admin/dashboard" }}>
              <img src={LogoTxt} alt="" width={56} />
            </Link>
          </div>
        </div>
        <ul className="list-unstyled menu-categories ps" id="accordionExample">
          {/* DashBoard */}
          <Tooltip title="Dashboard" placement="right">
            <li className="menu" onClick={handleToggle}>
              <Link
                to={{ pathname: "/admin/dashboard" }}
                data-toggle="collapse"
                className="dropdown-toggle navLink"
              >
                <div className="">
                  <i className="bi bi-house-door"></i>
                  <span>Dashboard</span>
                </div>
              </Link>
            </li>
          </Tooltip>

          {/* User */}
          <Tooltip title="User" placement="right">
            <li className="menu" onClick={handleToggle}>
              <Link
                data-toggle="collapse"
                to={{ pathname: "/admin/user" }}
                className="dropdown-toggle navLink"
              >
                <div className="">
                  <i className="bi bi-people"></i>
                  <span>User</span>
                </div>
              </Link>
            </li>
          </Tooltip>

          {/* Fake Details */}
          <li className="menu">
            <a href="#fakeDetails" data-toggle="collapse" className="dropdown-toggle">
              <div style={{ paddingRight: "10px" }}>
                <i className="bi bi-card-list"></i>
                <span>Fake Details</span>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </a>
            <ul className="collapse submenu list-unstyled" id="fakeDetails" data-parent="#accordionExample">
              <Tooltip title="Fake User" placement="right">
                <li>
                  <Link
                    to="/admin/fakeUser"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Fake User
                  </Link>
                </li>
              </Tooltip>
              <Tooltip title="Fake Post" placement="right">
                <li>
                  <Link
                    to="/admin/post"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Fake Post
                  </Link>
                </li>
              </Tooltip>
            </ul>
          </li>

          {/* Coin Plan */}
          <li className="menu">
            <a href="#coinPlan" data-toggle="collapse" className="dropdown-toggle">
              <div style={{ paddingRight: "10px" }}>
                <i className="bi bi-coin"></i>
                <span>Coin Plan</span>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </a>
            <ul className="collapse submenu list-unstyled" id="coinPlan" data-parent="#accordionExample">
              <Tooltip title="Pending Redeem" placement="right">
                <li>
                  <Link
                    to="/admin/coinPlan"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Plan
                  </Link>
                </li>
              </Tooltip>
              <Tooltip title="Accepted Redeem" placement="right">
                <li>
                  <Link
                    to="/admin/purchaseHistory"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Purchase History
                  </Link>
                </li>
              </Tooltip>
            </ul>
          </li>

          {/* Gift */}
          <Tooltip title="Gift" placement="right">
            <li className="menu" onClick={handleToggle}>
              <Link
                to="/admin/gift"
                className="dropdown-toggle navLink"
                data-toggle="collapse"
              >
                <div className="">
                  <i className="bi bi-gift"></i>
                  <span>Gift</span>
                </div>
              </Link>
            </li>
          </Tooltip>

          {/* Report */}
          <li className="menu">
            <a href="#elements" data-toggle="collapse" className="dropdown-toggle">
              <div style={{ paddingRight: "10px" }}>
                <i className="bi bi-receipt-cutoff"></i>
                <span>Report</span>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </a>
            <ul className="collapse submenu list-unstyled" id="elements" data-parent="#accordionExample">
              <Tooltip title="Post Report" placement="right">
                <li>
                  <Link
                    to="/admin/postReport"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Post Report
                  </Link>
                </li>
              </Tooltip>
              <Tooltip title="Profile Report" placement="right">
                <li>
                  <Link
                    to="/admin/profileReport"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Profile Report
                  </Link>
                </li>
              </Tooltip>
            </ul>
          </li>

          {/* Redeem */}
          <li className="menu">
            <a href="#dashboard" data-toggle="collapse" className="dropdown-toggle">
              <div style={{ paddingRight: "10px" }}>
                <i className="bi bi-credit-card-2-front"></i>
                <span>Redeem</span>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </a>
            <ul className="collapse submenu list-unstyled" id="dashboard" data-parent="#accordionExample">
              <Tooltip title="Pending Redeem" placement="right">
                <li>
                  <Link
                    to="/admin/pendingRedeem"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Pending Redeem
                  </Link>
                </li>
              </Tooltip>
              <Tooltip title="Accepted Redeem" placement="right">
                <li>
                  <Link
                    to="/admin/acceptedRedeem"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Accepted Redeem
                  </Link>
                </li>
              </Tooltip>
              <Tooltip title="Decline Redeem" placement="right">
                <li>
                  <Link
                    to="/admin/declineRedeem"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Declined Redeem
                  </Link>
                </li>
              </Tooltip>
            </ul>
          </li>

          {/* Withdraw */}
          <Tooltip title="Withdraw" placement="right">
            <li className="menu" onClick={handleToggle}>
              <Link
                to="/admin/withdraw"
                className="dropdown-toggle navLink"
                data-toggle="collapse"
              >
                <div className="">
                  <i className="bi bi-cash-coin"></i>
                  <span>Withdraw</span>
                </div>
              </Link>
            </li>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="Profile" placement="right">
            <li className="menu" onClick={handleToggle}>
              <Link to="/admin/profile" className="dropdown-toggle">
                <div className="">
                  <i className="bi bi-person"></i>
                  <span>Profile</span>
                </div>
              </Link>
            </li>
          </Tooltip>

          {/* Settings */}
          <li className="menu">
            <a href="#components" data-toggle="collapse" className="dropdown-toggle gift">
              <div style={{ paddingRight: "10px" }}>
                <i className="bi bi-gear"></i>
                <span>Setting</span>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </a>
            <ul className="collapse submenu list-unstyled" id="components" data-parent="#accordionExample">
              <Tooltip title="App Setting" placement="right">
                <li>
                  <Link
                    to="/admin/appSetting"
                    data-toggle="collapse"
                    className="dropdown-toggle navLink ms-3"
                  >
                    App Setting
                  </Link>
                </li>
              </Tooltip>
              <Tooltip title="Payment Setting" placement="right">
                <li>
                  <Link
                    to="/admin/paymentSetting"
                    className="dropdown-toggle navLink ms-3"
                    data-toggle="collapse"
                  >
                    Payment Setting
                  </Link>
                </li>
              </Tooltip>
            </ul>
          </li>

          {/* Logout */}
          <Tooltip title="Logout" placement="right">
            <li className="menu">
              <a onClick={handleLogout} className="dropdown-toggle">
                <div className="">
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </div>
              </a>
            </li>
          </Tooltip>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
