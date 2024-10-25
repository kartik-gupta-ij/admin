const express = require("express");
const route = express.Router();

const WithdrawRequestController = require("./withDrawRequest.controller");

const checkAccessWithSecretKey = require("../../checkAccess");

//Get request [ adminPanel ]
route.get("/get", checkAccessWithSecretKey(), WithdrawRequestController.adminIndex);

//Get requestAccept [ adminPanel ]
route.patch("/requestAccept", checkAccessWithSecretKey(), WithdrawRequestController.requestAccept);

//Get requestDecline [ adminPanel ]
route.patch("/requestDecline", checkAccessWithSecretKey(), WithdrawRequestController.requestDecline);

//Create Withdraw [Backend]
route.post("/", checkAccessWithSecretKey(), WithdrawRequestController.store);

//Get request [app ]
route.get("/", checkAccessWithSecretKey(), WithdrawRequestController.index);

//Update request [app]
route.patch("/", checkAccessWithSecretKey(), WithdrawRequestController.update);

//Get request [app]
route.delete("/", checkAccessWithSecretKey(), WithdrawRequestController.delete);

module.exports = route;
