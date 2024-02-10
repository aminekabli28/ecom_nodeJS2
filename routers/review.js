const express = require("express");
const reviewRouter = express.Router();
const { tokenVerify } = require("../auth/tokenVerify");
const allowedTo = require("../auth/permissions");

const {
  addReview,
  deleteReview,
  getReviews,
  updateReview,
  getMyReviews,
} = require("../controller/reviewController");
const { upReviewVal, addReviewVal } = require("../validators/reviewValidator");

reviewRouter.post(
  "/addReview",
  tokenVerify,
  allowedTo("user"),
  addReviewVal,
  addReview
);
reviewRouter.delete(
  "/deleteReview",
  tokenVerify,
  allowedTo("user"),
  deleteReview
);

reviewRouter.get("/reviews/:id", getReviews);
reviewRouter.get("/MyReviews", tokenVerify, getMyReviews);
reviewRouter.put(
  "/upReview/:productId",
  tokenVerify,
  allowedTo("user"),
  upReviewVal,
  updateReview
);

//-------------review by product ------------------------
reviewRouter.get("/product/:idProRev/reviews", getReviews);
reviewRouter.delete(
  "/product/:idPro/review",
  tokenVerify,
  allowedTo("user"),
  deleteReview
);
reviewRouter.post(
  "/product/:idProRev/review",
  tokenVerify,
  allowedTo("user"),
  addReviewVal,
  addReview
);

module.exports = reviewRouter;
