const User = require("../models/User");
const ApiError = require("../utils/ApiError");

async function registerUser(userData) {
  try {
    userData.email = userData.email.toLowerCase().trim();

    const user = await User.create(userData);
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    if (error.code === 11000) {
      // Handle race condition if two requests register same email simultaneously
      throw new ApiError(400, "Email already exists");
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      throw new ApiError(400, "Validation failed", errors);
    }
    throw new ApiError(500, "Error creating user");
  }
}

module.exports = { registerUser };
