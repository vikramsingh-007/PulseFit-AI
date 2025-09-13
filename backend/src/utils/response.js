function sendResponse(res, statusCode, message, data = null, errors = []) {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
    errors,
  });
}

module.exports = sendResponse;
