const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { verifyAccessToken } = require("../utils/tokenUtil");

const ensureAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Missing access token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Auth middleware failed")
    );
  }
};

module.exports = ensureAuthenticated;
