const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

console.log(process.env.password);

const SqlDB = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

module.exports = SqlDB.promise();
