const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });
mongoose.connect(process.env.MONGO);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.close();
