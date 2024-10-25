import axios from "axios";
import { baseURL, secretKey } from "../../util/config";
import * as ActionType from "./dashboard.type";
import { apiInstanceFetch } from "../../util/api";

export const getDashboard = () => (dispatch) => {
  apiInstanceFetch
    .get(`dashboard`)
    .then((res) => {
      dispatch({ type: ActionType.GET_DASHBOARD, payload: res.dashboard });
    })
    .catch((error) => console.error(error));
};

export const getChartAnalcite =
  (type, date, startDate, endDate) => (dispatch) => {
    
    const request = {
      method: "GET",
      headers: { "Content-Type": "application/json", key: secretKey },
    };
    fetch(
      `${baseURL}dashboard/analytic?type=${type}&date=${date}&startDate=${startDate}&endDate=${endDate}`,
      request
    )
      .then((response) => response.json())
      .then((res) => {
        
      
        dispatch({ type: ActionType.GET_ANALCITE, payload: res.analytic });
      })
      .catch((error) => {
        console.error(error);
      });
  };
