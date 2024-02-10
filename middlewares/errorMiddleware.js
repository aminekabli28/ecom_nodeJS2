const ApiError = require("../api/ApiErrors");
const sendErrorForDev = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });

const sendErrorForProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again..", 401);

const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "dev") {
    sendErrorForDev(error, res);
  } else {
    if (error.name === "JsonWebTokenError") error = handleJwtInvalidSignature();
    if (error.name === "TokenExpiredError") {
      error = handleJwtExpired();
    }
    sendErrorForProd(error, res);
  }
};

module.exports = globalError;
