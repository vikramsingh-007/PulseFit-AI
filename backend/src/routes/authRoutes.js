const express = require("express");
const { login, refresh, logout } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { loginSchema } = require("../validations/authValidation");
const router = express.Router();

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", logout);

module.exports = router;
