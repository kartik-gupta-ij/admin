import React from "react";
import { Link } from "react-router-dom";

const DashboardBox = ({ boxColor, url, icon, title, value }) => {
  return (
    <>
      <div class="col-xl-3 mt-2 col-lg-6 col-md-6 col-xm-12  layout-spacing">
        <div
          className="mainDash text-center"
          style={{
            backgroundColor: boxColor,
          }}
        >
          <div
            className="dashIcon"
            style={{
              borderColor: boxColor,
              color: boxColor,
            }}
          >
            <i className={`${icon}`}></i>
          </div>
          <div className="dashCount fs-1 my-3 fw-bold">{value}</div>

          <Link to={url}>
            <div
              className="dashText text-white w-100 fw-bold  border-bottom d-inline "
              style={{
                fontSize: "16px",
              }}
            >
              {title}
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardBox;
