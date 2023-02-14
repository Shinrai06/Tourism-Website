const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "Public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(8800, () => console.log(`Connected on port ${8800}`));
