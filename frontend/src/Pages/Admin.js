import React from "react";
import { useEffect } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import Navbar from "../Components/navbar/Navbar";
import Sidebar from "../Components/navbar/Sidebar";
import UserTable from "../Components/table/UserTable";
import Dashboard from "./Dashboard";

//css
// import "../assets/js/bootstrap/css/bootstrap.min.css";
// import "../assets/css/plugins.css";
// import "../assets/css/structure.css";
import "../assets/css/tables/table-basic.css";
import "../assets/css/elements/search.css";
import "../assets/css/forms/switches.css";
import "../assets/css/elements/breadcrumb.css";
import "../assets/css/tables/table-basic.css";
import "../assets/css/newStyle.css";
//js
import "../assets/js/bootstrap/js/bootstrap.min.js";
import "../assets/js/bootstrap/js/popper.min.js";
import "../assets/js/app";

//component

import Gift from "./Gift";
import CoinPlanTable from "../Components/table/CoinPlanTable";

import AddGift from "../Components/Dialog/Gift/AddGift";
import PostReport from "../Components/table/PostReport";
import ProfileReport from "../Components/table/ProfileReport";
import UserProflie from "./UserProflie";
import Proflie from "./Proflie";
import UserHistory from "../Components/table/UserHistory";
import PaymentSetting from "./PaymentSetting";
import AppSetting from "./AppSetting";
import Error404 from "./Error404";
import RedeemPending from "../Components/table/RedeemPending";
import RedeemAccepted from "../Components/table/RedeemAccepted";
import RedeemDecline from "../Components/table/RedeemDecline";
import PurchaseHistory from "../Components/table/PurchaseHistory";
import Withdraw from "../Components/table/Withdraw";
import FakeUser from "../Components/table/FakeUser";
import FakePostTable from "../Components/table/FakePostTable";

const Admin = () => {
  const history = useHistory();
  const location = useRouteMatch();

  useEffect(() => {
    if (history.path === "/admin/dashboard") {
      history.push("/admin/dashboard");
    }
  }, []);
  return (
    <>
      <Navbar />

      <div
        class="main-container"
        id="container"
        style={{ backgroundColor: "#fff" }}
      >
        {/* <div class="overlay"></div> */}
        <Sidebar />
        <div id="content" class="main-content">
          <div class="layout-px-spacing mt-4">
            <Switch>
              <Route
                path={`${location.path}/dashboard`}
                component={Dashboard}
              />
              <Route path={`${location.path}/profile`} component={Proflie} />

              <Route
                path={`${location.path}/user`}
                exact
                component={UserTable}
              />
              <Route
                path={`${location.path}/fakeUser`}
                exact
                component={FakeUser}
              />
              <Route
                path={`${location.path}/user/history`}
                exact
                component={UserHistory}
              />
              <Route
                path={`${location.path}/user/userProfile`}
                component={UserProflie}
              />
              <Route
                path={`${location.path}/post`}
                exact
                component={FakePostTable}
              />

              <Route path={`${location.path}/gift`} exact component={Gift} />
              <Route
                exact
                path={`${location.path}/gift/giftAdd`}
                component={AddGift}
              />

              <Route
                exact
                path={`${location.path}/gift/dialog`}
                component={AddGift}
              />

              <Route
                path={`${location.path}/coinPlan`}
                exact
                component={CoinPlanTable}
              />
              {/* <Route
                path={`${location.path}/banner`}
                exact
                component={Banner}
              /> */}

              <Route exact path={`${location.path}/gift`} component={Gift} />

              <Route
                path={`${location.path}/pendingRedeem`}
                exact
                component={RedeemPending}
              />
              <Route
                path={`${location.path}/acceptedRedeem`}
                exact
                component={RedeemAccepted}
              />
              <Route
                path={`${location.path}/declineRedeem`}
                exact
                component={RedeemDecline}
              />
              <Route
                path={`${location.path}/postReport`}
                exact
                component={PostReport}
              />
              <Route
                path={`${location.path}/withdraw`}
                exact
                component={Withdraw}
              />
              <Route
                path={`${location.path}/profileReport`}
                exact
                component={ProfileReport}
              />
              <Route
                path={`${location.path}/appSetting`}
                exact
                component={AppSetting}
              />
              <Route
                path={`${location.path}/paymentSetting`}
                exact
                component={PaymentSetting}
              />
              <Route
                path={`${location.path}/purchaseHistory`}
                exact
                component={PurchaseHistory}
              />
              <Route path={`${location.path}/*`} exact component={Error404} />
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
