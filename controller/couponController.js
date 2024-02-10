const handleAsync = require("express-async-handler");
const ApiError = require("../api/ApiErrors");
const couponModel = require("../model/couponModel");

addCoupon = handleAsync(async (req, res) => {
  const newCoupon = await couponModel.create(req.body);

  res.status(200).json({ msg: `new Coupon added`, data: newCoupon });
});
deleteCoupon = handleAsync(async (req, res, next) => {
  const id = req.params.couponId;

  const coupon = await couponModel.findOneAndDelete({ _id: id }, { new: true });

  if (!coupon) {
    return next(new ApiError("coupon id not available", 404));
  }
  res.status(200).json({ msg: `coupon:${id} deleted` });
});

//---------------------------------------------------------------
getcoupons = handleAsync(async (req, res, next) => {
  const coupon = await couponModel.find();

  if (!coupon) {
    return next(new ApiError("coupons not available", 404));
  }

  res.status(200).json({ result: coupon.length, coupon });
});

//--------------------------------------------------------------
getcoupon = handleAsync(async (req, res, next) => {
  const id = req.params.couponId;
  const coupon = await couponModel.findById(id);

  if (!coupon) {
    return next(new ApiError("coupon id not available", 404));
  }

  res.status(200).json({ result: coupon.length, coupon });
});

//--------------------------------------------------------------

updateCoupon = handleAsync(async (req, res) => {
  const id = req.params.couponId;

  const coupon = await couponModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!coupon) {
    res.status(404).json({ msg: "no coupon for this id" });
  } else {
    res.status(200).json({ result: coupon.length, coupon });
  }
});

module.exports = {
  addCoupon,
  getcoupons,
  deleteCoupon,
  getcoupon,
  updateCoupon,
};
