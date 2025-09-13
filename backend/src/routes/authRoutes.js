const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  res.json({ message: "Login route placeholder" });
});

router.post("/refresh", (req, res) => {
  res.json({ message: "Refresh token route placeholder" });
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logout route placeholder" });
});

module.exports = router;
