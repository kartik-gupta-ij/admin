import "./App.css";

import { Route, Switch } from "react-router-dom";
// component

// css
import "./assets/css/bootstrap.min.css";
import "./assets/css/plugins.css";
import "./assets/css/structure.css";
import "./assets/css/scrollspyNav.css";

// js

// import "./assets/js/perfect-scrollbar.min.js";
import "./assets/js/bootstrap/js/bootstrap.min.js";
import "./assets/js/bootstrap/js/popper.min";
import "./assets/js/app.js";
import "./assets/css/newStyle.css";
// import "./assets/js/custom";
// import "./assets/js/scrollspyNav.js";

import { Suspense, lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { LOGIN_ADMIN } from "./store/Admin/admin.type";
import setToken from "./util/setToken";
import Error404 from "./Pages/Error404";
import axios from "axios";
import Registration from "./Pages/Registration.js";
import UpdateCode from "./Pages/UpdateCode.js";

const Login = lazy(() => import("./Pages/Login"));
const Admin = lazy(() => import("./Pages/Admin"));
const AuthRoute = lazy(() => import("./util/AuthRoute"));
const PrivateRouter = lazy(() => import("./util/PrivateRoute"));

function App() {
  const isAuth = localStorage.getItem("isAuth");

  const [login, setLogin] = useState(false);

  const dispatch = useDispatch();
  const key = localStorage.getItem("key");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/login")
      .then((res) => {
        console.log("res.data", res.data);
        setLogin(res.data.login);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!token && !key) return;
    dispatch({ type: LOGIN_ADMIN, payload: token });
  }, [setToken, key]);

  return (
    <>
      <Suspense fallback={""}>
        <Switch>
          {isAuth && <Route path="/admin" component={Admin} />}

          <AuthRoute exact path="/" component={login ? Login : Registration} />
          {login && <AuthRoute exact path="/login" component={Login} />}
          {login && <AuthRoute exact path="/code" component={UpdateCode} />}
          {login && (
            <AuthRoute exact path="/registration" component={Registration} />
          )}

          <PrivateRouter path="/admin" component={Admin} />
          <Route path="/*" component={Error404} />
        </Switch>
      </Suspense>
    </>
  );
}

export default App;
