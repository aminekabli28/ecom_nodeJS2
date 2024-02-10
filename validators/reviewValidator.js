const { check } = require("express-validator");
//const ApiErrors =require ("../api/ApiErrors")
const errorCatch = require("../middlewares/validatorMiddleware");
const reviewModel = require("../model/reviewModel");

addReviewVal = [
  check("title").optional(),

  check("ratings")
    .notEmpty()
    .withMessage("ratings are required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratings must be between 1 and 5"),
  check("product")
    .isMongoId()
    .withMessage("product id invalid")
    .custom((val, { req }) =>
      // Check if logged user create review before
      reviewModel
        .findOne({ user: req.user.id, product: req.body.product })
        .then((review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        })
    ),

  errorCatch,
];

upReviewVal = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      // Check review ownership before update
      reviewModel
        .findOne({ product: val, user: req.params.id })
        .then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          console.log(review);

          if (review.user._id.toString() !== req.params.id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        })
    ),
  errorCatch,
];

module.exports = { upReviewVal, addReviewVal };
