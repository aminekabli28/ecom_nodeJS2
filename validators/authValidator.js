const { check, body } = require("express-validator");
const errorCatch = require("../middlewares/validatorMiddleware");
const userModel = require("../model/userModel");
const ApiError = require("../api/ApiErrors");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");

signVal = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    //.isLength({ min: 3 })
    //.withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("the email is not correct")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect", 500);
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  errorCatch,
];

module.exports = {
  signVal,
};
