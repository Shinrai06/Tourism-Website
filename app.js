const express = require("express");
const ejsMate = require("ejs-mate");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql2");
const methodOverride = require("method-override");

// const userRoutes = require("./routes/user");
// const adminRoutes = require("./routes/admin");

dotenv.config();
const app = express();

const { PORT, USER, PASSWORD } = process.env;
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "Public")));

const SqlDB = mysql.createConnection({
  host: "localhost",
  user: USER,
  password: PASSWORD,
  database: "dbd",
});

app.get("/", (req, res) => {
  console.log("Express Conected");
  res.render("index");
});

// app.get("/user", userRoutes);
// app.get("/admin", adminRoutes);

app.get("/user/login", (req, res) => {
  res.render("components/login");
});
app.get("/user/register", (req, res) => {
  res.render("components/customerRegister");
});
app.get("/admin/login", (req, res) => {
  res.render("components/login");
});
app.get("/admin/register", (req, res) => {
  res.render("components/adminRegister");
});
app.post("/user/login", (req, res) => {
  res.send(req.body);
});
app.post("/user/register", (req, res) => {
  const { name, email, password, contact, address } = req.body;
  const raw = `insert into CUSTOMERS values(UUID_TO_BIN(UUID()), '${name}', '${email}', '${contact}', '${address}', '${password}')`;
  SqlDB.query(raw, (err, row, col) => {
    if (err) console.log(err);
  });
  res.send(req.body);
});
app.post("/admin/login", (req, res) => {
  res.send(req.body);
});
app.post("/admin/register", (req, res) => {
  const { name, email, password, contact1, contact2 } = req.body;
  const raw = `insert into ADMINISTRATORS values(UUID_TO_BIN(UUID()), '${name}', '${email}', '${contact1}', '${contact2}', '${password}')`;
  SqlDB.query(raw, (err, row, col) => {
    if (err) console.log(err);
  });
  res.send(req.body);
});

app.listen(PORT, () => console.log(`Connected on port ${PORT}`));
