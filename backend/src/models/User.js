const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { SALT_ROUNDS } = require("../config/serverConfig");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          "Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      },
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    height: { type: Number, min: 50, max: 250 },
    weight: { type: Number, min: 20, max: 300 },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      default: "sedentary",
    },
    goal: {
      type: String,
      enum: ["lose_weight", "maintain", "gain_muscle"],
      default: "maintain",
    },
    preferences: {
      dietary: {
        type: String,
        enum: ["vegetarian", "vegan", "non_vegetarian", "eggetarian"],
        default: "vegetarian",
      },
      allergies: {
        type: [{ type: String, lowercase: true, trim: true }],
        default: [],
      },
    },
    aiRecommendations: {
      dietPlan: {
        type: Object,
        default: {},
      },
      workoutPlan: {
        type: Object,
        default: {},
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (!update) return next();

  const password = update.password || update.$set?.password;
  if (password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    if (update.password) update.password = hash;
    if (update.$set?.password) update.$set.password = hash;

    this.setUpdate(update);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
