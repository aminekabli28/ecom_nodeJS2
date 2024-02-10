const { check } = require("express-validator");
const errorCatch = require("../middlewares/validatorMiddleware");
const { param } = require("express-validator");

const addCategoryVal = [
  check("name")
    .notEmpty()
    .withMessage("invalid name")
    .isLength({ min: 2 })
    .withMessage("name too short")
    .isLength({ max: 30 })
    .withMessage("name too long > 30"),
  errorCatch,
];

idCategoryVal = [
  param("id").isMongoId().withMessage("invalid category id "),
  errorCatch,
];

upCategoryVal = [
  check("id").isMongoId().withMessage("invalid category id"),
  check("name")
    .notEmpty()
    .withMessage("invalid name")
    .isLength({ min: 5 })
    .withMessage("name too short")
    .isLength({ max: 50 })
    .withMessage("name too long"),
  errorCatch,
];
module.exports = { addCategoryVal, idCategoryVal, upCategoryVal };
