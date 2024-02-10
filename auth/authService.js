const handleAsync = require("express-async-handler");
const ApiError = require("../api/ApiErrors");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

signUp = handleAsync(async (req, res, next) => {
  req.body.password = await bcrypt.hash(req.body.password, 12);
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRESIN,
  });
  res.status(401).json({ data: user, token });
});

logIn = handleAsync(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "100d",
    });

    req.user = user;
    console.log(user);
    res.status(200).json({ data: user, token });
  } else {
    return next(new ApiError("email or password inccorect", 401));
  }
});

module.exports = { signUp, logIn };
