const express = require("express");
const wishListRouter = express.Router();
const { tokenVerify } = require("../auth/tokenVerify");
const allowedTo = require("../auth/permissions");

const {
  addProToWishList,
  dellProRfomWishList,
  myWishList,
} = require("../controller/wishController");

//--------------------------- add wishlist --------------------------------------------------
wishListRouter.post(
  "/addProToWishList",
  tokenVerify,
  allowedTo("user"),
  addProToWishList
);

//----------------------------delete wishlist------------------------------------------------
wishListRouter.delete(
  "/delProWl/:productId",
  tokenVerify,
  allowedTo("user"),
  dellProRfomWishList
);

//----------------------------my wishlist --------------------------------------------------
wishListRouter.get("/wishlist", tokenVerify, allowedTo("user"), myWishList);

//------------------------------------------------------------------------------------------

module.exports = wishListRouter;

//no validator
