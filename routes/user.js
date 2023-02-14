const express = require("express");
const router = express.Router();
const Customer = require("../Public/js/models/Customer");

router.get("/login", (req, res) => {
  res.render("components/login");
});

router.post("/user/login", (req, res) => {
  res.send(req.body);
});

router.get("/register", (req, res) => {
  res.render("components/user/register");
});

router.post("/register", async (req, res) => {
  const { name, email, password, contact, address } = req.body;
  const newUser = new Customer(name, email, contact, address, password);
  await newUser.save();
  res.send(req.body);
});

module.exports = router;
