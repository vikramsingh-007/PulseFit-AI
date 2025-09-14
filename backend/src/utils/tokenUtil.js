const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("./ApiError");

const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";

let PRIVATE_KEY = null;
let PUBLIC_KEY = null;
try {
  if (process.env.JWT_PRIVATE_KEY_PATH && process.env.JWT_PUBLIC_KEY_PATH) {
    PRIVATE_KEY = fs.readFileSync(
      path.resolve(process.env.JWT_PRIVATE_KEY_PATH),
      "utf8"
    );
    PUBLIC_KEY = fs.readFileSync(
      path.resolve(process.env.JWT_PUBLIC_KEY_PATH),
      "utf8"
    );
  }
} catch (error) {
  // if keys missing, we'll fallback to symmetric secret (JWT_SECRET)
}

function createAccessToken(user) {
  const payload = { sub: String(user._id), role: user.role, email: user.email };
  const options = {
    algorithm: PRIVATE_KEY ? "RS256" : "HS256",
    expiresIn: ACCESS_TOKEN_EXPIRES,
    issuer: "pulsefit-ai-api",
    audience: "pulsefit-ai-client",
  };
  return jwt.sign(payload, PRIVATE_KEY || process.env.JWT_SECRET, options);
}

function verifyAccessToken(token) {
  try {
    const key = PUBLIC_KEY || process.env.JWT_SECRET;
    return jwt.verify(token, key, {
      issuer: "pulsefit-ai-api",
      audience: "pulsefit-ai-client",
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Invalid or expired access token"
    );
  }
}

function generateRefreshTokenRaw() {
  return crypto.randomBytes(64).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  createAccessToken,
  verifyAccessToken,
  generateRefreshTokenRaw,
  hashToken,
};
