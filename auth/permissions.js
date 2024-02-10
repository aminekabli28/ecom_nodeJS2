const handleAsync = require("express-async-handler");
const ApiError = require("../api/ApiErrors");

allowedTo = (...roles) =>
  handleAsync(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

module.exports = allowedTo;
