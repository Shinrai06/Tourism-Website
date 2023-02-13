const dotenv = require("dotenv");
const mysql = require("mysql2");

dotenv.config({ path: "../.env" });

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "dbd",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected");

  connection.query("drop database dbd", (err, row, col) => {
    console.log("Deleted DBD");
  });
  connection.query("create database dbd", (err, row, col) => {
    console.log("Created DBD");
  });
  connection.query("use dbd", (err, row, col) => {
    console.log("Switched DBD");
  });

  const CUSTOMERS = `create table CUSTOMERS(U_id BINARY(16) PRIMARY KEY, Name varchar(20), 
                      Email nvarchar(320), Contact varchar(15), Address varchar(50), Password varchar(14))`;

  const ADMINISTRATORS = `create table ADMINISTRATORS(A_id BINARY(16) PRIMARY KEY, Name varchar(20), 
                      Email nvarchar(320), Contact_1 varchar(15), Contact_2 varchar(15), Password varchar(14))`;

  const BILLING = `create table BILLING(Id BINARY(16) PRIMARY KEY, U_id BINARY(16) references CUSTOMERS(U_id),
                    P_id BINARY(16) references PLANS(P_id), Date date, Ref_no varchar(15), Type varchar(10), Coupons varchar(10))`;

  const PLANS = `create table PLANS(P_id BINARY(16) primary key, Category varchar(3), Title varchar(15), G_location varchar(15),
                  Cost decimal(10, 2), Photo varchar(50), Days int, A_id BINARY(16) references ADMINISTRATORS(A_id))`;

  const TRANSPORT = `create table TRANSPORT(Vehicle varchar(10), P_id Binary(16) references PLANS(P_id))`;

  const TOURISM_ATTRACTION = `create table TOURISM_ATTRACTION(T_id binary(16) primary key, Name varchar(20), Description varchar(100),
                            M_location varchar(15), Cost decimal(10, 2), Hotel varchar(15), P_id Binary(16) references PLANS(P_id))`;

  connection.query(CUSTOMERS, (err, row, col) => {
    if (err) console.log(err);
    console.log("Created Table CUSTOMERS");
  });
  connection.query(ADMINISTRATORS, (err, row, col) => {
    console.log("Created Table ADMINISTRATORS");
  });
  connection.query(PLANS, (err, row, col) => {
    console.log("Created Table PLANS");
  });
  connection.query(TOURISM_ATTRACTION, (err, row, col) => {
    console.log("Created Table TOURISM_ATTRACTION");
  });
  connection.query(TRANSPORT, (err, row, col) => {
    console.log("Created Table TRANSPORT");
  });
  connection.query(BILLING, (err, row, col) => {
    if (err) console.log(err);
    console.log("Created Table BILLING");
  });
});
