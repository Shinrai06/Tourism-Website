const express = require("express");
const router = express.Router();

dotenv.config({ path: "../.env" });

router.get("/register", (req, res) => {
  res.render("components/adminRegister");
});

router.post("/register", (req, res) => {
  const { name, email, password, contact1, contact2 } = req.body;
  SqlDB.connect((err) => {
    try {
      if (err) throw err;
      const raw = `insert into ADMINISTRATORS values(UUID_TO_BIN(UUID()), '${name}', '${email}', ${contact1}, ${contact2}, '${password}')`;
      SqlDB.query(raw, (err, row, col) => {
        if (err) throw err;
      });
    } catch (err) {
      console.log("Admin Register " + err);
    }
  });
  res.send(req.body);
});

router.get("/login", (req, res) => {
  res.render("/components/login");
});

module.exports = router;
