const express = require("express");
const couponRouter = express.Router();
const { tokenVerify } = require("../auth/tokenVerify");
const allowedTo = require("../auth/permissions");

const {
  addCoupon,
  getcoupons,
  deleteCoupon,
  getcoupon,
  updateCoupon,
} = require("../controller/couponController");

couponRouter.post(
  "/addCoupon",
  //   tokenVerify,
  //   allowedTo("admin", "manager"),
  addCoupon
);
couponRouter.get(
  "/coupons",
  //   tokenVerify,
  //   allowedTo("admin", "manager"),
  getcoupons
);
couponRouter.get(
  "/coupon/:couponId",
  //   tokenVerify,
  //   allowedTo("admin", "manager"),
  getcoupon
);
couponRouter.delete(
  "/deletecoupon/:couponId",
  //   tokenVerify,
  //   allowedTo("admin", "manager"),
  deleteCoupon
);
couponRouter.put(
  "/updateCoupon/:couponId",
  //   tokenVerify,
  //   allowedTo("admin", "manager"),
  updateCoupon
);

module.exports = couponRouter;
