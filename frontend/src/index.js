import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/Provider";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import LoaderDialogue from "./util/Loader";
import { CLOSE_LOADER, LOADER_OPEN } from "./store/Lodaer/loader.type";
import { baseURL, secretKey } from "./util/config";

axios.defaults.baseURL = baseURL;

axios.defaults.headers.common["key"] = secretKey;

axios.interceptors.request.use(
  (req) => {
    store.dispatch({ type: LOADER_OPEN });
    return req;
  },
  (error) => {
    console.log(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    store.dispatch({ type: CLOSE_LOADER });
    return res;
  },
  (err) => {
    if (err.message === "Network Error") {
    }
    store.dispatch({ type: CLOSE_LOADER });
    return Promise.reject(err);
  }
);
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <ToastContainer />
        <LoaderDialogue />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
