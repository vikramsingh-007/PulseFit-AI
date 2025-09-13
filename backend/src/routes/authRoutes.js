const express = require("express");
const { login } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { loginSchema } = require("../validations/authValidation");
const router = express.Router();

router.post("/login", validate(loginSchema), login);

router.post("/refresh", (req, res) => {
  res.json({ message: "Refresh token route placeholder" });
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logout route placeholder" });
});

module.exports = router;
