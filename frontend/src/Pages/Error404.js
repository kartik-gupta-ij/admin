import React from "react";
import { Link } from "react-router-dom";

import "../assets/css/custom.css";

const Error404 = () => {
  return (
    <>
      <div className="error404 text-center">
        <div class="container-fluid " >
          <div class="row">
            <div class="col-md-4 mr-auto mt-5 text-md-left text-center">
              <a href="index-2.html" class="ml-md-5">
                <h3>Tango</h3>
              </a>
            </div>
          </div>
        </div>
        <div class="container-fluid error-content d-flex justify-content-center align-items-center"style={{height:"80vh"}}>
          <div class="">
            <h1 class="error-number">404</h1>
            <p class="mini-text">Oops!</p>
            <p class="error-text mb-4 mt-1">
              The page you requested was not found!
            </p>
            <Link to="/admin/dashboard" class="btn btn-primary mt-5">
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error404;
