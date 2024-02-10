const express = require("express");
const orderRouter = express.Router();
const { tokenVerify } = require("../auth/tokenVerify");
const allowedTo = require("../auth/permissions");

const {
  createCashOrder,
  orders,
  order,
  orderPaid,
  orderDelivered,
  checkoutSession,
} = require("../controller/orderController");

//--------------------------- add wishlist --------------------------------------------------
orderRouter.post(
  "/createCashOrder",
  tokenVerify,
  allowedTo("user"),
  createCashOrder
);

//*************************************************************************************** */
orderRouter.get("/orders", tokenVerify, orders);
orderRouter.get("/order/:orderId", tokenVerify, order);
orderRouter.get(
  "/orderPaid/:orderId",
  tokenVerify,
  allowedTo("admin", "manager"),
  orderPaid
);
//*************************************************************************************** */
orderRouter.get(
  "/orderDelivered/:orderId",
  tokenVerify,
  allowedTo("admin", "manager"),
  orderDelivered
);
//*************************************************************************************** */
orderRouter.post(
  "/checkoutSession",
  tokenVerify,
  allowedTo("user"),
  checkoutSession
);

module.exports = orderRouter;

// no validator
