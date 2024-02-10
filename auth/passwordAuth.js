const crypto = require("crypto");
const handleAsync = require("async-error-handler");
const userModel = require("../model/userModel");
const ApiError = require("../api/ApiErrors");
const sendEmail = require("./sendEmail");
const jwt = require("jsonwebtoken");

forgetPassword = handleAsync(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError(` not exist`, 404));
  }
  const restCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashCodeRest = crypto
    .createHash("sha256")
    .update(restCode)
    .digest("hex");

  user.passwordResetCode = hashCodeRest;
  user.passwordResetExpires = Date.now() + 1000 * 60 * 10;
  user.passwordResetVerified = false;
  user.save();

  try {
    const messageHTML = `<h2>HI ${user.name} </h2> \n 
     <p>here is your rest code </p>
     <h1>${restCode}<h2>
    `;
    const subject = "test subject";

    await sendEmail({
      email: user.email,
      subject,
      messageHTML,
      name: user.name,
      restCode,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

verifyPassResetCode = handleAsync(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }
  // // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: "Success",
  });
});

resetPassword = handleAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRESIN,
  });
  res.status(200).json({ token });
});
module.exports = { forgetPassword, verifyPassResetCode, resetPassword };
