const express = require("express");
const router = express.Router();

dotenv.config({ path: "../.env" });

router.get("/login", (req, res) => {
  res.render("/components/login");
});

router.get("/register", (req, res) => {
  res.render("/components/customerRegister");
});

router.post("/register", (req, res) => {
  res.send(req.body);
});

module.exports = router;
