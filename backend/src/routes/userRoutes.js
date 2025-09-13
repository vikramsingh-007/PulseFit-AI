const express = require("express");
const validate = require("../middleware/validate");
const { registerSchema } = require("../validations/userValidation");
const { register } = require("../controllers/userController");

const router = express.Router();

router.post("/register", validate(registerSchema), register);

module.exports = router;
