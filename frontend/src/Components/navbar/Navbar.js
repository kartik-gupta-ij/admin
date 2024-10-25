import React, { useState } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import male from "../../assets/img/male.png";
import Notification from "../Dialog/Notification";
import { OPEN_DIALOGUE } from "../../store/dialog/dialog.type";

const handelToggle = () => {
  $(".fa-solid").toggleClass("fa-bars fa-bars-staggered");
  $("html").toggleClass("sidebar-noneoverflow");
  $("body").toggleClass("sidebar-noneoverflow");
  $(".navbar-expand-sm").toggleClass("expand-header");
  $(".main-container ").toggleClass(" sidebar-closed sbar-open");
};

const Navbar = () => {

  const { dialog, type, dialogData } = useSelector(
    (state) => state.dialog
  );

  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();


  const handleClickOpen = () => {
    dispatch({
      type: OPEN_DIALOGUE,
      payload: { type: "notify" },
    });
  };


  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", male);
    });
  });
  return (
    <>
      <div class="sub-header-container fixed-top">
        <header class="header navbar navbar-expand-sm">
          <div className="mainToggle sidebar_button">

            <i
              className="fa-solid fa-bars-staggered fs-5 "
              style={{
                transform: "rotate(180deg)",
                borderRadius: "10px",
                cursor: "pointer",
              }}
              onClick={handelToggle}
            ></i>
          </div>

          <ul class="navbar-nav flex-row ml-auto">

            <li class="nav-item dropdown notification-dropdown mr-2 navIcon">
              <a
                href={() => false}
                class="nav-link dropdown-toggle"
                onClick={handleClickOpen}
              >
                <i class="fa-regular fa-bell"></i>
              </a>
            </li>
            <li class="nav-item more-dropdown mr-2">
              <div class="dropdown  custom-dropdown-icon  ">
                <Link to="/admin/profile">
                  <img
                    src={admin.image}
                    draggable="false"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50px",
                    }}
                    alt=""
                  />
                </Link>
              </div>
            </li>
          </ul>
        </header>

        {dialog && type === "notify" && (
          <Notification />
        )}

      </div>
    </>
  );
};

export default Navbar;
