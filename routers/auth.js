const express = require("express");
const authRouter = express.Router();

const { signUp, logIn } = require("../auth/authService");
const { signVal } = require("../validators/authValidator");
const {
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../auth/passwordAuth");

authRouter.route("/signup").post(signVal, signUp);
authRouter.route("/logIn").get(logIn);
authRouter.post("/forgetPassword", forgetPassword);
authRouter.post("/verifyPassResetCode", verifyPassResetCode);
authRouter.put("/resetPassword", resetPassword);

module.exports = authRouter;
