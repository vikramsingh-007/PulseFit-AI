const { StatusCodes } = require("http-status-codes");
const sendResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (statusCode === StatusCodes.INSUFFICIENT_STORAGE) {
    console.error("Unexpected Error: ", err);
  }
  sendResponse(res, statusCode, message, null, errors);
};

module.exports = errorHandler;
