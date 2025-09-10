const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
};
