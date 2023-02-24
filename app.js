require("dotenv").config({ path: ".env" });
const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.mongoDB)
  .then(() => console.log("moongoDB connected!!!"))
  .catch((err) => console.log(err));

app.use(
  session({
    secret: process.env.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/Public")));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.admin = req.session.admin;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/logout", (req, res) => {
  if (req.session.user) req.session.user = null;
  if (req.session.admin) req.session.admin = null;
  req.flash("success", "logged Out!!!");
  res.redirect("/");
});

app.get("/error", (req, res) => {
  res.render("SQLerror", { err: "DB ERROR!!!" });
});

app.listen(8800, () => console.log(`Connected on port ${8800}`));
