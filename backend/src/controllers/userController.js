const { StatusCodes } = require("http-status-codes");
const { registerUser } = require("../services/userService");
const sendResponse = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    sendResponse(
      res,
      StatusCodes.CREATED,
      "User registered successfully",
      user
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { register };
