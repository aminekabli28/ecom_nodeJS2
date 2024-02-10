const express = require("express");
const adresseRouter = express.Router();
const { tokenVerify } = require("../auth/tokenVerify");
const allowedTo = require("../auth/permissions");

const {
  addAdresse,
  delAdresse,
  myAdresses,
} = require("../controller/adresseController");

//--------------------------- add wishlist --------------------------------------------------
adresseRouter.post("/addAdresse", tokenVerify, allowedTo("user"), addAdresse);

//----------------------------delete wishlist------------------------------------------------
adresseRouter.delete(
  "/delAdresse/:adresseId",
  tokenVerify,
  allowedTo("user"),
  delAdresse
);

//----------------------------my wishlist --------------------------------------------------
adresseRouter.get("/myAdresses", tokenVerify, allowedTo("user"), myAdresses);

//------------------------------------------------------------------------------------------

module.exports = adresseRouter;

// no validator
