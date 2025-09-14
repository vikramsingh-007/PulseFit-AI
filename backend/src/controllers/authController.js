const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const {
  createAccessToken,
  generateRefreshTokenRaw,
  hashToken,
} = require("../utils/tokenUtil");
const RefreshToken = require("../models/RefreshToken");
const sendResponse = require("../utils/response");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const accessToken = createAccessToken(user);
    const refreshTokenRaw = generateRefreshTokenRaw();
    const refreshTokenHash = hashToken(refreshTokenRaw);

    const expiresAt = new Date();
    const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_DAYS || 3
    );
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    await RefreshToken.create({
      tokenHash: refreshTokenHash,
      user: user._id,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      expiresAt,
    });

    res.cookie("refreshToken", refreshTokenRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresAt - Date.now(),
    });

    sendResponse(res, StatusCodes.OK, "Login successful", {
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshTokenRaw = req.cookies.refreshToken;
    if (!refreshTokenRaw) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token missing");
    }

    const refreshTokenHash = hashToken(refreshTokenRaw);
    const storedToken = await RefreshToken.findOne({
      tokenHash: refreshTokenHash,
      revoked: false,
      expiresAt: { $gt: new Date() },
    });
    if (!storedToken) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Invalid or expired refresh token"
      );
    }

    const user = await User.findById(storedToken.user);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User no longer exists");
    }

    storedToken.revoked = true;
    await storedToken.save();

    const newAccessToken = createAccessToken(user);
    const newRefreshTokenRaw = generateRefreshTokenRaw();
    const newRefreshTokenhash = hashToken(newRefreshTokenRaw);

    const expiresAt = new Date();
    const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_DAYS || 3
    );
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    await RefreshToken.create({
      tokenHash: newRefreshTokenhash,
      user: user._id,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      expiresAt,
    });

    res.cookie("refreshToken", refreshTokenRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresAt - Date.now(),
    });

    sendResponse(res, StatusCodes.OK, "Token refresh successfully", {
      accessToken: newAccessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, refresh };
