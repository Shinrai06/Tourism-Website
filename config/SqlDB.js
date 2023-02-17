const mysql = require("mysql2");

const SqlDB = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

console.log("MySQL_DB connected");

module.exports = SqlDB.promise();
