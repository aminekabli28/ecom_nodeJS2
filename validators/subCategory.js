const { check, param } = require("express-validator");
const errorCatch = require("../middlewares/validatorMiddleware");

addSubCategoryVal = [
  check("name")
    .notEmpty()
    .withMessage("invalid name")
    .isLength({ min: 2 })
    .withMessage("name too short")
    .isLength({ max: 30 })
    .withMessage("name too long > 30"),
  check("category").isMongoId().withMessage("check category id format"),
  errorCatch,
];

idSubCategoryVal = [
  param("id").isMongoId().withMessage("invalid subcategory id "),
  errorCatch,
];

upSubCategoryVal = [
  check("id").isMongoId().withMessage("invalid subcategory id"),
  check("name")
    .notEmpty()
    .withMessage("invalid name")
    .isLength({ min: 5 })
    .withMessage("name too short")
    .isLength({ max: 50 })
    .withMessage("name too long"),
  errorCatch,
];
module.exports = { addSubCategoryVal, idSubCategoryVal, upSubCategoryVal };
