const reviewModel = require("../model/reviewModel");
const ApiError = require("../api/ApiErrors");
const handleAsync = require("express-async-handler");
const productModel = require("../model/productModel");

addReview = handleAsync(async (req, res) => {
  reviewObj = {};
  const newReview = new reviewModel({
    title: req.body.title,
    user: req.params.id,
    product: req.body.product,
    ratings: req.body.ratings,
  });

  await newReview
    .save()
    .then(() => {
      console.log("newReview added");
      res.status(200).json({ newReview });
    })
    .catch((err) => {
      console.log(`error: ${err}`);
    });
});

deleteReview = handleAsync(async (req, res, next) => {
  const { id } = req.body;
  const oldRes = await productModel.findOne({ _id: req.params.idPro });
  const review2 = await reviewModel.findById(id);

  const m = oldRes.ratingsAverage;
  const c = oldRes.ratingsQuantity;
  const r = review2.ratings;

  const review = await reviewModel.deleteOne({ _id: id }, { new: true });
  if (!review) {
    return next(new ApiError("Review id not available", 404));
  }

  if (c > 1) {
    const R = (m * c - r) / (c - 1);
    const newRes = await productModel.findOneAndUpdate(
      { _id: req.params.idPro },
      {
        ratingsAverage: R,
        ratingsQuantity: c - 1,
      },
      { new: true }
    );
    console.log(newRes);
  } else {
    const newRes = await productModel.findOneAndUpdate(
      { _id: req.params.idPro },
      {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      },
      { new: true }
    );
    console.log(newRes);
  }

  res.status(200).json({ msg: `Review deleted` });
});

getReviews = handleAsync(async (req, res, next) => {
  let filterIObj = {};

  if (req.params.productId) {
    filterIObj = { product: req.params.productId };
  }
  if (req.params.idProRev) {
    filterIObj = { product: req.params.idProRev };
  }

  const review = await reviewModel.find(filterIObj);

  if (!review) {
    return next(new ApiError("no reviews", 404));
  }
  res.status(200).json({ result: review.length, review });
});
getMyReviews = handleAsync(async (req, res, next) => {
  let filterIObj = {};

  if (req.params.id) {
    filterIObj = { user: req.user.id };
  }

  const review = await reviewModel.find(filterIObj);

  if (!review) {
    return next(new ApiError("no reviews", 404));
  }
  res.status(200).json({ result: review.length, review });
});
//-------------------------------------------------------------------------------

updateReview = handleAsync(async (req, res) => {
  // const productId = req.params.productId;
  // const { title } = req.body;
  // const { ratings } = req.body;
  // const review = await reviewModel.findOneAndUpdate(
  //   { product: productId },
  //   {
  //     title: title,
  //     ratings: ratings,
  //   },
  //   { new: true }
  // );
  // if (!review) {
  //   res.status(404).json({ msg: "no review for this id" });
  // } else {
  //   review.save();
  //   res.status(200).json({ result: review.length, review });
  // }
});

module.exports = {
  addReview,
  deleteReview,
  getReviews,
  getMyReviews,
  updateReview,
};
