const { check, body } = require("express-validator");
const errorCatch = require("../middlewares/validatorMiddleware");
const userModel = require("../model/userModel");
const ApiError = require("../api/ApiErrors");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");

addUserVal = [
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

  check("phone")
    .optional()
    .isMobilePhone(["ar-MA"])
    .withMessage("Invalid phone number only accepted morocco Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),

  errorCatch,
];
UpUserVal = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-MA"])
    .withMessage("Invalid phone number only accepted morocco Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),

  errorCatch,
];
getUserVal = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  errorCatch,
];

updateUserVal = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-MA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),
  errorCatch,
];

changeUserPasswordVal = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  errorCatch,
];

deleteUserVal = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  errorCatch,
];

updateLoggedUserVal = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("E-mail already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  errorCatch,
];

module.exports = {
  addUserVal,
  getUserVal,
  deleteUserVal,
  updateUserVal,
  changeUserPasswordVal,
  updateLoggedUserVal,
  UpUserVal,
};