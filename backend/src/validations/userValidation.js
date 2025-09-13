const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])")
    )
    .message(
      "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character."
    )
    .required(),
  age: Joi.number().min(10).max(100).optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  height: Joi.number().min(50).max(250).optional(),
  weight: Joi.number().min(20).max(300).optional(),
  activityLevel: Joi.string()
    .valid("sedentary", "light", "moderate", "active", "very_active")
    .default("sedentary"),
  goal: Joi.string()
    .valid("lose_weight", "maintain", "gain_muscle")
    .default("maintain"),
  preferences: Joi.object({
    dietary: Joi.string()
      .valid("vegetarian", "vegan", "non_vegetarian", "eggetarian")
      .default("vegetarian"),
    allergies: Joi.array().items(Joi.string().trim().lowercase()).default([]),
  }).optional(),
});

module.exports = { registerSchema };
