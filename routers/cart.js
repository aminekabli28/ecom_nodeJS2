const express = require("express");
const cartRouter = express.Router();
const { tokenVerify } = require("../auth/tokenVerify");
const allowedTo = require("../auth/permissions");

const {
  addToCart,
  getMyCart,
  removeFromCart,
  removeCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../controller/cartController");

//--------------------------- add wishlist --------------------------------------------------
cartRouter.post("/addToCart", tokenVerify, allowedTo("user"), addToCart);

//----------------------------my wishlist --------------------------------------------------
cartRouter.get("/getMyCart", tokenVerify, allowedTo("user"), getMyCart);

//------------------------------------------------------------------------------------------
cartRouter.delete(
  "/delcart/:cartItemsId",
  tokenVerify,
  allowedTo("user"),
  removeFromCart
);

//------------------------------------------------------------------------------------------
cartRouter.delete("/removeCart", tokenVerify, allowedTo("user"), removeCart);

//------------------------------------------------------------------------------------------
cartRouter.put(
  "/updateCartItemQuantity/:itemId",
  tokenVerify,
  allowedTo("user"),
  updateCartItemQuantity
);

//------------------------------------------------------------------------------------------
cartRouter.post("/applyCoupon", tokenVerify, allowedTo("user"), applyCoupon);

//------------------------------------------------------------------------------------------

module.exports = cartRouter;

// no validator
