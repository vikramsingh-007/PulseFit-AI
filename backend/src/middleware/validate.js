const ApiError = require("../utils/ApiError");

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return next(new ApiError(400, "Validation failed", errors));
    }
    req.body = value;
    next();
  };
}

module.exports = validate;
